import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialMediaFeed = () => {
  const socialPosts = [
  {
    id: 1,
    platform: "Facebook",
    icon: "Facebook",
    author: "Shiv Mobile Hub",
    timestamp: "2 hours ago",
    content: "🎉 Exciting News! We\'ve just launched our new express repair service. Get your phone fixed in under 30 minutes for common issues. Visit us today!",
    image: "https://images.unsplash.com/photo-1727893160805-5594ae240044",
    imageAlt: "Modern mobile repair shop interior with bright lighting showing technician working on smartphone at clean workstation",
    likes: 245,
    comments: 32,
    shares: 18
  },
  {
    id: 2,
    platform: "Instagram",
    icon: "Instagram",
    author: "shivmobilehub",
    timestamp: "5 hours ago",
    content: "Customer satisfaction is our priority! 💯 Thank you Mr. Sharma for trusting us with your iPhone repair. #CustomerFirst #MobileRepair",
    image: "https://images.unsplash.com/photo-1670152861580-829baca024cc",
    imageAlt: "Happy middle-aged man in casual shirt smiling while holding repaired smartphone with thumbs up in bright shop",
    likes: 189,
    comments: 24,
    shares: 12
  },
  {
    id: 3,
    platform: "Twitter",
    icon: "Twitter",
    author: "@ShivMobileHub",
    timestamp: "1 day ago",
    content: "Did you know? 🤔 Regular software updates can improve your phone\'s performance by up to 30%. Keep your device updated! #TechTips #MobileCare",
    image: null,
    imageAlt: null,
    likes: 156,
    comments: 18,
    shares: 45
  },
  {
    id: 4,
    platform: "Instagram",
    icon: "Instagram",
    author: "shivmobilehub",
    timestamp: "2 days ago",
    content: "New arrivals alert! 📱 Latest smartphone models now available with exclusive launch offers. DM for details. #NewLaunch #Smartphones",
    image: "https://images.unsplash.com/photo-1657561761400-762d985f24b0",
    imageAlt: "Display of multiple latest model smartphones arranged on white surface with colorful gradient backgrounds showing modern designs",
    likes: 312,
    comments: 47,
    shares: 28
  }];


  const socialStats = [
  { platform: "Facebook", icon: "Facebook", followers: "12.5K", color: "primary" },
  { platform: "Instagram", icon: "Instagram", followers: "8.3K", color: "accent" },
  { platform: "Twitter", icon: "Twitter", followers: "5.2K", color: "secondary" },
  { platform: "YouTube", icon: "Youtube", followers: "3.8K", color: "error" }];


  const getPlatformColor = (platform) => {
    const colorMap = {
      Facebook: "text-primary",
      Instagram: "text-accent",
      Twitter: "text-secondary",
      YouTube: "text-error"
    };
    return colorMap?.[platform] || "text-primary";
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000)?.toFixed(1) + 'K';
    }
    return num?.toString();
  };

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-4">
            Follow Us on Social Media
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest offers, tech tips, and community stories
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {socialStats?.map((stat) =>
          <div
            key={stat?.platform}
            className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-soft transition-smooth">

              <Icon
              name={stat?.icon}
              size={32}
              className={`mx-auto mb-3 ${getPlatformColor(stat?.platform)}`} />

              <p className="text-2xl font-bold text-foreground mb-1">{stat?.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPosts?.map((post) =>
          <div
            key={post?.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium transition-smooth">

              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-${post?.platform?.toLowerCase()}/10 flex items-center justify-center`}>
                      <Icon
                      name={post?.icon}
                      size={20}
                      className={getPlatformColor(post?.platform)} />

                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{post?.author}</p>
                      <p className="text-xs text-muted-foreground">{post?.timestamp}</p>
                    </div>
                  </div>
                  <Icon name="MoreVertical" size={20} className="text-muted-foreground" />
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-foreground mb-4 leading-relaxed">
                  {post?.content}
                </p>

                {post?.image &&
              <div className="rounded-lg overflow-hidden mb-4">
                    <Image
                  src={post?.image}
                  alt={post?.imageAlt}
                  className="w-full h-64 object-cover" />

                  </div>
              }

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-smooth">
                    <Icon name="Heart" size={18} />
                    <span className="text-sm">{formatNumber(post?.likes)}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-smooth">
                    <Icon name="MessageCircle" size={18} />
                    <span className="text-sm">{formatNumber(post?.comments)}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-smooth">
                    <Icon name="Share2" size={18} />
                    <span className="text-sm">{formatNumber(post?.shares)}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
            <Icon name="Users" size={48} color="var(--color-primary)" className="mb-4" />
            <h3 className="text-2xl font-headline font-semibold text-foreground mb-3">
              Join Our Community
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Connect with us on social media for exclusive offers, tech tips, and community updates
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {socialStats?.map((stat) =>
              <a
                key={stat?.platform}
                href="#"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-md hover:shadow-soft transition-smooth">

                  <Icon name={stat?.icon} size={18} className={getPlatformColor(stat?.platform)} />
                  <span className="text-sm font-medium text-foreground">Follow</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default SocialMediaFeed;