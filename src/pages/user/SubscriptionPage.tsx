import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Plan, Subscription } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import {
  Zap,
  Check,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  History,
  CreditCard,
} from 'lucide-react';

const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    'Up to 10 leads',
    'Basic CRM features',
    'Email support',
    '1 project available',
    'Limited reports',
  ],
  premium: [
    'Up to 100 leads',
    'Advanced CRM features',
    'Priority email support',
    'Unlimited projects',
    'Advanced reports',
    'Email automation',
    'Team collaboration',
  ],
  premium_plus: [
    'Unlimited leads',
    'Full CRM suite',
    '24/7 phone support',
    'Unlimited projects',
    'Custom reports',
    'Email & SMS automation',
    'Team collaboration',
    'API access',
    'Dedicated account manager',
  ],
};

export function SubscriptionPage() {
  const { user, loading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);

  // Plans are fetched but current UI uses PLAN_FEATURES constant
  void plans;
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchSubscriptionData();
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;
    setDataLoading(true);

    try {
      const { data: plansData } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price_cents', { ascending: true });

      const { data: subscriptionsData } = await supabase
        .from('subscriptions')
        .select('*, plan:plan_id(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPlans(plansData || []);
      setSubscriptions(subscriptionsData || []);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setUpgradingPlan(planId);
    try {
      // This would typically redirect to a payment processor
      // For now, we'll just show a message
      console.log('Initiating upgrade to plan:', planId);
      // In a real app, this would call an API endpoint that initiates Stripe checkout
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const getCurrentSubscription = () => {
    return subscriptions.find((sub) => sub.status === 'active');
  };

  const currentSubscription = getCurrentSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="text-blue-600" size={32} />
            Subscription & Billing
          </h1>
          <p className="text-slate-600 mt-2">Manage your plan and view billing history</p>
        </div>

        {/* Current Plan Status */}
        {currentSubscription && (
          <div className="mb-8 bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Current Plan</h2>
                <p className="text-slate-600 text-sm mt-1">
                  {currentSubscription.plan?.name || user?.plan}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-600">Status</p>
                <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">
                  {currentSubscription.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Start Date</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {formatDate(currentSubscription.started_at)}
                </p>
              </div>
              {currentSubscription.expires_at && (
                <div>
                  <p className="text-xs text-slate-600">Renewal Date</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {formatDate(currentSubscription.expires_at)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-600">Price</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {currentSubscription.plan?.price_display || 'Custom'}
                </p>
              </div>
            </div>

            {currentSubscription.plan?.features && currentSubscription.plan.features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentSubscription.plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check size={16} className="text-emerald-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Plans Comparison */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Plans & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className={`rounded-lg border-2 overflow-hidden transition ${
              user?.plan === 'free'
                ? 'border-blue-600 shadow-lg'
                : 'border-slate-200 hover:border-slate-300'
            } bg-white`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Free</h3>
                    <p className="text-sm text-slate-600 mt-1">Get started with basic CRM</p>
                  </div>
                  {user?.plan === 'free' && (
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      Current
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">₹0</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>

                <button
                  disabled={user?.plan === 'free'}
                  className="w-full mb-6 py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: user?.plan === 'free' ? '#e2e8f0' : '#e2e8f0',
                    color: user?.plan === 'free' ? '#64748b' : '#1e293b',
                  }}
                >
                  {user?.plan === 'free' ? 'Current Plan' : 'Downgrade'}
                </button>

                <div className="space-y-3">
                  {PLAN_FEATURES.free.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                      <Check size={16} className="text-emerald-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className={`rounded-lg border-2 overflow-hidden transition transform ${
              user?.plan === 'premium'
                ? 'border-blue-600 shadow-lg scale-105 md:scale-100'
                : 'border-slate-200 hover:border-slate-300'
            } bg-white`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Premium</h3>
                    <p className="text-sm text-slate-600 mt-1">For growing businesses</p>
                  </div>
                  {user?.plan === 'premium' && (
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      Current
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">₹999</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>

                <button
                  onClick={() => handleUpgrade('premium')}
                  disabled={upgradingPlan === 'premium' || user?.plan === 'premium'}
                  className="w-full mb-6 py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {user?.plan === 'premium' ? (
                    'Current Plan'
                  ) : (
                    <>
                      Upgrade <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="space-y-3">
                  {PLAN_FEATURES.premium.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                      <Check size={16} className="text-emerald-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Plus Plan */}
            <div className={`rounded-lg border-2 overflow-hidden transition ${
              user?.plan === 'premium_plus'
                ? 'border-blue-600 shadow-lg'
                : 'border-slate-200 hover:border-slate-300'
            } bg-white`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Premium Plus</h3>
                    <p className="text-sm text-slate-600 mt-1">For enterprises</p>
                  </div>
                  {user?.plan === 'premium_plus' && (
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      Current
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">₹2,999</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>

                <button
                  onClick={() => handleUpgrade('premium_plus')}
                  disabled={upgradingPlan === 'premium_plus' || user?.plan === 'premium_plus'}
                  className="w-full mb-6 py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {user?.plan === 'premium_plus' ? (
                    'Current Plan'
                  ) : (
                    <>
                      Upgrade <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="space-y-3">
                  {PLAN_FEATURES.premium_plus.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                      <Check size={16} className="text-emerald-600 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription History */}
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <History size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Subscription History</h2>
          </div>

          {dataLoading ? (
            <div className="p-6 text-center text-slate-500">Loading...</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No subscription history</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">
                        {sub.plan?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {formatDate(sub.started_at)}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {sub.expires_at ? formatDate(sub.expires_at) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Billing Info */}
        <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-blue-600" />
            Billing Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-2">Payment Method</p>
              <p className="text-slate-900 font-medium">No payment method on file</p>
              <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">
                Add Payment Method
              </button>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Next Billing Date</p>
              {currentSubscription?.expires_at ? (
                <p className="text-slate-900 font-medium">
                  {formatDate(currentSubscription.expires_at)}
                </p>
              ) : (
                <p className="text-slate-600">No recurring billing</p>
              )}
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Need help?</p>
              <p>Contact our support team at support@devcrm.hub for billing inquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
