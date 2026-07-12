export type ServiceCategory =
  | 'preparation'
  | 'advisory'
  | 'planning'
  | 'strategy'
  | 'amendments'
  | 'compliance'
  | 'ongoing';

export interface ServiceTier {
  id: string;
  service_id: string;
  name: string;
  best_for: string;
  price_cents: number;
  price_display: string;
  is_fixed_price: boolean;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  is_recurring: boolean;
  recurring_interval: string | null;
  display_order: number;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string | null;
  duration_minutes: number;
  buffer_minutes: number;
  is_active: boolean;
  service_tiers?: ServiceTier[];
}

export interface Client {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address_city: string | null;
  address_state: string | null;
  business_name: string | null;
  tax_situation: string | null;
  source: string | null;
  notes: string | null;
  created_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  booking_reference: string;
  client_id: string;
  service_id: string;
  service_tier_id: string | null;
  service_name: string;
  tier_name: string;
  price_display: string;
  status: BookingStatus;
  appointment_start: string;
  appointment_end: string;
  timezone: string;
  client_notes: string | null;
  admin_notes: string | null;
  filing_status: string | null;
  tax_year: string | null;
  has_business_income: boolean;
  has_investments: boolean;
  has_rental_income: boolean;
  has_prior_year_issues: boolean;
  additional_context: string | null;
  payment_status: PaymentStatus;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  amount_paid_cents: number;
  google_calendar_event_id: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  // joined relations
  clients?: Client;
}

export interface Payment {
  id: string;
  booking_id: string | null;
  client_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

export interface EmailLog {
  id: string;
  booking_id: string | null;
  client_id: string | null;
  recipient_email: string;
  template_name: string;
  subject: string;
  resend_message_id: string | null;
  status: string;
  error_message: string | null;
  sent_at: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  service_interest: string | null;
  message: string;
  source_page: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export interface AvailabilitySchedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface AvailabilityOverride {
  id: string;
  override_date: string;
  is_blocked: boolean;
  custom_start: string | null;
  custom_end: string | null;
  reason: string | null;
  created_at: string;
}

export interface Slot {
  start: string; // "09:00"
  end: string; // "10:00"
  iso_start: string;
  iso_end: string;
}

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  author: string;
  status: BlogPostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
