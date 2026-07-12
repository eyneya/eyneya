/*
# Eyneya Business Solutions — Seed Data

1. Purpose
Populates the services catalog and pricing tiers with the full service lineup
from the spec, plus default weekly availability (Mon–Fri 9–5) and default
admin settings. Idempotent: uses ON CONFLICT to avoid duplicate inserts on
re-runs.

2. Services seeded (by slug)
- tax-preparation (3 tiers: Simple $225, Enhanced $325, Complex $525)
- self-employed-tax-preparation (1 tier: $499)
- business-tax-preparation (2 tiers: Business Entity $899, Nonprofit $750)
- tax-advisory (4 tiers: Quick Question $75, Tax Clarity $149, Business Advisory $249, Document Review $150-250)
- tax-planning (3 tiers: Individual $249, Self-Employed $397, Business $597-997)
- tax-strategy (4 tiers: Entity $497, S-Corp $597-997, Intensive $997-1500, Multi-Income $697-1200)
- tax-amendments (3 tiers: Tier1 $99, Tier2 $150-225, Tier3 $300-600)
- tax-compliance (5 tiers: Notice Review $150-250, Notice Response $350-750, Estimated Tax $175-275, Contractor $297-697, Checkup $397-897)
- ongoing-advisory (3 recurring plans: Tax Clarity $497/qtr, Business $497-750/mo, Strategic $997-1500/mo)

3. Other seed
- Default availability: Mon–Fri 09:00–17:00 active; Sat/Sun inactive.
- Default admin_settings: business_hours, booking_buffer_days=1,
  max_booking_days_ahead=30, appointment_reminder_hours=[24,1],
  business info, notifications config.

4. Notes
- price_cents is 0 for range/custom-quote tiers (price_display holds the human string).
- duration_minutes + buffer_minutes per service for slot generation.
*/

-- Default weekly availability (0=Sun ... 6=Sat)
INSERT INTO availability_schedule (day_of_week, start_time, end_time, is_active) VALUES
  (0, '09:00', '17:00', false),
  (1, '09:00', '17:00', true),
  (2, '09:00', '17:00', true),
  (3, '09:00', '17:00', true),
  (4, '09:00', '17:00', true),
  (5, '09:00', '17:00', true),
  (6, '09:00', '17:00', false)
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (slug, name, category, description, duration_minutes, buffer_minutes, is_active, display_order) VALUES
  ('tax-preparation', 'Tax Preparation', 'preparation', 'Professional individual tax preparation for W-2 earners, self-employed, and complex filers.', 60, 15, true, 1),
  ('self-employed-tax-preparation', 'Self-Employed Tax Preparation', 'preparation', 'Tax preparation for freelancers, gig workers, 1099 earners, and sole proprietors.', 75, 15, true, 2),
  ('business-tax-preparation', 'Business Tax Preparation', 'preparation', 'Business entity and nonprofit tax return preparation.', 90, 15, true, 3),
  ('tax-advisory', 'Tax Advisory', 'advisory', 'Professional tax guidance for answers, clarity, and direction.', 45, 15, true, 4),
  ('tax-planning', 'Tax Planning', 'planning', 'Proactive tax planning to avoid surprise tax bills.', 60, 15, true, 5),
  ('tax-strategy', 'Tax Strategy', 'strategy', 'Long-term tax strategy for business owners and complex filers.', 90, 15, true, 6),
  ('tax-amendments', 'Tax Amendments', 'amendments', 'Amended tax return help for corrections and missed forms.', 60, 15, true, 7),
  ('tax-compliance', 'Tax Compliance', 'compliance', 'Compliance support for notices, prior-year filing, and business readiness.', 60, 15, true, 8),
  ('ongoing-advisory', 'Ongoing Tax Advisory', 'ongoing', 'Year-round tax planning, compliance, and strategy support plans.', 60, 15, true, 9)
ON CONFLICT (slug) DO NOTHING;

