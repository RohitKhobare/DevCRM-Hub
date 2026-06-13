export type UserRole = 'user' | 'premium' | 'premium_plus' | 'admin' | 'super_admin';
export type PlanType = 'free' | 'premium' | 'premium_plus';
export type LeadStatus = 'new' | 'contacted' | 'interested' | 'proposal_sent' | 'won' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'phone' | 'whatsapp' | 'other';
export type OpportunityStage = 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ProjectCategory = 'java' | 'spring_boot' | 'react' | 'ai' | 'erp' | 'crm' | 'mobile' | 'other';
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'status_change';
export type ContactStatus = 'new' | 'read' | 'replied' | 'closed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  plan: PlanType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price_cents: number;
  price_display: string;
  features: string[];
  max_leads: number;
  max_projects: number;
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  started_at: string;
  expires_at: string | null;
  created_at: string;
  plan?: Plan;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: ProjectCategory;
  tech_stack: string[];
  features: string[];
  price_cents: number;
  price_display: string;
  license_type: 'standard' | 'commercial' | 'enterprise';
  demo_url: string | null;
  download_url: string | null;
  screenshots: string[];
  demo_video_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  project_id: string;
  amount_cents: number;
  status: OrderStatus;
  payment_id: string | null;
  created_at: string;
  project?: Project;
}

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  amount_cents: number;
  currency: string;
  provider: string;
  provider_payment_id: string | null;
  provider_order_id: string | null;
  status: PaymentStatus;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  source: LeadSource;
  status: LeadStatus;
  potential_revenue_cents: number;
  assigned_to: string | null;
  notes: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  user_id: string;
  lead_id: string | null;
  name: string;
  value_cents: number;
  stage: OpportunityStage;
  expected_close_date: string | null;
  probability: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  lead_id: string | null;
  type: ActivityType;
  description: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactStatus;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface UserProjectAccess {
  id: string;
  user_id: string;
  project_id: string;
  order_id: string;
  download_count: number;
  last_downloaded_at: string | null;
  created_at: string;
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  java: 'Java',
  spring_boot: 'Spring Boot',
  react: 'React',
  ai: 'AI / ML',
  erp: 'ERP',
  crm: 'CRM',
  mobile: 'Mobile',
  other: 'Other',
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  interested: 'bg-green-100 text-green-800',
  proposal_sent: 'bg-purple-100 text-purple-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-100 text-red-800',
};

export const OPPORTUNITY_STAGE_LABELS: Record<OpportunityStage, string> = {
  qualification: 'Qualification',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

export const OPPORTUNITY_STAGE_COLORS: Record<OpportunityStage, string> = {
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-emerald-100 text-emerald-800',
  closed_lost: 'bg-red-100 text-red-800',
};
