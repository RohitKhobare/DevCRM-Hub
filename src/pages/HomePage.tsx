import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Code2, Users, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Project, Plan } from '../lib/types';

export function HomePage() {
  const { user } = useAuth();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured projects
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(3)
          .order('sort_order', { ascending: true });

        if (projects) setFeaturedProjects(projects);

        // Fetch plans
        const { data: plansData } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true)
          .order('price_cents', { ascending: true });

        if (plansData) setPlans(plansData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fallbackProjects: Project[] = [
    {
      id: '1',
      name: 'CRM Pro Suite',
      slug: 'crm-pro-suite',
      description: 'Enterprise CRM with AI-powered lead scoring',
      short_description: 'Full-featured CRM solution with advanced analytics',
      category: 'crm',
      tech_stack: ['React', 'Node.js', 'PostgreSQL'],
      features: ['Lead Management', 'Sales Pipeline', 'Analytics'],
      price_cents: 49999,
      price_display: '₹49,999',
      license_type: 'commercial',
      demo_url: 'https://example.com/demo',
      download_url: null,
      screenshots: ['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800'],
      demo_video_url: null,
      is_featured: true,
      is_active: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'AI Content Generator',
      slug: 'ai-content-generator',
      description: 'Generate marketing content with advanced AI',
      short_description: 'AI-powered content creation tool',
      category: 'ai',
      tech_stack: ['Python', 'FastAPI', 'React'],
      features: ['Content Generation', 'SEO Optimization', 'Multi-language'],
      price_cents: 29999,
      price_display: '₹29,999',
      license_type: 'commercial',
      demo_url: 'https://example.com/demo',
      download_url: null,
      screenshots: ['https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?w=800'],
      demo_video_url: null,
      is_featured: true,
      is_active: true,
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Mobile ERP System',
      slug: 'mobile-erp-system',
      description: 'Complete ERP for mobile-first businesses',
      short_description: 'ERP system optimized for mobile platforms',
      category: 'erp',
      tech_stack: ['React Native', 'Node.js', 'MongoDB'],
      features: ['Inventory Management', 'Mobile Access', 'Real-time Sync'],
      price_cents: 59999,
      price_display: '₹59,999',
      license_type: 'commercial',
      demo_url: 'https://example.com/demo',
      download_url: null,
      screenshots: ['https://images.pexels.com/photos/3888151/pexels-photo-3888151.jpeg?w=800'],
      demo_video_url: null,
      is_featured: true,
      is_active: true,
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const fallbackPlans: Plan[] = [
    {
      id: '1',
      name: 'Free',
      price_cents: 0,
      price_display: '₹0',
      features: ['Up to 10 projects', 'Basic support', 'Community access'],
      max_leads: 50,
      max_projects: 10,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Premium',
      price_cents: 99900,
      price_display: '₹999/mo',
      features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom branding'],
      max_leads: 500,
      max_projects: 100,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Premium+',
      price_cents: 499900,
      price_display: '₹4,999/mo',
      features: ['Everything in Premium', 'White-label solution', '24/7 dedicated support', 'API access'],
      max_leads: 5000,
      max_projects: 1000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : fallbackProjects;

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder, TechStart',
      text: 'DevCRM Hub transformed how we manage client relationships. The marketplace has been a game-changer for our business.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100',
    },
    {
      name: 'Priya Singh',
      role: 'CEO, GrowthCo',
      text: 'Outstanding platform with excellent support. The features are comprehensive yet easy to use. Highly recommended!',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100',
    },
    {
      name: 'Amit Patel',
      role: 'Entrepreneur',
      text: 'The best investment for scaling our business. The CRM features alone have increased our conversion by 40%.',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute h-96 w-96 rounded-full bg-blue-500 blur-3xl -top-40 -left-40"></div>
          <div className="absolute h-96 w-96 rounded-full bg-blue-600 blur-3xl -bottom-40 -right-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build & Sell Software.<br />Manage Clients.<br />Grow Business.
            </h1>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
              The all-in-one platform for developers and businesses. Combine powerful CRM, thriving marketplace, and modern SaaS tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/signup"
                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/auth/signin"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Code2 className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">500+</p>
              <p className="text-slate-600">Projects Available</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">10K+</p>
              <p className="text-slate-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">50K+</p>
              <p className="text-slate-600">Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            Featured Projects
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Discover powerful solutions from our community of developers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {project.screenshots[0] && (
                  <img
                    src={project.screenshots[0]}
                    alt={project.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {project.short_description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">
                      {project.price_display}
                    </span>
                    <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            How It Works
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Get started in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Sign Up</h3>
              <p className="text-slate-600">
                Create your free account in seconds and get instant access to our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Choose Solution</h3>
              <p className="text-slate-600">
                Browse our marketplace and select the perfect project for your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Start Growing</h3>
              <p className="text-slate-600">
                Use powerful tools to manage clients and scale your business faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Choose the perfect plan for your business
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPlans.slice(0, 3).map((plan, index) => (
              <div
                key={plan.id}
                className={`rounded-xl overflow-hidden transition-all ${
                  index === 1
                    ? 'ring-2 ring-blue-600 lg:scale-105'
                    : 'bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {index === 1 && (
                  <div className="bg-blue-600 text-white text-center py-2 font-semibold text-sm">
                    MOST POPULAR
                  </div>
                )}
                <div className={`p-8 ${index === 1 ? 'bg-white' : ''}`}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold text-slate-900 mb-6">
                    {plan.price_display}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-700">
                        <Check className="h-5 w-5 text-emerald-600 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      index === 1
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            Loved by Thousands
          </h2>
          <p className="text-center text-slate-600 mb-12">
            See what our customers have to say
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-8">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs and developers using DevCRM Hub
          </p>
          {!user ? (
            <Link
              to="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Explore Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
