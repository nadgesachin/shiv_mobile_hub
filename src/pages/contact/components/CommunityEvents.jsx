import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CommunityEvents = () => {
  const upcomingEvents = [
  {
    id: 1,
    title: "Digital Literacy Workshop",
    date: "2025-12-05",
    time: "10:00 AM - 12:00 PM",
    location: "Shiv Mobile Hub Store",
    description: "Free workshop on smartphone basics, online safety, and digital payments for senior citizens and beginners",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1837b674d-1764490677258.png",
    imageAlt: "Group of diverse senior citizens learning smartphone usage in bright classroom with instructor demonstrating on large screen",
    category: "Education",
    seats: "15 seats available",
    isRegistrationOpen: true
  },
  {
    id: 2,
    title: "Mobile Photography Contest",
    date: "2025-12-10",
    time: "All Day Event",
    location: "Online Submission",
    description: "Showcase your mobile photography skills. Theme: \'My Neighborhood\'. Winners get exciting prizes and accessories",
    image: "https://images.unsplash.com/photo-1538722684323-55b22cf8a62b",
    imageAlt: "Young photographer holding smartphone taking creative photo of colorful street art in urban neighborhood setting",
    category: "Competition",
    seats: "Unlimited entries",
    isRegistrationOpen: true
  },
  {
    id: 3,
    title: "CSC Services Awareness Drive",
    date: "2025-12-15",
    time: "2:00 PM - 5:00 PM",
    location: "Community Center, Sector 15",
    description: "Learn about government digital services, document requirements, and application processes. Free consultation available",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c92c22eb-1764490677238.png",
    imageAlt: "Professional woman in blue suit explaining government documents to attentive group of people in modern community center",
    category: "Awareness",
    seats: "Walk-in welcome",
    isRegistrationOpen: false
  },
  {
    id: 4,
    title: "Tech Repair Demonstration",
    date: "2025-12-20",
    time: "4:00 PM - 6:00 PM",
    location: "Shiv Mobile Hub Store",
    description: "Watch our expert technicians demonstrate mobile repair techniques. Learn basic troubleshooting tips for common issues",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1288c9c36-1764490682601.png",
    imageAlt: "Skilled technician in white coat carefully repairing smartphone circuit board with precision tools under bright magnifying lamp",
    category: "Workshop",
    seats: "20 seats available",
    isRegistrationOpen: true
  }];


  const pastEvents = [
  {
    id: 5,
    title: "Diwali Special Sale Event",
    date: "2025-11-01",
    participants: "500+",
    image: "https://images.unsplash.com/photo-1730130172083-6b9f52505dbb",
    imageAlt: "Crowded mobile shop decorated with colorful Diwali lights and festive decorations with happy customers shopping"
  },
  {
    id: 6,
    title: "Free Mobile Health Checkup Camp",
    date: "2025-10-15",
    participants: "200+",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a2f96022-1764490677542.png",
    imageAlt: "Technician in blue uniform testing multiple smartphones on diagnostic equipment table with satisfied customers waiting"
  }];


  const getCategoryColor = (category) => {
    const colorMap = {
      Education: "bg-primary/10 text-primary border-primary/20",
      Competition: "bg-accent/10 text-accent border-accent/20",
      Awareness: "bg-secondary/10 text-secondary border-secondary/20",
      Workshop: "bg-success/10 text-success border-success/20"
    };
    return colorMap?.[category] || colorMap?.Education;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Community Events & Workshops
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community initiatives and stay connected with your digital neighborhood
          </p>
        </div>

        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Icon name="Calendar" size={24} color="var(--color-primary)" />
            <h3 className="text-2xl font-headline font-semibold text-foreground">
              Upcoming Events
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents?.map((event) =>
            <div
              key={event?.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-smooth group">

                <div className="relative h-48 overflow-hidden">
                  <Image
                  src={event?.image}
                  alt={event?.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />

                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event?.category)}`}>
                    {event?.category}
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-headline font-semibold text-foreground mb-3">
                    {event?.title}
                  </h4>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={16} />
                      <span>{formatDate(event?.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} />
                      <span>{event?.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      <span>{event?.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Users" size={16} />
                      <span>{event?.seats}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event?.description}
                  </p>

                  <Button
                  variant={event?.isRegistrationOpen ? "default" : "outline"}
                  fullWidth
                  iconName={event?.isRegistrationOpen ? "UserPlus" : "Info"}
                  iconPosition="left"
                  disabled={!event?.isRegistrationOpen}>

                    {event?.isRegistrationOpen ? "Register Now" : "Learn More"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-8">
            <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            <h3 className="text-2xl font-headline font-semibold text-foreground">
              Past Events Highlights
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents?.map((event) =>
            <div
              key={event?.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-soft transition-smooth">

                <div className="relative h-40 overflow-hidden">
                  <Image
                  src={event?.image}
                  alt={event?.imageAlt}
                  className="w-full h-full object-cover" />

                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    {event?.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{formatDate(event?.date)}</span>
                    <span className="text-success font-medium">{event?.participants} attended</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-8 text-center">
          <Icon name="Megaphone" size={48} color="var(--color-primary)" className="mx-auto mb-4" />
          <h3 className="text-2xl font-headline font-semibold text-foreground mb-3">
            Want to Organize an Event?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We welcome community-driven initiatives. Share your ideas for workshops, awareness programs, or social events.
          </p>
          <Button variant="default" iconName="Mail" iconPosition="left">
            Submit Event Proposal
          </Button>
        </div>
      </div>
    </section>);

};

export default CommunityEvents;