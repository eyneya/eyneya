export interface NavLinkItem {
  label: string;
  to: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavLinkItem[];
}

export const SERVICES_NAV: NavLinkItem[] = [
  { label: 'Tax Preparation', to: '/tax-preparation', description: 'Individual returns — Simple, Enhanced, Complex' },
  { label: 'Self-Employed Tax Preparation', to: '/self-employed-tax-preparation', description: 'Schedule C, 1099, freelancers & gig workers' },
  { label: 'Business Tax Preparation', to: '/business-tax-preparation', description: 'S-Corp, Partnership, C-Corp, Nonprofit' },
  { label: 'Tax Amendments', to: '/tax-amendments', description: 'Correct mistakes, report missing income' },
  { label: 'Tax Compliance', to: '/tax-compliance', description: 'IRS notices, prior-year filing, 1099s' },
  { label: 'Prior-Year Filing', to: '/tax-compliance#prior-year', description: 'Catch up on unfiled tax years' },
];

export const MAIN_NAV: NavLinkItem[] = [
  { label: 'Tax Planning', to: '/tax-planning' },
  { label: 'Tax Advisory', to: '/tax-advisory' },
  { label: 'Tax Strategy', to: '/tax-strategy' },
  { label: 'Tax Amendments', to: '/tax-amendments' },
  { label: 'Ongoing Advisory', to: '/ongoing-advisory' },
];

export const LEARN_CONNECT_NAV: NavLinkItem[] = [
  { label: 'Tax Tips', to: '/tax-tips' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];
