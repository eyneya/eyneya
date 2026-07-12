export const BUSINESS = {
  name: 'Eyneya Business Solutions',
  phone: import.meta.env.VITE_BUSINESS_PHONE || '(770) 988-4893',
  email: import.meta.env.VITE_BUSINESS_EMAIL || 'hello@eyneya.com',
  city: 'Kennesaw',
  state: 'GA',
  region: 'Metro Atlanta',
  hours: [
    { day: 'Monday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Thursday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Friday', hours: '9:00 AM – 5:00 PM' },
    { day: 'Saturday', hours: 'By appointment' },
    { day: 'Sunday', hours: 'Closed' },
  ],
  serviceArea: ['Kennesaw', 'Marietta', 'Acworth', 'Canton', 'Roswell', 'Smyrna', 'Sandy Springs'],
  timeZone: 'America/New_York',
};

export const PRICING_DISCLAIMER =
  'Pricing reflects starting rates based on typical complexity. Final fees are confirmed after document review or initial consultation. Complexity, number of forms, record condition, and advisory scope may affect final pricing. Eyneya Business Solutions provides tax preparation, advisory, planning, strategy, compliance support, and business guidance. We do not provide legal representation unless otherwise stated in writing.';
