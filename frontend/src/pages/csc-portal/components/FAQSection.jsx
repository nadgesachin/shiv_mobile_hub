import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="HelpCircle" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-headline font-semibold text-foreground">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-muted-foreground">
            Find answers to common questions about our CSC services
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {faqs?.map((faq, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-smooth text-left"
            >
              <div className="flex items-start space-x-3 flex-1">
                <Icon 
                  name={faq?.icon} 
                  size={20} 
                  color="var(--color-primary)" 
                  className="flex-shrink-0 mt-0.5"
                />
                <span className="font-medium text-foreground">{faq?.question}</span>
              </div>
              <Icon 
                name={openIndex === index ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                color="var(--color-muted-foreground)"
                className="flex-shrink-0 ml-2"
              />
            </button>
            
            {openIndex === index && (
              <div className="p-4 bg-background border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq?.answer}
                </p>
                {faq?.additionalInfo && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Note: </span>
                      {faq?.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="MessageCircle" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">
              Still have questions?
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Our support team is here to help you with any queries about government services.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="tel:+919876543210" className="inline-flex items-center space-x-1 text-xs text-primary hover:underline">
                <Icon name="Phone" size={14} />
                <span>Call: +91 98765 43210</span>
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="mailto:support@shivmobilehub.com" className="inline-flex items-center space-x-1 text-xs text-primary hover:underline">
                <Icon name="Mail" size={14} />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;