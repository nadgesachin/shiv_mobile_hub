/*
 * cacheProductImages.js
 *
 * Downloads every product image URL from MongoDB, stores a local copy under
 * backend/upload/image, and rewrites the product image URLs to point to the
 * local asset path (e.g., /upload/image/<filename>). Use this to self-host
 * product images instead of hot-linking third-party URLs.
 *
 * Usage:
 *   cd backend
 *   node scripts/cacheProductImages.js
 *
 * Environment variables (backend/.env):
 *   MONGODB_URI             -> Mongo connection string
 *   LOCAL_IMAGE_BASE_URL    -> Optional. Defaults to /upload/image
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const OUTPUT_DIR = path.resolve(__dirname, '../upload/image');
const BASE_URL = process.env.LOCAL_IMAGE_BASE_URL || '/upload/image';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shiv-mobile-hub';

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}`);
  }
}

function sanitizeFilename(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

function getFileExtension(urlString) {
  try {
    const parsed = new URL(urlString);
    const ext = path.extname(parsed.pathname);
    if (ext) return ext.split('?')[0];
  } catch (error) {
    // ignore parsing problems
  }
  return '.jpg';
}

function downloadImage(fileUrl, destination) {
  const protocol = fileUrl.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    const request = protocol.get(fileUrl, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(downloadImage(response.headers.location, destination));
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${fileUrl} (status: ${response.statusCode})`));
      }

      const fileStream = fs.createWriteStream(destination);
      response.pipe(fileStream);

      fileStream.on('finish', () => fileStream.close(resolve));
      fileStream.on('error', (err) => {
        fs.unlink(destination, () => reject(err));
      });
    });

    request.on('error', reject);
  });
}

async function cacheImages() {
  ensureOutputDir();

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({ 'images.0': { $exists: true } });
  console.log(`Found ${products.length} products with images.`);

  let downloadCount = 0;

  for (const product of products) {
    const updatedImages = [];

    for (let index = 0; index < product.images.length; index += 1) {
      const image = product.images[index];
      if (!image?.url) continue;

      try {
        const extension = getFileExtension(image.url);
        const filenameBase = sanitizeFilename(`${product.name}-${product._id}-${index}`) || `product-${product._id}-${index}`;
        const filename = `${filenameBase}${extension}`;
        const destinationPath = path.join(OUTPUT_DIR, filename);

        if (!fs.existsSync(destinationPath)) {
          await downloadImage(image.url, destinationPath);
          downloadCount += 1;
          console.log(`Downloaded: ${filename}`);
        } else {
          console.log(`Skipping download (already exists): ${filename}`);
        }

        const localUrl = `${BASE_URL}/${filename}`.replace(/\\/g, '/');
        updatedImages.push({
          ...image.toObject?.() ?? image,
          url: localUrl,
          localPath: destinationPath
        });
      } catch (error) {
        console.error(`Failed to cache image for product ${product._id}:`, error.message);
        updatedImages.push(image);
      }
    }

    if (updatedImages.length > 0) {
      product.images = updatedImages;
      await product.save();
    }
  }

  console.log(`Finished processing products. Downloaded ${downloadCount} new images.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

cacheImages()
  .then(() => {
    console.log('Image caching complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Image caching failed:', error);
    process.exit(1);
  });
