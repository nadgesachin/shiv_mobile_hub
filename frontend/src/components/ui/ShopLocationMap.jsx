import React, { useState } from 'react';
import Icon from '../AppIcon';

const ShopLocationMap = ({ locations = [] }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Default locations if none are provided
  const defaultLocations = [
    {
      id: 1,
      name: 'Shiv Mobile Hub - Main Branch',
      address: '123 M.G. Road, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      hours: 'Mon-Sat: 10:00 AM - 8:00 PM',
      coordinates: { lat: 19.075983, lng: 72.877655 },
      services: ['Mobile Repair', 'Accessories', 'SIM Cards', 'Government Services']
    },
    {
      id: 2,
      name: 'Shiv Mobile Hub - Andheri Branch',
      address: '45 Andheri East, Mumbai, Maharashtra 400069',
      phone: '+91 91234 56789',
      hours: 'Mon-Sun: 9:00 AM - 9:00 PM',
      coordinates: { lat: 19.119900, lng: 72.847870 },
      services: ['Mobile Repair', 'Accessories', 'SIM Cards']
    },
    {
      id: 3,
      name: 'Shiv Mobile Hub - Thane Branch',
      address: '78 Gokhale Road, Thane, Maharashtra 400602',
      phone: '+91 87654 32109',
      hours: 'Mon-Sat: 10:30 AM - 7:30 PM',
      coordinates: { lat: 19.197048, lng: 72.977759 },
      services: ['Mobile Repair', 'Government Services', 'Recharge Services']
    }
  ];
  
  const shopLocations = locations.length > 0 ? locations : defaultLocations;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Icon name="MapPin" size={18} className="text-primary" />
          Our Store Locations
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-0">
        {/* Map container - in a real app would be an actual map */}
        <div className="relative h-[300px] md:h-full min-h-[300px] bg-muted/30 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* This is a placeholder. In a real implementation, you would use Google Maps or another map API */}
            <div className="text-center p-6">
              <Icon name="Map" size={40} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Map would be displayed here using Google Maps or similar API.
                <br />
                <span className="text-xs">For implementation, you will need to add the Maps API key to the project.</span>
              </p>
            </div>
          </div>
          
          {/* Sample map markers */}
          {shopLocations.map((location) => (
            <div 
              key={location.id}
              className={`absolute w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                selectedLocation === location.id ? 'ring-4 ring-primary/30 scale-125' : ''
              }`}
              style={{
                top: `${(Math.random() * 60) + 20}%`, 
                left: `${(Math.random() * 60) + 20}%`,
              }}
              onClick={() => setSelectedLocation(location.id === selectedLocation ? null : location.id)}
            >
              <span className="text-xs font-bold">{location.id}</span>
            </div>
          ))}
        </div>
        
        {/* Location details */}
        <div className="p-4">
          <h3 className="text-base font-medium mb-3">Our Branches</h3>
          
          <div className="space-y-3">
            {shopLocations.map((location) => (
              <div 
                key={location.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedLocation === location.id
                    ? 'bg-primary/5 border-primary'
                    : 'bg-card border-border hover:bg-muted/20'
                }`}
                onClick={() => setSelectedLocation(location.id === selectedLocation ? null : location.id)}
              >
                <h4 className="font-medium text-sm flex items-center justify-between">
                  {location.name}
                  <span className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    {location.hours}
                  </span>
                </h4>
                
                <p className="text-xs text-muted-foreground mb-2 flex items-start gap-1.5">
                  <Icon name="MapPin" size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{location.address}</span>
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, '')}`}
                      className="text-xs flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      <Icon name="Phone" size={12} />
                      Call
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-xs flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded"
                    >
                      <Icon name="Navigation" size={12} />
                      Directions
                    </a>
                  </div>
                  
                  {selectedLocation === location.id && (
                    <button 
                      className="text-xs text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLocation(null);
                      }}
                    >
                      Hide Details
                    </button>
                  )}
                </div>
                
                {selectedLocation === location.id && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <h5 className="text-xs font-medium mb-1">Available Services:</h5>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-muted px-1.5 py-0.5 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLocationMap;
