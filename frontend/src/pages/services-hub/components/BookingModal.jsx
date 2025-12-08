import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingModal = ({ service, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    timeSlot: '',
    notes: ''
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Name is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/?.test(formData?.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Enter valid email address';
    if (!formData?.date) newErrors.date = 'Date is required';
    if (!formData?.timeSlot) newErrors.timeSlot = 'Time slot is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onConfirm({ ...formData, service });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-strong max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${service?.iconColor}15` }}
            >
              <Icon name={service?.icon} size={20} color={service?.iconColor} />
            </div>
            <div>
              <h2 className="text-lg font-headline font-semibold text-foreground">
                Book {service?.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {service?.duration} • ₹{service?.price}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
            aria-label="Close booking modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.name}
            onChange={(e) => handleChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={formData?.phone}
            onChange={(e) => handleChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={(e) => handleChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="Preferred Date"
            type="date"
            value={formData?.date}
            onChange={(e) => handleChange('date', e?.target?.value)}
            error={errors?.date}
            required
            min={new Date()?.toISOString()?.split('T')?.[0]}
          />

          <Select
            label="Time Slot"
            placeholder="Select preferred time"
            options={timeSlots}
            value={formData?.timeSlot}
            onChange={(value) => handleChange('timeSlot', value)}
            error={errors?.timeSlot}
            required
          />

          <Input
            label="Additional Notes"
            type="text"
            placeholder="Any specific requirements or questions?"
            value={formData?.notes}
            onChange={(e) => handleChange('notes', e?.target?.value)}
          />

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="Info" size={16} color="var(--color-primary)" />
              Booking Information
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                <span>You will receive confirmation via SMS and email</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                <span>Free cancellation up to 2 hours before appointment</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                <span>Payment can be made at the time of service</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="Calendar"
              iconPosition="left"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;