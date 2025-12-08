import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CertificationDisplay = ({ certifications }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Award" size={24} color="var(--color-success)" />
        </div>
        <div>
          <h3 className="text-lg font-headline font-semibold text-foreground">
            Our Certifications & Authorizations
          </h3>
          <p className="text-sm text-muted-foreground">
            Verified and authorized by government bodies
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications?.map((cert) => (
          <div key={cert?.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth border border-border">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image 
                  src={cert?.logo} 
                  alt={cert?.logoAlt}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{cert?.name}</h4>
                  {cert?.isVerified && (
                    <Icon name="BadgeCheck" size={20} color="var(--color-success)" className="flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{cert?.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>Valid till: {cert?.validTill}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="FileText" size={12} />
                    <span>ID: {cert?.certificationId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-success/5 rounded-lg border border-success/20">
        <div className="flex items-start space-x-3">
          <Icon name="ShieldCheck" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              100% Secure & Authorized
            </p>
            <p className="text-xs text-muted-foreground">
              All our services are provided under official government authorization. Your data is protected with bank-level security and handled according to government data protection guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationDisplay;