import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Plan } from '../lib/types';

interface PricingFeature {
  name: string;
  free: boolean;
  premium: boolean;
  premium_plus: boolean;
}

export function PricingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true)
          .order('price_cents', { ascending: true });

        if (data) setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const fallbackPlans: Plan[] = [
    {
      id: '1',
      name: 'Free',
      price_cents: 0,
      price_display: '₹0',
      features: [
        'Up to 10 projects',
        'Basic CRM features',
        'Community support',
        'Basic marketplace access',
        '5 leads per month',
        '1 user account',
      ],
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
      features: [
        'Unlimited projects',
        'Advanced CRM with automation',
        'Priority email support',
        'Full marketplace access',
        'Unlimited leads',
        'Up to 5 user accounts',
        'Advanced reporting',
        'API access (limited)',
      ],
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
      features: [
        'Everything in Premium',
        'White-label solution',
        '24/7 phone & chat support',
        'Dedicated account manager',
        'Unlimited users',
        'Custom integrations',
        'Priority API access',
        'Advanced security features',
        'Custom workflows',
        'White-label marketplace',
      ],
      max_leads: 5000,
      max_projects: 1000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

  const features: PricingFeature[] = [
    {
      name: 'Projects',
      free: true,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'CRM Leads Management',
      free: true,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Advanced Reporting',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Team Collaboration',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Sales Pipeline',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Automation Workflows',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'API Access',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Integrations',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Priority Support',
      free: false,
      premium: true,
      premium_plus: true,
    },
    {
      name: 'Custom Integrations',
      free: false,
      premium: false,
      premium_plus: true,
    },
    {
      name: 'White-label Solution',
      free: false,
      premium: false,
      premium_plus: true,
    },
    {
      name: 'Dedicated Support',
      free: false,
      premium: false,
      premium_plus: true,
    },
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan anytime. Changes take effect at the start of your next billing cycle.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing comes with a 20% discount. Contact our sales team for custom pricing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, UPI, and bank transfers. For enterprise customers, we offer net payment terms.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! The Free plan is always available with no credit card required. Upgrade to Premium or Premium+ anytime.',
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'We notify you when approaching limits. You can upgrade anytime to increase limits, or contact us for a custom plan.',
    },
    {
      question: 'Do you offer enterprise pricing?',
      answer: 'Absolutely! For large teams and custom requirements, please contact our sales team at sales@devcrm.hub',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Choose the perfect plan for your business. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-900'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {displayPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`rounded-2xl overflow-hidden transition-all ${
                  index === 1
                    ? 'ring-2 ring-blue-600 lg:scale-105 shadow-2xl bg-gradient-to-b from-white to-blue-50'
                    : 'bg-white shadow-lg border border-slate-200'
                }`}
              >
                {index === 1 && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 font-semibold">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-900">
                      {plan.price_display.split('/')[0]}
                    </span>
                    {plan.price_cents > 0 && (
                      <span className="text-slate-600 ml-2">{plan.price_display.split('/')[1]}</span>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-6">
                    {plan.max_leads} leads • {plan.max_projects} projects
                  </p>

                  {user && user.plan === plan.name.toLowerCase() ? (
                    <button className="w-full py-3 px-4 rounded-lg font-semibold bg-slate-100 text-slate-900 mb-8 cursor-default">
                      ✓ Current Plan
                    </button>
                  ) : (
                    <Link
                      to={user ? '/dashboard' : `/auth/signup?plan=${plan.name.toLowerCase()}`}
                      className="block w-full py-3 px-4 rounded-lg font-semibold transition-colors text-center mb-8 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {user ? 'Upgrade Now' : 'Get Started'}
                    </Link>
                  )}

                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
            Detailed Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Premium</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-900">Premium+</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr
                    key={i}
                    className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-100'}`}
                  >
                    <td className="py-4 px-6 font-medium text-slate-900">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {feature.free ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.premium ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {feature.premium_plus ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-slate-50 rounded-lg border border-slate-200 p-6 cursor-pointer hover:border-blue-300 transition-colors"
              >
                <summary className="flex items-center justify-between font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                  <HelpCircle className="h-5 w-5 text-slate-600 group-open:text-blue-600 transition-colors" />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Try our Free plan or upgrade to Premium to unlock powerful features
          </p>
          {!user ? (
            <Link
              to="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/dashboard/billing"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Manage Subscription
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