-- Tiers for tax-preparation
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Simple Individual Tax Return', 'W-2 income, standard deduction, basic dependents or credits.', 22500, 'Starting at $225', false, 1 FROM services s WHERE s.slug = 'tax-preparation'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Enhanced Individual Tax Return', 'W-2 income plus 1099s, 1098s, itemized deductions, education credits, retirement income, or multiple tax forms.', 32500, 'Starting at $325', false, 2 FROM services s WHERE s.slug = 'tax-preparation'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Complex Individual Tax Return', 'Self-employment, Schedule C, investments, crypto, rental income, real estate, or multiple income streams.', 52500, 'Starting at $525', false, 3 FROM services s WHERE s.slug = 'tax-preparation'
ON CONFLICT DO NOTHING;

-- Tiers for self-employed-tax-preparation
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Self-Employed / Sole Proprietor Tax Return', '1099-NEC income, business income and expenses, Schedule C filing, gig work, freelance income, payment app income, and contractor income.', 49900, 'Starting at $499', false, 1 FROM services s WHERE s.slug = 'self-employed-tax-preparation'
ON CONFLICT DO NOTHING;

-- Tiers for business-tax-preparation
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Business Entity Tax Return', 'Partnerships, S corporations, C corporations, and business entities.', 89900, 'Starting at $899', false, 1 FROM services s WHERE s.slug = 'business-tax-preparation'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Nonprofit Tax Return', 'Nonprofit organizations needing annual tax filing support.', 75000, 'Starting at $750', false, 2 FROM services s WHERE s.slug = 'business-tax-preparation'
ON CONFLICT DO NOTHING;

-- Tiers for tax-advisory
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Quick Tax Question', 'One focused tax question or basic direction.', 7500, '$75', true, 1 FROM services s WHERE s.slug = 'tax-advisory'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Tax Clarity Session', 'A 30–45 minute consultation to understand your tax concern and next steps.', 14900, '$149', true, 2 FROM services s WHERE s.slug = 'tax-advisory'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Business Tax Advisory Session', 'Business owners needing guidance on deductions, estimated taxes, contractor issues, entity questions, or tax responsibilities.', 24900, '$249', true, 3 FROM services s WHERE s.slug = 'tax-advisory'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Tax Document Review', 'Clients who want their tax documents reviewed before filing or before meeting with a tax professional.', 20000, '$150–$250', false, 4 FROM services s WHERE s.slug = 'tax-advisory'
ON CONFLICT DO NOTHING;

-- Tiers for tax-planning
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Individual Tax Planning Session', 'W-2 earners, families, dependents, withholding review, refund planning, or balance-due planning.', 24900, '$249', true, 1 FROM services s WHERE s.slug = 'tax-planning'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Self-Employed Tax Planning Session', '1099 workers, freelancers, gig workers, business deductions, and estimated tax planning.', 39700, '$397', true, 2 FROM services s WHERE s.slug = 'tax-planning'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Business Owner Tax Planning Session', 'LLC owners, S-Corp questions, quarterly tax planning, owner compensation, and business growth planning.', 59700, '$597–$997', false, 3 FROM services s WHERE s.slug = 'tax-planning'
ON CONFLICT DO NOTHING;

-- Tiers for tax-strategy
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Entity Tax Strategy Review', 'LLC vs. sole proprietor vs. S-Corporation questions.', 49700, '$497', true, 1 FROM services s WHERE s.slug = 'tax-strategy'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'S-Corp Election Analysis', 'Business owners considering S-Corporation tax treatment.', 59700, '$597–$997', false, 2 FROM services s WHERE s.slug = 'tax-strategy'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Business Tax Strategy Intensive', 'Business owners needing a deeper review of tax structure, deductions, compensation, and planning opportunities.', 99700, '$997–$1,500+', false, 3 FROM services s WHERE s.slug = 'tax-strategy'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Multi-Income Tax Strategy Session', 'Clients with W-2 income plus business income, rental income, crypto, investments, or side income.', 69700, '$697–$1,200+', false, 4 FROM services s WHERE s.slug = 'tax-strategy'
ON CONFLICT DO NOTHING;

