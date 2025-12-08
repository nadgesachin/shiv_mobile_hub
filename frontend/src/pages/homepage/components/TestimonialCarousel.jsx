import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Small Business Owner",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_162f7d819-1763295612623.png",
    avatarAlt: "Professional headshot of Indian man with short black hair wearing blue formal shirt smiling warmly at camera",
    rating: 5,
    comment: "Shiv Mobile Hub has been my go-to place for all mobile and government services. Their CSC services are incredibly efficient, and I got my PAN card updated within 3 days. The staff is knowledgeable and always ready to help.",
    service: "CSC Services",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Teacher",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1524059f7-1763300494995.png",
    avatarAlt: "Professional headshot of Indian woman with long black hair wearing traditional red saree smiling confidently at camera",
    rating: 5,
    comment: "I had a cracked screen on my iPhone and was worried about the cost. The team at Shiv Mobile Hub replaced it with genuine parts at a very reasonable price. The repair was done in just 2 hours with a 6-month warranty. Highly recommended!",
    service: "Mobile Repair",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "IT Professional",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1923d9d56-1763293093495.png",
    avatarAlt: "Professional headshot of Indian man with glasses wearing white formal shirt and tie looking professional at camera",
    rating: 5,
    comment: "The convenience of getting mobile recharges, bill payments, and even buying new phones all in one place is amazing. Their online service booking system is user-friendly, and the staff always follows up to ensure customer satisfaction.",
    service: "Digital Services",
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Sunita Verma",
    role: "Homemaker",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_111e29bbe-1763294966477.png",
    avatarAlt: "Professional headshot of Indian woman with medium length black hair wearing green traditional dress smiling warmly at camera",
    rating: 5,
    comment: "I'm not very tech-savvy, but the team patiently helped me with my Aadhaar update and taught me how to use digital payment apps. They treat customers like family and explain everything in simple terms. Very trustworthy service!",
    service: "Customer Support",
    date: "1 week ago"
  }];


  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials?.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials?.length]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials?.length);
  };

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from real people in our community
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-strong p-8 lg:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                    <Image
                      src={testimonials?.[activeIndex]?.avatar}
                      alt={testimonials?.[activeIndex]?.avatarAlt}
                      className="w-full h-full object-cover" />

                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Quote" size={20} color="var(--color-primary-foreground)" />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-1 mb-3">
                  {[...Array(testimonials?.[activeIndex]?.rating)]?.map((_, i) =>
                  <Icon key={i} name="Star" size={20} color="var(--color-conversion-accent)" className="fill-current" />
                  )}
                </div>

                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonials?.[activeIndex]?.comment}"
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <div>
                    <p className="font-semibold text-foreground">{testimonials?.[activeIndex]?.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials?.[activeIndex]?.role}</p>
                  </div>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {testimonials?.[activeIndex]?.service}
                    </span>
                    <span className="text-sm text-muted-foreground">{testimonials?.[activeIndex]?.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 flex items-center justify-center bg-card rounded-full shadow-soft hover:shadow-medium hover:bg-primary hover:text-primary-foreground transition-smooth touch-target"
              aria-label="Previous testimonial">

              <Icon name="ChevronLeft" size={24} />
            </button>

            <div className="flex items-center space-x-2">
              {testimonials?.map((_, index) =>
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-muted'}`
                }
                aria-label={`Go to testimonial ${index + 1}`} />

              )}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center bg-card rounded-full shadow-soft hover:shadow-medium hover:bg-primary hover:text-primary-foreground transition-smooth touch-target"
              aria-label="Next testimonial">

              <Icon name="ChevronRight" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>);

};

export default TestimonialCarousel;