import { useState, useEffect } from 'react';
import { Users, DollarSign, ShoppingCart, TrendingUp, Package, MessageSquare } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Order, LEAD_STATUS_LABELS, LeadStatus } from '../../lib/types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeSubscriptions: number;
  totalLeads: number;
  totalProjects: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    activeSubscriptions: 0,
    totalLeads: 0,
    totalProjects: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<{ name: string; value: number }[]>([]);
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [
          { count: userCount },
          { count: orderCount },
          { count: subscriptionCount },
          { count: leadCount },
          { count: projectCount },
          { data: orders },
          { data: profiles },
          { data: leads },
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase
            .from('orders')
            .select('*, project:projects(*)')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('profiles')
            .select('id, full_name, email, created_at, plan')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase.from('leads').select('status'),
        ]);

        const totalRevenue = (orders || []).reduce((sum, order) => sum + order.amount_cents, 0);

        setStats({
          totalUsers: userCount || 0,
          totalRevenue,
          totalOrders: orderCount || 0,
          activeSubscriptions: subscriptionCount || 0,
          totalLeads: leadCount || 0,
          totalProjects: projectCount || 0,
        });

        setRecentOrders((orders || []) as Order[]);
        setRecentSignups(profiles || []);

        const leadStatusCounts = (leads || []).reduce(
          (acc, lead) => {
            const status = lead.status as LeadStatus;
            const existing = acc.find((item) => item.name === LEAD_STATUS_LABELS[status]);
            if (existing) {
              existing.value++;
            } else {
              acc.push({ name: LEAD_STATUS_LABELS[status], value: 1 });
            }
            return acc;
          },
          [] as { name: string; value: number }[]
        );

        setLeadStatuses(leadStatusCounts);

        const revenueByMonth = (orders || []).reduce(
          (acc, order) => {
            const date = new Date(order.created_at);
            const month = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
            const existing = acc.find((item: RevenueData) => item.month === month);
            if (existing) {
              existing.revenue += order.amount_cents;
            } else {
              acc.push({ month, revenue: order.amount_cents });
            }
            return acc;
          },
          [] as RevenueData[]
        );

        setRevenueData(revenueByMonth.slice(-6));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back, {user?.full_name || 'Admin'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="text-emerald-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <ShoppingCart className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeSubscriptions.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-emerald-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Leads</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalLeads.toLocaleString()}</p>
            </div>
            <MessageSquare className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Projects</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalProjects.toLocaleString()}</p>
            </div>
            <Package className="text-blue-600" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => formatCurrency(value as number)} contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Lead Status Distribution</h2>
          {leadStatuses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadStatuses} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {leadStatuses.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No lead data available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No recent orders</div>
            ) : (
              <table className="w-full">
                <tbody className="divide-y divide-slate-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{order.project?.name || 'Project'}</p>
                          <p className="text-xs text-slate-500 mt-1">{order.id.slice(0, 8)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(order.amount_cents)}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(order.created_at)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Recent Signups</h2>
          </div>
          <div className="overflow-x-auto">
            {recentSignups.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No recent signups</div>
            ) : (
              <table className="w-full">
                <tbody className="divide-y divide-slate-200">
                  {recentSignups.map((profile) => (
                    <tr key={profile.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{profile.full_name}</p>
                          <p className="text-xs text-slate-500 mt-1">{profile.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs font-medium text-slate-600 capitalize">{profile.plan}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(profile.created_at)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
