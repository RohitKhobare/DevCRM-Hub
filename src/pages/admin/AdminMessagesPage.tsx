import { useState, useEffect } from 'react';
import { Search, Send, Trash2, ChevronDown, Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ContactMessage, ContactStatus } from '../../lib/types';
import { formatDateTime, cn } from '../../lib/utils';

const STATUS_COLORS: Record<ContactStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-slate-100 text-slate-800',
  replied: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-100 text-slate-800',
};

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages((data as ContactMessage[]) || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;
      await loadMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendReply = async (messageId: string) => {
    if (!replyText.trim()) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          admin_reply: replyText,
          status: 'replied',
          replied_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;
      setReplyText('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', messageId);

      if (error) throw error;
      setSelectedId(null);
      await loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: ContactStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) throw error;
      await loadMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedMessage = messages.find((m) => m.id === selectedId);
  const statuses = Array.from(new Set(messages.map((m) => m.status))) as ContactStatus[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-600 mt-1">Manage contact form submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex gap-4 bg-white p-4 rounded-lg border border-slate-200 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ContactStatus | '')}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10 bg-white"
              >
                <option value="">All Status</option>
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
              <div className="p-8 text-center text-slate-500">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No messages found</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedId(msg.id);
                      if (msg.status === 'new') {
                        handleMarkAsRead(msg.id);
                      }
                    }}
                    className={cn(
                      'w-full px-6 py-4 text-left hover:bg-slate-50 transition border-l-4',
                      msg.status === 'new' ? 'border-blue-500 bg-blue-50' : 'border-slate-200',
                      selectedId === msg.id ? 'bg-blue-50' : ''
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900 truncate">{msg.name}</h3>
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap', STATUS_COLORS[msg.status])}>
                            {msg.status}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 truncate">{msg.message}</p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          {msg.email && (
                            <div className="flex items-center gap-1 truncate">
                              <Mail size={12} />
                              <span className="truncate">{msg.email}</span>
                            </div>
                          )}
                          {msg.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={12} />
                              <span>{msg.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{formatDateTime(msg.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {msg.status !== 'replied' && msg.status !== 'closed' && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedMessage.name}</h2>
                    <p className="text-sm text-slate-600 mt-1">{selectedMessage.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {selectedMessage.phone && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone size={14} />
                    {selectedMessage.phone}
                  </p>
                )}

                <div className="mt-4">
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as ContactStatus)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer',
                      STATUS_COLORS[selectedMessage.status]
                    )}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Message</h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="text-xs text-slate-500">
                  Received: {formatDateTime(selectedMessage.created_at)}
                </div>

                {selectedMessage.admin_reply && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Admin Reply</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                    {selectedMessage.replied_at && (
                      <p className="text-xs text-slate-500 mt-2">
                        Replied: {formatDateTime(selectedMessage.replied_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedMessage.status !== 'closed' && !selectedMessage.admin_reply && (
                <div className="p-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Send Reply</h3>
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleSendReply(selectedMessage.id)}
                    disabled={!replyText.trim()}
                    className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    <Send size={16} />
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-6 h-full flex items-center justify-center">
              <div className="text-center text-slate-500">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sm">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