-- Tiers for tax-amendments
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Tier 1 Amendment', 'W-2 income only, simple correction, no business income.', 9900, '$99', true, 1 FROM services s WHERE s.slug = 'tax-amendments'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Tier 2 Amendment', 'W-2 income plus 1099 series, 1098, education credits, dependent corrections, or missed forms.', 15000, '$150–$225', false, 2 FROM services s WHERE s.slug = 'tax-amendments'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Tier 3 Amendment', 'Self-employment, business income, crypto, real estate, rental income, investment sales, multi-state issues, or major filing corrections.', 30000, '$300–$600+', false, 3 FROM services s WHERE s.slug = 'tax-amendments'
ON CONFLICT DO NOTHING;

-- Tiers for tax-compliance
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'IRS or State Notice Review', 'Clients who received a tax notice and need help understanding it.', 20000, '$150–$250', false, 1 FROM services s WHERE s.slug = 'tax-compliance'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Notice Response Support', 'Clients who need review, explanation, and basic response preparation support.', 35000, '$350–$750+', false, 2 FROM services s WHERE s.slug = 'tax-compliance'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Estimated Tax Payment Review', 'Clients who need help reviewing quarterly estimated tax payment direction.', 22500, '$175–$275', false, 3 FROM services s WHERE s.slug = 'tax-compliance'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Contractor Tax Compliance Review', 'Business owners with contractors, 1099 records, W-9s, or payment documentation concerns.', 29700, '$297–$697', false, 4 FROM services s WHERE s.slug = 'tax-compliance'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, display_order)
SELECT s.id, 'Business Tax Compliance Checkup', 'Business owners needing a review of tax readiness, filing requirements, and compliance gaps.', 39700, '$397–$897', false, 5 FROM services s WHERE s.slug = 'tax-compliance'
ON CONFLICT DO NOTHING;

-- Tiers for ongoing-advisory (recurring)
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, is_recurring, recurring_interval, display_order)
SELECT s.id, 'Tax Clarity Plan', 'Individuals and self-employed clients who need quarterly guidance and tax planning.', 49700, 'Starting at $497 per quarter', false, true, 'quarter', 1 FROM services s WHERE s.slug = 'ongoing-advisory'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, is_recurring, recurring_interval, display_order)
SELECT s.id, 'Tax-Ready Business Plan', 'Business owners who need quarterly tax planning, compliance review, and preparation support.', 49700, 'Starting at $497–$750/month', false, true, 'month', 2 FROM services s WHERE s.slug = 'ongoing-advisory'
ON CONFLICT DO NOTHING;
INSERT INTO service_tiers (service_id, name, best_for, price_cents, price_display, is_fixed_price, is_recurring, recurring_interval, display_order)
SELECT s.id, 'Strategic Tax Advisory Plan', 'Serious business owners who need ongoing tax planning, tax strategy, compliance guidance, and year-round advisory support.', 99700, 'Starting at $997–$1,500+/month', false, true, 'month', 3 FROM services s WHERE s.slug = 'ongoing-advisory'
ON CONFLICT DO NOTHING;

-- Default admin settings
INSERT INTO admin_settings (key, value) VALUES
  ('business_hours', '{"mon":{"start":"09:00","end":"17:00","active":true},"tue":{"start":"09:00","end":"17:00","active":true},"wed":{"start":"09:00","end":"17:00","active":true},"thu":{"start":"09:00","end":"17:00","active":true},"fri":{"start":"09:00","end":"17:00","active":true},"sat":{"start":"09:00","end":"17:00","active":false},"sun":{"start":"09:00","end":"17:00","active":false}}'::jsonb),
  ('booking_buffer_days', '1'::jsonb),
  ('max_booking_days_ahead', '30'::jsonb),
  ('appointment_reminder_hours', '[24, 1]'::jsonb),
  ('business_info', '{"name":"Eyneya Business Solutions","phone":"(770) 555-0142","email":"hello@eyneya.com","city":"Kennesaw","state":"GA","address":"","service_area":["Kennesaw","Marietta","Acworth","Canton","Roswell","Smyrna","Sandy Springs"]}'::jsonb),
  ('notifications', '{"admin_email":"hello@eyneya.com","new_booking":true,"new_contact":true,"new_application":true,"payment_received":true}'::jsonb),
  ('calendar_settings', '{"import_google_busy":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
