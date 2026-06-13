import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order, OrderStatus, Profile } from '../../lib/types';
import { formatCurrency, formatDate, cn } from '../../lib/utils';

interface ExpandedOrder extends Order {
  user?: Profile;
}

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-slate-100 text-slate-800',
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<ExpandedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, project:projects(*), user:profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as ExpandedOrder[]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

      if (error) throw error;
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleRefund = async (orderId: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: 'refunded' }).eq('id', orderId);

      if (error) throw error;
      await loadOrders();
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(query) ||
      order.user?.email.toLowerCase().includes(query) ||
      order.user?.full_name?.toLowerCase().includes(query) ||
      order.project?.name.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses = Array.from(new Set(orders.map((o) => o.status))) as OrderStatus[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600 mt-1">Manage orders and payments</p>
        </div>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 bg-white"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No orders found</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="hover:bg-slate-50 transition">
                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Order {order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-slate-500 mt-1">{order.user?.full_name || 'Unknown'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-600">{order.project?.name || 'Project'}</p>
                        <p className="text-xs text-slate-500 mt-1">{order.user?.email}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(order.amount_cents)}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(order.created_at)}</p>
                      </div>

                      <div>
                        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', ORDER_STATUS_COLORS[order.status])}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {expandedId === order.id ? (
                    <ChevronUp className="text-slate-400 flex-shrink-0 ml-4" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400 flex-shrink-0 ml-4" size={20} />
                  )}
                </button>

                {expandedId === order.id && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Order Details</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-slate-600">Order ID</p>
                            <p className="text-slate-900 font-mono text-xs break-all">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Project</p>
                            <p className="text-slate-900">{order.project?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Amount</p>
                            <p className="text-slate-900 font-bold">{formatCurrency(order.amount_cents)}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Status</p>
                            <div className="mt-1">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                className={cn(
                                  'px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer',
                                  ORDER_STATUS_COLORS[order.status]
                                )}
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Customer Information</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-slate-600">Name</p>
                            <p className="text-slate-900">{order.user?.full_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Email</p>
                            <p className="text-slate-900 break-all">{order.user?.email || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Phone</p>
                            <p className="text-slate-900">{order.user?.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Plan</p>
                            <p className="text-slate-900 capitalize">{order.user?.plan || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      {order.status !== 'refunded' && (
                        <button
                          onClick={() => handleRefund(order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition font-medium text-sm"
                        >
                          <RotateCcw size={16} />
                          Process Refund
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
