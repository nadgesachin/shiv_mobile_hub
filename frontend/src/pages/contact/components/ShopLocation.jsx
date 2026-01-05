import React from 'react';
import Icon from '../../../components/AppIcon';

const ShopLocation = () => {
  const shopInfo = {
    name: "Shiv Mobile Hub",
    address: "Shop No. 12, Main Market, Near City Mall",
    city: "Your City, State - 123456",
    phone: "+91 98765 43210",
    email: "info@shivmobilehub.com",
    hours: {
      weekdays: "10:00 AM - 8:00 PM",
      weekends: "10:00 AM - 9:00 PM"
    },
    coordinates: {
      lat: 28.6139, // Example coordinates (Delhi) - replace with actual
      lng: 77.2090
    }
  };

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${shopInfo.coordinates.lat},${shopInfo.coordinates.lng}&zoom=15`;
  
  // Alternative: Use simple iframe with coordinates
  const simpleMapUrl = `https://www.google.com/maps?q=${shopInfo.coordinates.lat},${shopInfo.coordinates.lng}&hl=es;z=14&output=embed`;

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Visit Our Shop
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Come visit us at our physical store for the best mobile service experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shop Information */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <Icon name="MapPin" size={24} className="text-primary mr-3" />
                Shop Details
              </h3>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Icon name="Home" size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Address</p>
                    <p className="text-muted-foreground">{shopInfo.address}</p>
                    <p className="text-muted-foreground">{shopInfo.city}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Icon name="Phone" size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Phone</p>
                    <a href={`tel:${shopInfo.phone}`} className="text-primary hover:underline">
                      {shopInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Icon name="Mail" size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Email</p>
                    <a href={`mailto:${shopInfo.email}`} className="text-primary hover:underline">
                      {shopInfo.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Icon name="Clock" size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Opening Hours</p>
                    <p className="text-muted-foreground">Monday - Friday: {shopInfo.hours.weekdays}</p>
                    <p className="text-muted-foreground">Saturday - Sunday: {shopInfo.hours.weekends}</p>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${shopInfo.coordinates.lat},${shopInfo.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Navigation" size={20} className="mr-2" />
                Get Directions
              </a>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <Icon name="Phone" size={24} className="text-primary mb-2" />
                <p className="text-sm font-semibold text-foreground">Call Us</p>
                <a href={`tel:${shopInfo.phone}`} className="text-sm text-primary hover:underline">
                  {shopInfo.phone}
                </a>
              </div>

              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <Icon name="MessageCircle" size={24} className="text-success mb-2" />
                <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                <a 
                  href={`https://wa.me/91${shopInfo.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-success hover:underline"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-full min-h-[400px] lg:min-h-[600px]">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft h-full">
              <iframe
                src={simpleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop Location Map"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Landmarks/How to Reach */}
        <div className="mt-12 bg-muted/30 border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Icon name="MapPin" size={24} className="text-primary mr-3" />
            How to Reach Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Icon name="Car" size={20} className="text-primary mr-2" />
                <p className="font-semibold text-foreground">By Car</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Ample parking available. Located on the main road, easy access from all directions.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Icon name="Bus" size={20} className="text-primary mr-2" />
                <p className="font-semibold text-foreground">By Public Transport</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Bus stop 100m away. Metro station within 500m walking distance.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Icon name="MapPin" size={20} className="text-primary mr-2" />
                <p className="font-semibold text-foreground">Nearby Landmarks</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Next to City Mall, opposite Central Bank, near Main Market Circle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopLocation;
