import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceCard from './components/ServiceCard';
import DocumentChecklist from './components/DocumentChecklist';
import ApplicationTracker from './components/ApplicationTracker';
import AppointmentBooking from './components/AppointmentBooking';
import CertificationDisplay from './components/CertificationDisplay';
import FAQSection from './components/FAQSection';
import ProcessSteps from './components/ProcessSteps';

const CSCPortal = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showDocumentChecklist, setShowDocumentChecklist] = useState(false);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  const cscServices = [
  {
    id: 1,
    title: "Aadhaar Services",
    description: "Complete Aadhaar card services including new enrollment, updates, corrections, and biometric authentication for various government schemes.",
    icon: "CreditCard",
    iconColor: "var(--color-primary)",
    bgColor: "bg-primary/10",
    isPopular: true,
    features: ["New Enrollment", "Update Details", "Biometric Lock/Unlock"],
    processingTime: "1-2 days",
    documents: [
    {
      id: "aadhar-1",
      name: "Proof of Identity",
      description: "Any government-issued photo ID (Passport, Voter ID, Driving License, PAN Card)",
      icon: "IdCard",
      isMandatory: true,
      specifications: ["Clear photo", "Valid document", "Colored scan"]
    },
    {
      id: "aadhar-2",
      name: "Proof of Address",
      description: "Recent utility bill, bank statement, or rent agreement (not older than 3 months)",
      icon: "Home",
      isMandatory: true,
      specifications: ["Within 3 months", "Clear text", "Full page scan"]
    },
    {
      id: "aadhar-3",
      name: "Date of Birth Proof",
      description: "Birth certificate, school leaving certificate, or passport",
      icon: "Calendar",
      isMandatory: true,
      specifications: ["Official document", "Clear date visible"]
    }]

  },
  {
    id: 2,
    title: "PAN Card Services",
    description: "Apply for new PAN card, make corrections, request duplicate PAN, and link PAN with Aadhaar for seamless tax filing and financial transactions.",
    icon: "FileText",
    iconColor: "var(--color-secondary)",
    bgColor: "bg-secondary/10",
    isPopular: true,
    features: ["New Application", "Corrections", "PAN-Aadhaar Link"],
    processingTime: "7-15 days",
    documents: [
    {
      id: "pan-1",
      name: "Identity Proof",
      description: "Aadhaar card, Passport, Voter ID, or Driving License",
      icon: "User",
      isMandatory: true,
      specifications: ["Government issued", "Photo ID", "Valid"]
    },
    {
      id: "pan-2",
      name: "Address Proof",
      description: "Aadhaar card, Passport, Utility bill, or Bank statement",
      icon: "MapPin",
      isMandatory: true,
      specifications: ["Recent document", "Clear address"]
    },
    {
      id: "pan-3",
      name: "Photograph",
      description: "Recent passport-size color photograph with white background",
      icon: "Camera",
      isMandatory: true,
      specifications: ["White background", "Recent photo", "Passport size"]
    }]

  },
  {
    id: 3,
    title: "Voter ID Services",
    description: "Register as a new voter, update voter information, download e-EPIC, and apply for corrections in existing voter ID card details.",
    icon: "Vote",
    iconColor: "var(--color-accent)",
    bgColor: "bg-accent/10",
    features: ["New Registration", "Corrections", "e-EPIC Download"],
    processingTime: "30-45 days",
    documents: [
    {
      id: "voter-1",
      name: "Age Proof",
      description: "Birth certificate, school certificate, or passport showing date of birth",
      icon: "Calendar",
      isMandatory: true,
      specifications: ["Must show DOB", "Official document"]
    },
    {
      id: "voter-2",
      name: "Address Proof",
      description: "Aadhaar card, utility bill, rent agreement, or bank passbook",
      icon: "Home",
      isMandatory: true,
      specifications: ["Current address", "Recent document"]
    },
    {
      id: "voter-3",
      name: "Photograph",
      description: "Recent passport-size photograph",
      icon: "Image",
      isMandatory: true,
      specifications: ["Recent", "Clear face", "Passport size"]
    }]

  },
  {
    id: 4,
    title: "Passport Services",
    description: "Complete passport application assistance including fresh passport, renewal, re-issue, and police verification support with document guidance.",
    icon: "Plane",
    iconColor: "var(--color-trust-builder)",
    bgColor: "bg-trust-builder/10",
    features: ["New Application", "Renewal", "Re-issue"],
    processingTime: "30-45 days",
    documents: [
    {
      id: "passport-1",
      name: "Birth Certificate",
      description: "Original birth certificate issued by municipal authority",
      icon: "FileText",
      isMandatory: true,
      specifications: ["Original", "Municipal issued"]
    },
    {
      id: "passport-2",
      name: "Address Proof",
      description: "Aadhaar card, electricity bill, water bill, or telephone bill",
      icon: "MapPin",
      isMandatory: true,
      specifications: ["Within 3 months", "Clear address"]
    },
    {
      id: "passport-3",
      name: "Identity Proof",
      description: "Aadhaar card, PAN card, Voter ID, or Driving License",
      icon: "IdCard",
      isMandatory: true,
      specifications: ["Valid ID", "Photo ID"]
    }]

  },
  {
    id: 5,
    title: "Income Certificate",
    description: "Apply for income certificate required for educational scholarships, government schemes, and various official purposes with quick processing.",
    icon: "IndianRupee",
    iconColor: "var(--color-success)",
    bgColor: "bg-success/10",
    features: ["New Application", "Renewal", "Verification"],
    processingTime: "7-10 days",
    documents: [
    {
      id: "income-1",
      name: "Identity Proof",
      description: "Aadhaar card, PAN card, or Voter ID",
      icon: "User",
      isMandatory: true,
      specifications: ["Valid ID", "Clear copy"]
    },
    {
      id: "income-2",
      name: "Income Proof",
      description: "Salary slips, ITR, or income affidavit",
      icon: "FileText",
      isMandatory: true,
      specifications: ["Recent documents", "All pages"]
    },
    {
      id: "income-3",
      name: "Address Proof",
      description: "Aadhaar card or utility bill",
      icon: "Home",
      isMandatory: true,
      specifications: ["Current address", "Valid"]
    }]

  },
  {
    id: 6,
    title: "Caste Certificate",
    description: "Apply for caste certificate for educational reservations, government job applications, and accessing various welfare schemes and benefits.",
    icon: "Users",
    iconColor: "var(--color-warning)",
    bgColor: "bg-warning/10",
    features: ["New Application", "Verification", "Renewal"],
    processingTime: "15-30 days",
    documents: [
    {
      id: "caste-1",
      name: "Identity Proof",
      description: "Aadhaar card or any government-issued photo ID",
      icon: "IdCard",
      isMandatory: true,
      specifications: ["Valid ID", "Photo ID"]
    },
    {
      id: "caste-2",
      name: "Parent's Caste Certificate",
      description: "Father's or mother's caste certificate (if available)",
      icon: "FileText",
      isMandatory: false,
      specifications: ["Original or certified copy"]
    },
    {
      id: "caste-3",
      name: "Address Proof",
      description: "Aadhaar card, utility bill, or ration card",
      icon: "MapPin",
      isMandatory: true,
      specifications: ["Current address", "Valid document"]
    }]

  }];


  const applications = [
  {
    id: 1,
    serviceName: "PAN Card Application",
    applicationId: "PANAPP2025001234",
    status: "Processing",
    progress: 65,
    submittedDate: "15 Nov 2025",
    estimatedCompletion: "30 Nov 2025",
    nextAction: null
  },
  {
    id: 2,
    serviceName: "Aadhaar Update",
    applicationId: "AADUPD2025005678",
    status: "Pending Documents",
    progress: 40,
    submittedDate: "20 Nov 2025",
    estimatedCompletion: "05 Dec 2025",
    nextAction: "Please upload address proof document to proceed with verification"
  },
  {
    id: 3,
    serviceName: "Voter ID Registration",
    applicationId: "VOTERID2025009012",
    status: "Approved",
    progress: 100,
    submittedDate: "01 Nov 2025",
    estimatedCompletion: "Completed",
    nextAction: null
  }];


  const certifications = [
  {
    id: 1,
    name: "CSC Authorization",
    description: "Authorized Common Service Center by Ministry of Electronics & IT, Government of India",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1fcee72d3-1764490676173.png",
    logoAlt: "Official Government of India emblem with Ashoka Chakra in blue and gold colors representing CSC authorization certificate",
    isVerified: true,
    validTill: "31 Dec 2026",
    certificationId: "CSC-MH-2025-1234"
  },
  {
    id: 2,
    name: "Digital India Initiative",
    description: "Registered partner under Digital India program for rural and urban digital services",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_129c2d90f-1764490680660.png",
    logoAlt: "Digital India logo featuring tricolor stripes and digital connectivity symbols representing government digital transformation initiative",
    isVerified: true,
    validTill: "31 Mar 2026",
    certificationId: "DI-2025-5678"
  },
  {
    id: 3,
    name: "ISO 27001 Certified",
    description: "Information Security Management System certification for data protection and privacy",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1feac3246-1764490675479.png",
    logoAlt: "ISO 27001 certification badge with blue and white colors showing international security standards compliance seal",
    isVerified: true,
    validTill: "15 Jun 2026",
    certificationId: "ISO-27001-2025"
  },
  {
    id: 4,
    name: "UIDAI Authorized",
    description: "Authorized Aadhaar enrollment and update center by Unique Identification Authority of India",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_18ecc8ecd-1764490674561.png",
    logoAlt: "UIDAI official logo with orange and blue colors featuring Aadhaar symbol representing biometric authentication authority",
    isVerified: true,
    validTill: "31 Dec 2025",
    certificationId: "UIDAI-EA-2025-9012"
  }];


  const faqs = [
  {
    question: "What documents do I need to bring for Aadhaar enrollment?",
    answer: "For Aadhaar enrollment, you need to bring proof of identity (any government-issued photo ID like passport, voter ID, driving license), proof of address (utility bill, bank statement, rent agreement not older than 3 months), and proof of date of birth (birth certificate, school certificate, or passport). All documents should be original or self-attested copies.",
    icon: "FileQuestion",
    additionalInfo: "We also accept digital copies of documents if they are clear and readable. Our staff will verify the documents before proceeding with enrollment."
  },
  {
    question: "How long does it take to get a PAN card?",
    answer: "The standard processing time for a new PAN card application is 7-15 working days from the date of application. You will receive your PAN card via registered post at your provided address. You can also download the e-PAN immediately after successful verification, which is equally valid for all purposes.",
    icon: "Clock",
    additionalInfo: "For urgent requirements, you can opt for expedited processing which takes 3-5 working days with additional charges."
  },
  {
    question: "Can I track my application status online?",
    answer: "Yes, you can track all your applications in real-time through our portal. After submitting your application, you will receive a unique application ID via SMS and email. Use this ID to check the current status, view processing stages, and receive notifications about any required actions or document submissions.",
    icon: "Search",
    additionalInfo: "You can also enable push notifications in your account settings to receive instant updates about your application progress."
  },
  {
    question: "What are your service charges?",
    answer: "Our service charges vary depending on the type of service. Basic government services like Aadhaar updates and PAN applications have minimal processing fees as per government guidelines. We provide transparent pricing with no hidden charges. Detailed fee structure is available for each service on the booking page.",
    icon: "IndianRupee",
    additionalInfo: "We accept all payment methods including cash, UPI, cards, and digital wallets. Payment receipts are provided immediately."
  },
  {
    question: "Do I need to book an appointment?",
    answer: "While walk-ins are welcome, we highly recommend booking an appointment to avoid waiting time and ensure dedicated assistance. Appointments can be booked online through our portal or by calling our helpline. You can choose your preferred date and time slot based on availability.",
    icon: "Calendar",
    additionalInfo: "Appointments can be rescheduled up to 24 hours before the scheduled time without any charges."
  },
  {
    question: "Is my personal data secure with you?",
    answer: "Absolutely. We follow strict data protection protocols and are ISO 27001 certified for information security. All your documents and personal information are encrypted and stored securely. We comply with government data protection guidelines and never share your information with unauthorized parties. Your data is used only for the specific service you have applied for.",
    icon: "Shield",
    additionalInfo: "We conduct regular security audits and our staff undergoes mandatory data privacy training to ensure your information remains confidential."
  }];


  const processSteps = [
  {
    title: "Service Selection",
    description: "Choose the government service you need from our comprehensive list of offerings",
    requirements: [
    "Browse available services",
    "Read service requirements",
    "Check processing time and fees"],

    estimatedTime: "5 minutes"
  },
  {
    title: "Document Preparation",
    description: "Gather and verify all required documents as per the checklist",
    requirements: [
    "Review document checklist",
    "Prepare original documents",
    "Make self-attested copies",
    "Ensure documents are valid and clear"],

    estimatedTime: "30 minutes"
  },
  {
    title: "Appointment Booking",
    description: "Schedule your visit to our CSC center at your convenience",
    requirements: [
    "Select preferred date and time",
    "Provide contact information",
    "Receive confirmation via SMS/email"],

    estimatedTime: "10 minutes"
  },
  {
    title: "Document Submission",
    description: "Visit our center and submit your documents with our assistance",
    requirements: [
    "Arrive 10 minutes before appointment",
    "Bring all required documents",
    "Complete biometric verification if needed",
    "Pay service charges"],

    estimatedTime: "30-45 minutes"
  },
  {
    title: "Application Processing",
    description: "Your application is processed and verified by relevant authorities",
    requirements: [
    "Track application status online",
    "Respond to any queries promptly",
    "Check for status updates regularly"],

    estimatedTime: "Varies by service"
  },
  {
    title: "Service Completion",
    description: "Receive your document or certificate upon successful processing",
    requirements: [
    "Collect document from center or receive via post",
    "Verify all details are correct",
    "Keep acknowledgment receipt safe"],

    estimatedTime: "As per service timeline"
  }];


  const handleLearnMore = (service) => {
    setSelectedService(service);
    setShowDocumentChecklist(true);
    setActiveTab('process');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDocumentChecklistComplete = () => {
    setShowDocumentChecklist(false);
    setShowAppointmentBooking(true);
  };

  const handleBookingComplete = (formData) => {
    alert(`Appointment booked successfully!\n\nService: ${selectedService?.title}\nDate: ${formData?.preferredDate}\nTime: ${formData?.preferredTime}\n\nYou will receive a confirmation SMS and email shortly.`);
    setShowAppointmentBooking(false);
    setSelectedService(null);
    setActiveTab('services');
  };

  const handleViewDetails = (app) => {
    alert(`Application Details:\n\nService: ${app?.serviceName}\nApplication ID: ${app?.applicationId}\nStatus: ${app?.status}\nProgress: ${app?.progress}%\nSubmitted: ${app?.submittedDate}\nEstimated Completion: ${app?.estimatedCompletion}`);
  };

  const stats = [
  { icon: "Users", label: "Happy Customers", value: "50,000+", color: "text-primary" },
  { icon: "FileCheck", label: "Applications Processed", value: "1,00,000+", color: "text-success" },
  { icon: "Award", label: "Years of Service", value: "5+", color: "text-warning" },
  { icon: "Clock", label: "Average Processing Time", value: "7 Days", color: "text-secondary" }];


  return (
    <>
      <Helmet>
        <title>CSC Portal - Government Digital Services | Shiv Mobile Hub</title>
        <meta name="description" content="Access comprehensive government digital services including Aadhaar, PAN Card, Passport, Voter ID, and more. Authorized CSC center with secure document processing and expert assistance." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-full mb-6">
                <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">Authorized CSC Center</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground mb-6">
                Government Digital Services Portal
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Your trusted partner for all government services. Authorized Common Service Center providing secure, efficient, and hassle-free digital services with expert guidance at every step.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="default" size="lg" iconName="Calendar" iconPosition="left">
                  Book Appointment
                </Button>
                <Button variant="outline" size="lg" iconName="Search" iconPosition="left">
                  Track Application
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats?.map((stat, index) =>
              <div key={index} className="bg-card rounded-lg border border-border p-6 text-center hover:shadow-medium transition-smooth">
                  <Icon name={stat?.icon} size={32} className={`mx-auto mb-3 ${stat?.color}`} />
                  <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat?.value}</div>
                  <div className="text-sm text-muted-foreground">{stat?.label}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-2 mb-8 border-b border-border">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                activeTab === 'services' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
                }>

                <div className="flex items-center space-x-2">
                  <Icon name="Grid3x3" size={18} />
                  <span>Services</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('track')}
                className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                activeTab === 'track' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
                }>

                <div className="flex items-center space-x-2">
                  <Icon name="Search" size={18} />
                  <span>Track Applications</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('process')}
                className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                activeTab === 'process' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
                }>

                <div className="flex items-center space-x-2">
                  <Icon name="ListChecks" size={18} />
                  <span>Process</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('certifications')}
                className={`px-6 py-3 font-medium transition-smooth border-b-2 ${
                activeTab === 'certifications' ?
                'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
                }>

                <div className="flex items-center space-x-2">
                  <Icon name="Award" size={18} />
                  <span>Certifications</span>
                </div>
              </button>
            </div>

            {activeTab === 'services' &&
            <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-3xl font-headline font-bold text-foreground mb-4">
                    Available Government Services
                  </h2>
                  <p className="text-muted-foreground">
                    Choose from our wide range of government digital services. All services are processed securely with complete documentation support.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cscServices?.map((service) =>
                <ServiceCard
                  key={service?.id}
                  service={service}
                  onLearnMore={handleLearnMore} />

                )}
                </div>
              </div>
            }

            {activeTab === 'track' &&
            <div className="space-y-8">
                <ApplicationTracker
                applications={applications}
                onViewDetails={handleViewDetails} />

              </div>
            }

            {activeTab === 'process' &&
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {showDocumentChecklist && selectedService &&
                <DocumentChecklist
                  documents={selectedService?.documents}
                  serviceType={selectedService?.title}
                  onComplete={handleDocumentChecklistComplete} />

                }

                  {showAppointmentBooking && selectedService &&
                <AppointmentBooking
                  service={selectedService}
                  onBookingComplete={handleBookingComplete} />

                }

                  {!showDocumentChecklist && !showAppointmentBooking &&
                <ProcessSteps steps={processSteps} currentStep={0} />
                }
                </div>

                <div className="space-y-8">
                  <FAQSection faqs={faqs} />
                </div>
              </div>
            }

            {activeTab === 'certifications' &&
            <div className="space-y-8">
                <CertificationDisplay certifications={certifications} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Shield" size={32} color="var(--color-success)" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      100% Secure
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Bank-level encryption and data protection for all your documents
                    </p>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="CheckCircle2" size={32} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Government Authorized
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Official CSC center authorized by Government of India
                    </p>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-6 text-center">
                    <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Users" size={32} color="var(--color-warning)" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Expert Support
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Trained professionals to guide you through every step
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <section className="py-12 lg:py-16 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-lg border border-border p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-headline font-bold text-foreground mb-4">
                    Need Help with Government Services?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Our expert team is here to assist you with all your government service needs. From document preparation to application submission, we provide end-to-end support.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircle2" size={20} color="var(--color-success)" className="flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Expert Guidance</p>
                        <p className="text-sm text-muted-foreground">Step-by-step assistance for all services</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircle2" size={20} color="var(--color-success)" className="flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Quick Processing</p>
                        <p className="text-sm text-muted-foreground">Fast-track your applications with our support</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircle2" size={20} color="var(--color-success)" className="flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Secure & Confidential</p>
                        <p className="text-sm text-muted-foreground">Your data is protected with highest security standards</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button variant="default" iconName="Phone" iconPosition="left">
                      Call: +91 98765 43210
                    </Button>
                    <Button variant="outline" iconName="Mail" iconPosition="left">
                      Email Support
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Operating Hours
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium text-foreground">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium text-error">Closed</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Icon name="MapPin" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground mb-1">Visit Our Center</p>
                        <p className="text-sm text-muted-foreground">
                          Shop No. 15, Main Market Road, Near City Mall, Mumbai - 400001
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>);

};

export default CSCPortal;