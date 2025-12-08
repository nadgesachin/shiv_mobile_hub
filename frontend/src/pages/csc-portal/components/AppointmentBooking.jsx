import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AppointmentBooking = ({ service, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const timeSlots = [
    { value: '09:00', label: '09:00 AM - 10:00 AM' },
    { value: '10:00', label: '10:00 AM - 11:00 AM' },
    { value: '11:00', label: '11:00 AM - 12:00 PM' },
    { value: '12:00', label: '12:00 PM - 01:00 PM' },
    { value: '14:00', label: '02:00 PM - 03:00 PM' },
    { value: '15:00', label: '03:00 PM - 04:00 PM' },
    { value: '16:00', label: '04:00 PM - 05:00 PM' },
    { value: '17:00', label: '05:00 PM - 06:00 PM' }
  ];

  const serviceTypes = [
    { value: 'new', label: 'New Application' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'correction', label: 'Correction/Update' },
    { value: 'duplicate', label: 'Duplicate Copy' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData?.preferredDate) newErrors.preferredDate = 'Please select a date';
    if (!formData?.preferredTime) newErrors.preferredTime = 'Please select a time slot';
    if (!formData?.serviceType) newErrors.serviceType = 'Please select service type';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onBookingComplete(formData);
    }
  };

  const today = new Date()?.toISOString()?.split('T')?.[0];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Calendar" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-headline font-semibold text-foreground">
            Book Your Appointment
          </h3>
          <p className="text-sm text-muted-foreground">
            Schedule a visit to our CSC center for {service?.title || 'service'}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            error={errors?.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />

          <Select
            label="Service Type"
            placeholder="Select service type"
            options={serviceTypes}
            value={formData?.serviceType}
            onChange={(value) => handleInputChange('serviceType', value)}
            error={errors?.serviceType}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Preferred Date"
            type="date"
            min={today}
            value={formData?.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e?.target?.value)}
            error={errors?.preferredDate}
            required
          />

          <Select
            label="Preferred Time Slot"
            placeholder="Select time slot"
            options={timeSlots}
            value={formData?.preferredTime}
            onChange={(value) => handleInputChange('preferredTime', value)}
            error={errors?.preferredTime}
            required
          />
        </div>

        <Input
          label="Additional Notes (Optional)"
          type="text"
          placeholder="Any specific requirements or questions"
          value={formData?.additionalNotes}
          onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
        />

        <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Important Information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Bring all required documents as per the checklist</li>
              <li>Appointment confirmation will be sent via SMS and email</li>
              <li>You can reschedule up to 24 hours before the appointment</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button variant="default" type="submit" iconName="Calendar" iconPosition="left">
            Confirm Appointment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;