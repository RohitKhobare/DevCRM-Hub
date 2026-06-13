-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'premium', 'premium_plus', 'admin', 'super_admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'premium_plus')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscription Plans
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL DEFAULT 0,
  price_display TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  max_leads INTEGER NOT NULL DEFAULT 5,
  max_projects INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects (Marketplace)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('java', 'spring_boot', 'react', 'ai', 'erp', 'crm', 'mobile', 'other')),
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  price_cents INTEGER NOT NULL DEFAULT 0,
  price_display TEXT NOT NULL,
  license_type TEXT NOT NULL DEFAULT 'standard' CHECK (license_type IN ('standard', 'commercial', 'enterprise')),
  demo_url TEXT,
  download_url TEXT,
  screenshots TEXT[] NOT NULL DEFAULT '{}',
  demo_video_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id),
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_payment_id TEXT,
  provider_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leads (CRM)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'referral', 'social', 'email', 'phone', 'whatsapp', 'other')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'proposal_sent', 'won', 'lost')),
  potential_revenue_cents INTEGER NOT NULL DEFAULT 0,
  assigned_to UUID REFERENCES public.profiles(id),
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Opportunities (CRM)
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  value_cents INTEGER NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'qualification' CHECK (stage IN ('qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  expected_close_date DATE,
  probability INTEGER NOT NULL DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activities (CRM)
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'status_change')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact Messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  admin_reply TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Project Access (purchased projects)
CREATE TABLE public.user_project_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  download_count INTEGER NOT NULL DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Insert default plans
INSERT INTO public.plans (name, price_cents, price_display, features, max_leads, max_projects) VALUES
  ('free', 0, 'Free', '["5 Leads","1 Project Demo Access","Basic CRM","Email Support"]', 5, 1),
  ('premium', 99900, '₹999/month', '["100 Leads","CRM Dashboard","Advanced Reports","Project Purchases","Document Upload","Email Notifications","Lead Analytics"]', 100, 50),
  ('premium_plus', 499900, '₹4,999/month', '["Unlimited Leads","Unlimited Projects","WhatsApp Integration","AI Suggestions","Advanced Analytics","Priority Support","Custom Branding","API Access"]', 999999, 999999);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_access ENABLE ROW LEVEL SECURITY;

-- Plans: public read
CREATE POLICY "plans_select_public" ON public.plans FOR SELECT TO anon, authenticated USING (true);

-- Projects: public read, admin write
CREATE POLICY "projects_select_public" ON public.projects FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "projects_insert_admin" ON public.projects FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "projects_update_admin" ON public.projects FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "projects_delete_admin" ON public.projects FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Profiles: users read own, admin read all
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))) WITH CHECK (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Subscriptions: users own, admin all
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "subscriptions_insert_own" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "subscriptions_update_admin" ON public.subscriptions FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Orders: users own, admin all
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Payments: users own, admin all
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "payments_update_admin" ON public.payments FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Leads: users own, admin all
CREATE POLICY "leads_select_own" ON public.leads FOR SELECT TO authenticated USING (user_id = auth.uid() OR assigned_to = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "leads_insert_own" ON public.leads FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "leads_update_own" ON public.leads FOR UPDATE TO authenticated USING (user_id = auth.uid() OR assigned_to = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "leads_delete_own" ON public.leads FOR DELETE TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Opportunities: users own, admin all
CREATE POLICY "opportunities_select_own" ON public.opportunities FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "opportunities_insert_own" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "opportunities_update_own" ON public.opportunities FOR UPDATE TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "opportunities_delete_own" ON public.opportunities FOR DELETE TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Activities: users own, admin all
CREATE POLICY "activities_select_own" ON public.activities FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "activities_insert_own" ON public.activities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "activities_delete_own" ON public.activities FOR DELETE TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Contact messages: insert for anyone, admin read/write
CREATE POLICY "contact_messages_insert_anyone" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_messages_select_admin" ON public.contact_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "contact_messages_update_admin" ON public.contact_messages FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Audit logs: admin only
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "audit_logs_insert_system" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- User project access: users own, admin all
CREATE POLICY "user_project_access_select_own" ON public.user_project_access FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "user_project_access_insert_own" ON public.user_project_access FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_project_access_update_own" ON public.user_project_access FOR UPDATE TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Seed sample projects
INSERT INTO public.projects (name, slug, description, short_description, category, tech_stack, features, price_cents, price_display, license_type, screenshots, is_featured, sort_order) VALUES
  ('E-Commerce Platform', 'ecommerce-platform', 'A full-featured e-commerce platform built with Spring Boot and React. Includes product management, cart, checkout, payment integration with Razorpay, order tracking, admin dashboard, and multi-vendor support.', 'Full-featured e-commerce platform with Spring Boot & React', 'spring_boot', ARRAY['Spring Boot', 'React', 'PostgreSQL', 'Razorpay', 'Redis'], ARRAY['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Admin Dashboard', 'Multi-vendor'], 499900, '₹4,999', 'commercial', ARRAY['https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg','https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg'], true, 1),
  ('HR Management System', 'hr-management', 'Complete HR management system with employee tracking, leave management, payroll processing, attendance tracking, and performance reviews. Built with Spring Boot and React.', 'Complete HR management with payroll & attendance', 'erp', ARRAY['Spring Boot', 'React', 'PostgreSQL', 'Jasper Reports'], ARRAY['Employee Management', 'Leave System', 'Payroll', 'Attendance', 'Performance Reviews'], 299900, '₹2,999', 'commercial', ARRAY['https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg','https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'], true, 2),
  ('AI Chatbot Builder', 'ai-chatbot-builder', 'Build intelligent chatbots powered by OpenAI/Gemini API. Features include conversation flow design, NLP training, multi-channel deployment, and analytics dashboard.', 'AI-powered chatbot builder with NLP & analytics', 'ai', ARRAY['Python', 'FastAPI', 'React', 'OpenAI', 'WebSocket'], ARRAY['Flow Designer', 'NLP Training', 'Multi-channel Deploy', 'Analytics', 'API Access'], 799900, '₹7,999', 'enterprise', ARRAY['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg','https://images.pexels.com/photos/8386469/pexels-photo-8386469.jpeg'], true, 3),
  ('React Dashboard Template', 'react-dashboard', 'Modern admin dashboard template built with React 19, TypeScript, Tailwind CSS, and Recharts. Includes 50+ components, dark mode, and responsive design.', 'Modern admin dashboard with 50+ components', 'react', ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Recharts'], ARRAY['50+ Components', 'Dark Mode', 'Responsive', 'Charts', 'Data Tables'], 149900, '₹1,499', 'standard', ARRAY['https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg','https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg'], true, 4),
  ('Mobile Fitness App', 'fitness-app', 'Cross-platform fitness tracking mobile app built with React Native. Features workout tracking, meal planning, progress analytics, and social features.', 'Cross-platform fitness tracking app', 'mobile', ARRAY['React Native', 'Node.js', 'MongoDB', 'Firebase'], ARRAY['Workout Tracking', 'Meal Plans', 'Analytics', 'Social Features', 'Push Notifications'], 349900, '₹3,499', 'commercial', ARRAY['https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg','https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg'], true, 5),
  ('Inventory Management', 'inventory-management', 'Real-time inventory management system with barcode scanning, stock alerts, purchase orders, supplier management, and comprehensive reporting.', 'Real-time inventory management with barcode scanning', 'erp', ARRAY['Spring Boot', 'React', 'PostgreSQL', 'WebSocket'], ARRAY['Barcode Scanning', 'Stock Alerts', 'Purchase Orders', 'Supplier Mgmt', 'Reports'], 249900, '₹2,499', 'commercial', ARRAY['https://images.pexels.com/photos/4481253/pexels-photo-4481253.jpeg'], false, 6),
  ('CRM System Pro', 'crm-system-pro', 'Professional CRM system with lead management, pipeline tracking, email campaigns, task automation, and AI-powered lead scoring.', 'Professional CRM with AI lead scoring', 'crm', ARRAY['Spring Boot', 'React', 'PostgreSQL', 'OpenAI'], ARRAY['Lead Management', 'Pipeline Tracking', 'Email Campaigns', 'Task Automation', 'AI Scoring'], 599900, '₹5,999', 'enterprise', ARRAY['https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg','https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'], true, 7),
  ('Java Microservices Kit', 'java-microservices', 'Production-ready Java microservices architecture with Spring Cloud, API Gateway, Service Discovery, Circuit Breaker, and Docker Compose setup.', 'Production-ready microservices architecture', 'java', ARRAY['Java 21', 'Spring Cloud', 'Docker', 'Kubernetes'], ARRAY['API Gateway', 'Service Discovery', 'Circuit Breaker', 'Config Server', 'Docker Compose'], 699900, '₹6,999', 'enterprise', ARRAY['https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg'], false, 8);
