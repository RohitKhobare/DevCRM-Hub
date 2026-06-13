import { useState, useEffect } from 'react';
import { Plus, Trash2, X, ChevronDown, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Opportunity, OpportunityStage, OPPORTUNITY_STAGE_LABELS, OPPORTUNITY_STAGE_COLORS } from '../../lib/types';
import { formatCurrency, formatDate, cn } from '../../lib/utils';

interface OpportunityFormData {
  name: string;
  value_cents: number;
  stage: OpportunityStage;
  probability: number;
  expected_close_date: string;
  notes: string;
  lead_id: string | null;
}

export function OpportunitiesPage() {
  const { user } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [stageFilter, setStageFilter] = useState<OpportunityStage | ''>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<OpportunityFormData>({
    name: '',
    value_cents: 0,
    stage: 'qualification',
    probability: 50,
    expected_close_date: '',
    notes: '',
    lead_id: null,
  });

  const STAGES: OpportunityStage[] = ['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

  const loadOpportunities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      let query = supabase.from('opportunities').select('*').eq('user_id', user.id);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [user]);

  const handleAddOpportunity = async () => {
    if (!user || !formData.name) return;

    try {
      const { error } = await supabase.from('opportunities').insert([
        {
          ...formData,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
      setShowAddModal(false);
      setFormData({
        name: '',
        value_cents: 0,
        stage: 'qualification',
        probability: 50,
        expected_close_date: '',
        notes: '',
        lead_id: null,
      });
      await loadOpportunities();
    } catch (error) {
      console.error('Error adding opportunity:', error);
    }
  };

  const handleUpdateStage = async (opportunityId: string, newStage: OpportunityStage) => {
    try {
      const { error } = await supabase.from('opportunities').update({ stage: newStage }).eq('id', opportunityId);

      if (error) throw error;
      await loadOpportunities();
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    try {
      const { error } = await supabase.from('opportunities').delete().eq('id', opportunityId);

      if (error) throw error;
      setShowDeleteConfirm(null);
      await loadOpportunities();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };

  const filteredOpportunities = stageFilter
    ? opportunities.filter((opp) => opp.stage === stageFilter)
    : opportunities;

  const opportunitiesByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = filteredOpportunities.filter((opp) => opp.stage === stage);
      return acc;
    },
    {} as Record<OpportunityStage, Opportunity[]>
  );

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value_cents, 0);
  const weightedValue = opportunities.reduce(
    (sum, opp) => sum + Math.round((opp.value_cents * opp.probability) / 100),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Opportunities</h1>
          <p className="text-slate-600 mt-1">Track and manage sales opportunities through the pipeline</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Opportunity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Pipeline Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
            </div>
            <TrendingUp className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Weighted Value</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(weightedValue)}</p>
            </div>
            <TrendingUp className="text-emerald-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Opportunities</p>
              <p className="text-2xl font-bold text-slate-900">{opportunities.length}</p>
            </div>
            <TrendingUp className="text-slate-400" size={32} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition',
              viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition',
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            List
          </button>
        </div>

        <div className="flex-1 relative">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as OpportunityStage | '')}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ml-auto block"
          >
            <option value="">All Stages</option>
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {OPPORTUNITY_STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STAGES.map((stage) => (
            <div key={stage} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">{OPPORTUNITY_STAGE_LABELS[stage]}</h3>
                <span className="text-sm font-medium text-slate-600 bg-white px-2 py-1 rounded">
                  {opportunitiesByStage[stage].length}
                </span>
              </div>

              <div className="space-y-3">
                {opportunitiesByStage[stage].map((opp) => (
                  <div key={opp.id} className="bg-white p-3 rounded-lg border border-slate-200 hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate text-sm">{opp.name}</h4>
                        <p className="text-xs text-slate-600 mt-1">{formatCurrency(opp.value_cents)}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => setShowDeleteConfirm(opp.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-medium">{opp.probability}%</span>
                    </div>

                    {opp.expected_close_date && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                        <Calendar size={12} />
                        {formatDate(opp.expected_close_date)}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {stage !== 'closed_won' && stage !== 'closed_lost' && (
                        <select
                          value={stage}
                          onChange={(e) => handleUpdateStage(opp.id, e.target.value as OpportunityStage)}
                          className="text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              {OPPORTUNITY_STAGE_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading opportunities...</div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No opportunities found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Value</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Stage</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Probability</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Expected Close</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Weighted Value</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{opp.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(opp.value_cents)}</td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={opp.stage}
                          onChange={(e) => handleUpdateStage(opp.id, e.target.value as OpportunityStage)}
                          className={cn(
                            'px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer',
                            OPPORTUNITY_STAGE_COLORS[opp.stage]
                          )}
                        >
                          {STAGES.map((stage) => (
                            <option key={stage} value={stage}>
                              {OPPORTUNITY_STAGE_LABELS[stage]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{opp.probability}%</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {opp.expected_close_date ? formatDate(opp.expected_close_date) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">
                        {formatCurrency(Math.round((opp.value_cents * opp.probability) / 100))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setShowDeleteConfirm(opp.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Add Opportunity</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Value (₹) *</label>
                <input
                  type="number"
                  min="0"
                  value={Math.floor(formData.value_cents / 100)}
                  onChange={(e) => setFormData({ ...formData, value_cents: parseInt(e.target.value) * 100 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as OpportunityStage })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {OPPORTUNITY_STAGE_LABELS[stage]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Probability (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-slate-900 min-w-fit">{formData.probability}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Expected Close Date</label>
                <input
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOpportunity}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Delete Opportunity?</h2>
            <p className="text-slate-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOpportunity(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
