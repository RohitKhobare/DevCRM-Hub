import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Lead, Activity } from '../../lib/types';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import {
  BarChart3,
  TrendingUp,
  FolderOpen,
  Zap,
  Plus,
  ShoppingCart,
  Package,
  Activity as ActivityIcon,
  Clock,
} from 'lucide-react';

export function DashboardPage() {
  const { user, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeOpportunities: 0,
    purchasedProjects: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setDataLoading(true);

    try {
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: opportunitiesData } = await supabase
        .from('opportunities')
        .select('*')
        .eq('user_id', user.id)
        .neq('stage', 'closed_lost')
        .neq('stage', 'closed_won');

      const { data: activitiesData } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: projectAccessData } = await supabase
        .from('user_project_access')
        .select('*')
        .eq('user_id', user.id);

      const { count: totalLeadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setLeads(leadsData || []);
      setActivities(activitiesData || []);
      setStats({
        totalLeads: totalLeadsCount || 0,
        activeOpportunities: opportunitiesData?.length || 0,
        purchasedProjects: projectAccessData?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isPremium = user?.plan === 'premium' || user?.plan === 'premium_plus';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 mt-2">
            {isPremium ? (
              <>You have full access to DevCRM Hub. Here's your dashboard overview.</>
            ) : (
              <>Upgrade to Premium to unlock advanced CRM features and more projects.</>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Leads */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalLeads}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-4">All contacts tracked in your CRM</p>
          </div>

          {/* Active Opportunities */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Opportunities</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeOpportunities}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <BarChart3 className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-4">Open deals in your pipeline</p>
          </div>

          {/* Purchased Projects */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Purchased Projects</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.purchasedProjects}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FolderOpen className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-4">Code solutions owned</p>
          </div>

          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Current Plan</p>
                <p className="text-2xl font-bold text-slate-900 mt-2 capitalize">{user?.plan}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg">
                <Zap className="text-slate-600" size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-4">
              {isPremium ? 'Premium access active' : 'Upgrade available'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition">
              <Plus size={20} />
              Add New Lead
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 rounded-lg px-4 py-3 font-medium hover:bg-slate-300 transition">
              <ShoppingCart size={20} />
              Browse Marketplace
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 rounded-lg px-4 py-3 font-medium hover:bg-slate-300 transition">
              <Package size={20} />
              View Projects
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Recent Leads
              </h2>
            </div>
            {dataLoading ? (
              <div className="p-6 text-center text-slate-500">Loading...</div>
            ) : leads.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <p className="mb-4">No leads yet. Start adding leads to your CRM.</p>
                <button className="text-blue-600 font-medium hover:underline">Create First Lead</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">{lead.name}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{lead.email}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                          {formatCurrency(lead.potential_revenue_cents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ActivityIcon size={20} className="text-emerald-600" />
                Recent Activity
              </h2>
            </div>
            {dataLoading ? (
              <div className="p-6 text-center text-slate-500">Loading...</div>
            ) : activities.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No activity yet</div>
            ) : (
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        {activity.type === 'call' && <span className="text-xs">📞</span>}
                        {activity.type === 'email' && <span className="text-xs">📧</span>}
                        {activity.type === 'meeting' && <span className="text-xs">📅</span>}
                        {activity.type === 'note' && <span className="text-xs">📝</span>}
                        {activity.type === 'status_change' && <span className="text-xs">✓</span>}
                      </div>
                      {index !== activities.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {activity.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {formatDateTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Chart Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            Pipeline Overview
          </h2>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-center">
              <BarChart3 size={48} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">Pipeline chart coming soon</p>
              <p className="text-sm text-slate-400">Visualize your sales pipeline stages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
