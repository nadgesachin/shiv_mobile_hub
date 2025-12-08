import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import ContactHero from './components/ContactHero';
import QuickContactCards from './components/QuickContactCards';
import ContactForm from './components/ContactForm';
import ServiceAreaMap from './components/ServiceAreaMap';
import FAQSection from './components/FAQSection';
import CommunityEvents from './components/CommunityEvents';
import SocialMediaFeed from './components/SocialMediaFeed';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <ContactHero />
        <QuickContactCards />
        <ContactForm />
        <ServiceAreaMap />
        <FAQSection />
        {/* <CommunityEvents /> */}
        <SocialMediaFeed />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;