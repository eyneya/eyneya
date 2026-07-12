import type { FaqItem } from '../components/ui/FaqAccordion';
import type { Testimonial } from '../components/ui/TestimonialCard';

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I came to Eyneya overwhelmed by a stack of 1099s and not knowing what I owed. They walked me through everything and I actually felt in control of my taxes for the first time.",
    name: 'Marcus T.',
    context: 'Freelance Designer',
    location: 'Kennesaw, GA',
  },
  {
    quote:
      "As an S-Corp owner, I needed someone who actually understood business taxes. Eyneya did a full strategy review and found deductions my previous accountant missed for years.",
    name: 'Danielle O.',
    context: 'Business Owner',
    location: 'Marietta, GA',
  },
  {
    quote:
      "I got an IRS notice and panicked. Eyneya reviewed it quickly and explained exactly what it meant and what I needed to do. Calm, professional, and clear.",
    name: 'Jerome W.',
    context: 'Self-Employed',
    location: 'Acworth, GA',
  },
  {
    quote:
      "I had three years of unfiled taxes. They helped me get caught up without judgment and made sure everything was accurate. Highly recommend.",
    name: 'Priya S.',
    context: 'Client',
    location: 'Kennesaw, GA',
  },
  {
    quote:
      "The ongoing advisory plan is worth every penny. I know what I owe in estimated taxes each quarter and I haven't had a surprise bill in over a year.",
    name: 'Cameron R.',
    context: 'Business Owner',
    location: 'Roswell, GA',
  },
  {
    quote:
      "Finally a tax professional who explains things in plain English. I understood every line of my return for the first time. Booking was easy and the whole experience was professional.",
    name: 'Aisha M.',
    context: 'W-2 + Side Business',
    location: 'Smyrna, GA',
  },
];

export const ADD_ON_SERVICES = [
  { name: 'Personal Tax Extension', price: '$75' },
  { name: 'Business Tax Extension', price: '$125–$175' },
  { name: 'Tax Refund or Balance Estimate', price: '$75' },
  { name: 'Tax Return Review Before Filing', price: '$150–$300' },
  { name: 'Expedited Processing Fee', price: '$75–$150', note: 'Adds to any service' },
];

export const TAX_PROBLEMS = [
  { title: 'Unexpected Tax Bills', desc: 'Plan ahead so tax season does not catch you off guard.' },
  { title: '1099 & Self-Employment Confusion', desc: 'Understand income, deductions, estimated taxes, and filing responsibilities.' },
  { title: 'IRS or State Tax Notices', desc: 'Get help reviewing notices and understanding your next steps.' },
  { title: 'Unfiled or Prior-Year Returns', desc: 'Catch up on missing tax years with organized support.' },
  { title: 'Business Tax Complexity', desc: 'Get clarity around deductions, entity structure, compliance, and tax planning.' },
  { title: 'Tax Return Mistakes', desc: 'Amend or correct returns when income, deductions, credits, or filing details need to be updated.' },
  { title: 'Year-Round Tax Uncertainty', desc: 'Move from reactive filing to proactive tax guidance.' },
];

export interface ServicePreview {
  slug: string;
  name: string;
  blurb: string;
  icon: string;
  startingPrice?: string;
}

export const SERVICE_PREVIEWS: ServicePreview[] = [
  { slug: 'tax-preparation', name: 'Tax Preparation', blurb: 'Accurate individual tax returns from simple to complex.', icon: 'FileText', startingPrice: 'Starting at $225' },
  { slug: 'self-employed-tax-preparation', name: 'Self-Employed Tax Preparation', blurb: 'Schedule C, 1099, freelancers, and gig workers.', icon: 'Briefcase', startingPrice: 'Starting at $499' },
  { slug: 'business-tax-preparation', name: 'Business Tax Preparation', blurb: 'S-Corp, partnership, C-Corp, and nonprofit filing.', icon: 'Building2', startingPrice: 'Starting at $750' },
  { slug: 'tax-advisory', name: 'Tax Advisory', blurb: 'Get answers, clarity, and direction from a tax advisor.', icon: 'MessageCircleQuestion', startingPrice: 'From $75' },
  { slug: 'tax-planning', name: 'Tax Planning', blurb: 'Avoid surprise tax bills with proactive planning.', icon: 'TrendingUp', startingPrice: 'From $249' },
  { slug: 'tax-strategy', name: 'Tax Strategy', blurb: 'Entity structure, S-Corp analysis, and long-term strategy.', icon: 'Target', startingPrice: 'From $497' },
  { slug: 'tax-amendments', name: 'Tax Amendments', blurb: 'Correct mistakes, report missing income, file 1040-X.', icon: 'PencilLine', startingPrice: 'From $99' },
  { slug: 'tax-compliance', name: 'Tax Compliance', blurb: 'IRS notices, prior-year filing, and business readiness.', icon: 'ShieldCheck', startingPrice: 'From $150' },
  { slug: 'ongoing-advisory', name: 'Ongoing Tax Advisory', blurb: 'Year-round planning, compliance, and strategy support.', icon: 'CalendarHeart', startingPrice: 'Plans available' },
];

export const HOW_IT_WORKS = [
  { step: 1, title: 'Choose Your Service', desc: 'Browse our services, select what fits your tax situation, and click to book online in minutes.' },
  { step: 2, title: 'Complete Your Intake', desc: 'Submit our short intake form and upload any relevant documents through our secure client portal.' },
  { step: 3, title: 'We Prepare & Advise', desc: 'Your tax professional reviews your situation, prepares your service, and delivers accurate, organized results.' },
  { step: 4, title: 'Receive Your Deliverable', desc: 'Get your completed return, strategy summary, or advisory response with clear next steps — and automated reminders so nothing falls through.' },
];

export function generalFaqs(): FaqItem[] {
  return [
    { q: 'Do you work with clients outside Georgia?', a: 'Yes. We serve clients virtually in all 50 states. Our process is fully online — you submit documents securely and we handle the rest.' },
    { q: 'How do I book an appointment?', a: 'Click any "Book Now" button, choose your service, select a date and time from our online calendar, complete the intake form, and you will receive a confirmation email within minutes.' },
    { q: 'What areas do you serve locally?', a: 'We are based in Kennesaw, Georgia and serve clients in Marietta, Acworth, Canton, Roswell, Smyrna, Sandy Springs, and throughout Metro Atlanta. Virtual services are available nationwide.' },
    { q: 'How much do your services cost?', a: 'Pricing varies by service and complexity. Every service page lists starting rates. Final fees are confirmed after document review or consultation. See individual service pages for details.' },
  ];
}
