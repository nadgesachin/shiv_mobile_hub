import React from 'react';
import Icon from '../../../components/AppIcon';

const ContactHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzFmMjkzNyIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Icon name="MessageCircle" size={18} color="var(--color-primary)" />
            <span className="text-sm font-medium text-primary">We're Here to Help</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-headline font-bold text-foreground mb-6">
            Get in Touch with
            <span className="block text-primary mt-2">Shiv Mobile Hub</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted digital neighborhood partner is just a message away. Whether you need technical support, service information, or have questions about our offerings, we're ready to assist you.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-lg">
              <Icon name="Clock" size={18} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">Open 9 AM - 9 PM Daily</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-secondary/10 rounded-lg">
              <Icon name="Shield" size={18} color="var(--color-secondary)" />
              <span className="text-sm font-medium text-secondary">CSC Certified</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-lg">
              <Icon name="Award" size={18} color="var(--color-accent)" />
              <span className="text-sm font-medium text-accent">ISO Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;