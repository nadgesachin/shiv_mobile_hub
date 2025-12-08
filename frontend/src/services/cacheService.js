/**
 * Cache service to store API responses in localStorage and reduce unnecessary API calls
 */
class CacheService {
  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @param {number} expiryTimeInMinutes - Cache expiry time in minutes
   * @returns {any|null} Cached data or null if not found or expired
   */
  static get(key, expiryTimeInMinutes = 60) {
    try {
      const cachedData = localStorage.getItem(`cache_${key}`);
      
      if (!cachedData) {
        return null;
      }
      
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      // Check if cache has expired
      if (now - timestamp > expiryTimeInMinutes * 60 * 1000) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }
  
  /**
   * Store data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @returns {boolean} True if data was cached successfully
   */
  static set(key, data) {
    try {
      const cacheItem = {
        data,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      return true;
    } catch (error) {
      console.error('Error writing to cache:', error);
      return false;
    }
  }
  
  /**
   * Remove item from cache
   * @param {string} key - Cache key
   */
  static remove(key) {
    localStorage.removeItem(`cache_${key}`);
  }
  
  /**
   * Clear all cache items
   */
  static clear() {
    const keysToRemove = [];
    
    // Find all cache keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all cache items
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  /**
   * Get data from cache if available, otherwise fetch from API and cache the result
   * @param {string} key - Cache key
   * @param {function} fetchCallback - Function that returns a Promise resolving to the data
   * @param {number} expiryTimeInMinutes - Cache expiry time in minutes
   * @returns {Promise<any>} Data from cache or API
   */
  static async getOrFetch(key, fetchCallback, expiryTimeInMinutes = 60) {
    // Try to get from cache first
    const cachedData = this.get(key, expiryTimeInMinutes);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    // If not in cache or expired, fetch from API
    try {
      const freshData = await fetchCallback();
      
      // Cache the new data
      this.set(key, freshData);
      
      return freshData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  /**
   * Invalidate cache items that match a prefix
   * @param {string} keyPrefix - Cache key prefix to invalidate
   */
  static invalidateByPrefix(keyPrefix) {
    const keysToRemove = [];
    const prefix = `cache_${keyPrefix}`;
    
    // Find all matching cache keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove matched cache items
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default CacheService;
