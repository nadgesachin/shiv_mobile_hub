import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'Services',
      links: [
        { label: 'Mobile Repair', path: '/services-hub' },
        { label: 'Government Services', path: '/csc-portal' },
        { label: 'Mobile Recharge', path: '/services-hub' },
        { label: 'Bill Payments', path: '/services-hub' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Mobile Phones', path: '/products-catalog' },
        { label: 'Accessories', path: '/products-catalog' },
        { label: 'Spare Parts', path: '/products-catalog' },
        { label: 'Bulk Orders', path: '/products-catalog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/homepage' },
        { label: 'Contact', path: '/contact' },
        { label: 'Careers', path: '/homepage' },
        { label: 'Privacy Policy', path: '/homepage' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/contact' },
        { label: 'Track Order', path: '/customer-dashboard' },
        { label: 'Returns', path: '/customer-dashboard' },
        { label: 'FAQs', path: '/contact' },
      ],
    },
  ];

  const socialLinks = [
    { icon: 'Facebook', label: 'Facebook', url: '#' },
    { icon: 'Instagram', label: 'Instagram', url: '#' },
    { icon: 'Twitter', label: 'Twitter', url: '#' },
    { icon: 'Youtube', label: 'YouTube', url: '#' },
  ];

  const certifications = [
    { icon: 'Shield', label: 'CSC Certified' },
    { icon: 'Award', label: 'ISO Certified' },
    { icon: 'CheckCircle', label: 'Verified Business' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-wrap gap-10 lg:gap-14">

          {/* Left Section */}
          <div className="w-full md:w-1/2 lg:w-auto flex-[2] min-w-[260px]">
            <Link to="/homepage" className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon
                  name="Smartphone"
                  size={24}
                  color="var(--color-primary)"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-headline font-bold text-foreground">
                  Shiv Mobile Hub
                </span>
                <span className="text-xs text-muted-foreground">
                  Your Digital Neighborhood Partner
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Trusted mobile services and government solutions provider serving
              the community with expertise, reliability, and care since 2020.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              {certifications?.map((cert) => (
                <div
                  key={cert?.label}
                  className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-md"
                >
                  <Icon
                    name={cert?.icon}
                    size={16}
                    color="var(--color-success)"
                  />
                  <span className="text-xs font-medium text-success">
                    {cert?.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              {socialLinks?.map((social) => (
                <a
                  key={social?.label}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-muted rounded-md hover:bg-primary hover:text-primary-foreground transition-smooth"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Other Sections */}
          {footerSections?.map((section) => (
            <div
              key={section?.title}
              className="flex-1 min-w-[150px]"
            >
              <h3 className="text-sm font-headline font-semibold text-foreground mb-4">
                {section?.title}
              </h3>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.label}>
                    <Link
                      to={link?.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} Shiv Mobile Hub. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <Link
                to="/homepage"
                className="hover:text-primary transition-smooth"
              >
                Terms of Service
              </Link>
              <span className="hidden md:inline">•</span>
              <Link
                to="/homepage"
                className="hover:text-primary transition-smooth"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={16} />
              <span>Serving the community with trust</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;