import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoyaltyCard = ({ loyaltyData }) => {
  const progressPercentage = (loyaltyData?.currentPoints / loyaltyData?.nextTierPoints) * 100;

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-primary-foreground shadow-strong">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={24} />
            <h3 className="text-xl font-headline font-bold">Loyalty Rewards</h3>
          </div>
          <p className="text-sm opacity-90">{loyaltyData?.tier} Member</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-xs opacity-90 mb-1">Total Points</p>
          <p className="text-2xl font-bold">{loyaltyData?.currentPoints?.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="opacity-90">Progress to {loyaltyData?.nextTier}</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/90 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs opacity-75 mt-2">
          {loyaltyData?.nextTierPoints - loyaltyData?.currentPoints} points to next tier
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Gift" size={18} />
            <p className="text-sm font-medium">Rewards Available</p>
          </div>
          <p className="text-2xl font-bold">{loyaltyData?.rewardsAvailable}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Percent" size={18} />
            <p className="text-sm font-medium">Active Offers</p>
          </div>
          <p className="text-2xl font-bold">{loyaltyData?.activeOffers}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="secondary" fullWidth iconName="Gift" iconPosition="left">
          Redeem Points
        </Button>
        <Button variant="outline" fullWidth iconName="Share2" iconPosition="left">
          Refer Friend
        </Button>
      </div>
    </div>
  );
};

export default LoyaltyCard;