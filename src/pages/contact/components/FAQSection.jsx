import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqCategories = [
    {
      category: "General Questions",
      icon: "HelpCircle",
      faqs: [
        {
          id: 1,
          question: "What are your business hours?",
          answer: "We are open daily from 9:00 AM to 9:00 PM, including weekends and most public holidays. For urgent repairs, we offer 24/7 emergency support through our hotline."
        },
        {
          id: 2,
          question: "Do you provide home service?",
          answer: "Yes, we offer home service for mobile repairs and CSC document collection within our service zones. Home service charges vary based on your location and service type."
        },
        {
          id: 3,
          question: "What payment methods do you accept?",
          answer: "We accept all major payment methods including Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Digital Wallets. EMI options are available for purchases above ₹10,000."
        }
      ]
    },
    {
      category: "Mobile Repair Services",
      icon: "Wrench",
      faqs: [
        {
          id: 4,
          question: "How long does a typical repair take?",
          answer: "Most common repairs like screen replacement or battery change are completed within 30-60 minutes. Complex repairs may take 2-4 hours. We provide accurate time estimates during diagnosis."
        },
        {
          id: 5,
          question: "Do you use original spare parts?",
          answer: "We offer both original OEM parts and high-quality compatible parts. Original parts come with manufacturer warranty, while compatible parts have our 6-month service warranty."
        },
        {
          id: 6,
          question: "What warranty do you provide on repairs?",
          answer: "All repairs come with a minimum 3-month service warranty. Original parts carry manufacturer warranty (typically 6-12 months). Water damage repairs have a 1-month warranty."
        }
      ]
    },
    {
      category: "CSC Services",
      icon: "FileText",
      faqs: [
        {
          id: 7,
          question: "What government services can I access through your CSC?",
          answer: "We provide Aadhaar services, PAN card applications, passport assistance, digital certificates, utility bill payments, insurance services, and various government scheme applications."
        },
        {
          id: 8,
          question: "What documents do I need for Aadhaar services?",
          answer: "For Aadhaar enrollment: Proof of Identity (any government ID), Proof of Address (utility bill/rent agreement), and Date of Birth proof. For updates, bring your existing Aadhaar card."
        },
        {
          id: 9,
          question: "How long does it take to process CSC applications?",
          answer: "Processing times vary by service: Aadhaar enrollment (15-20 days), PAN card (7-10 days), Digital certificates (instant to 2 days). We provide tracking numbers for all applications."
        }
      ]
    },
    {
      category: "Products & Delivery",
      icon: "ShoppingBag",
      faqs: [
        {
          id: 10,
          question: "Do you offer EMI on mobile purchases?",
          answer: "Yes, we offer 0% EMI on select models for 3, 6, and 12 months through major credit cards and digital lending partners. Minimum purchase value of ₹10,000 required."
        },
        {
          id: 11,
          question: "What is your return and exchange policy?",
          answer: "We offer 7-day return/exchange for unopened products and 3-day exchange for opened products with manufacturing defects. Products must be in original condition with all accessories and packaging."
        },
        {
          id: 12,
          question: "Do you provide home delivery?",
          answer: "Yes, we provide free home delivery within our primary service zones (Sector 15-22). Delivery charges apply for extended areas. Same-day delivery available for orders placed before 2 PM."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories?.map(category => ({
    ...category,
    faqs: category?.faqs?.filter(faq =>
      faq?.question?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      faq?.answer?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  }))?.filter(category => category?.faqs?.length > 0);

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about our services
          </p>

          <div className="max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
            />
          </div>
        </div>

        {filteredFAQs?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No FAQs found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFAQs?.map((category) => (
              <div key={category?.category}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={category?.icon} size={20} color="var(--color-primary)" />
                  </div>
                  <h3 className="text-2xl font-headline font-semibold text-foreground">
                    {category?.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category?.faqs?.map((faq) => (
                    <div
                      key={faq?.id}
                      className="bg-card border border-border rounded-lg overflow-hidden transition-smooth hover:shadow-soft"
                    >
                      <button
                        onClick={() => toggleFAQ(faq?.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-smooth touch-target"
                      >
                        <span className="font-medium text-foreground pr-4">
                          {faq?.question}
                        </span>
                        <Icon
                          name={expandedFAQ === faq?.id ? "ChevronUp" : "ChevronDown"}
                          size={20}
                          className="text-muted-foreground flex-shrink-0"
                        />
                      </button>

                      {expandedFAQ === faq?.id && (
                        <div className="px-6 pb-4 pt-2 border-t border-border">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq?.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <Icon name="MessageCircle" size={32} color="var(--color-primary)" className="mb-3" />
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Still have questions?
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is here to help you
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                <Icon name="Phone" size={16} />
                <span className="text-sm font-medium">Call Us</span>
              </a>
              <a
                href="mailto:support@shivmobilehub.com"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-smooth"
              >
                <Icon name="Mail" size={16} />
                <span className="text-sm font-medium">Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;