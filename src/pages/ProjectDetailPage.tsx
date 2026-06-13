import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ExternalLink,
  Download,
  Share2,
  Check,
  ShoppingCart,
  Zap,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/types';
import { CATEGORY_LABELS } from '../lib/types';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (data) {
          setProject(data);

          // Fetch related projects
          const { data: related } = await supabase
            .from('projects')
            .select('*')
            .eq('category', data.category)
            .eq('is_active', true)
            .neq('id', data.id)
            .limit(3);

          if (related) setRelatedProjects(related);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }

    if (!project) return;

    setPurchasing(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            project_id: project.id,
            amount_cents: project.price_cents,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Record access
      if (order) {
        await supabase.from('user_project_access').insert([
          {
            user_id: user.id,
            project_id: project.id,
            order_id: order.id,
          },
        ]);
      }

      setPurchaseSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/purchases');
      }, 2000);
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Failed to process purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-48"></div>
            <div className="h-96 bg-slate-200 rounded-xl"></div>
            <div className="space-y-3">
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
          <div className="bg-white rounded-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
            <p className="text-slate-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/marketplace"
              className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Category */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {CATEGORY_LABELS[project.category]}
                  </span>
                  {project.is_featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  {project.name}
                </h1>
                <p className="text-xl text-slate-600">
                  {project.short_description}
                </p>
              </div>

              {/* Gallery */}
              <div className="mb-8">
                <div className="mb-4 bg-white rounded-xl overflow-hidden border border-slate-200">
                  {project.screenshots[selectedScreenshot] ? (
                    <img
                      src={project.screenshots[selectedScreenshot]}
                      alt={`${project.name} screenshot ${selectedScreenshot + 1}`}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 bg-slate-100 flex items-center justify-center">
                      <Package className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                </div>

                {project.screenshots.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {project.screenshots.map((screenshot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedScreenshot(i)}
                        className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedScreenshot === i
                            ? 'border-blue-600'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={screenshot}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Project</h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Features */}
                {project.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {project.tech_stack.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Video */}
              {project.demo_video_url && (
                <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Demo Video</h2>
                  <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={project.demo_video_url}
                      title="Demo Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Pricing Card */}
              <div className="bg-white rounded-xl p-8 border border-slate-200 sticky top-20 mb-8">
                {purchaseSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                    <Check className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                      Purchase Successful!
                    </h3>
                    <p className="text-emerald-800 text-sm">
                      Redirecting to your downloads...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-600 text-sm mb-2">Price</p>
                    <p className="text-4xl font-bold text-slate-900 mb-6">
                      {project.price_display}
                    </p>

                    {project.license_type && (
                      <div className="mb-6 p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-600 font-semibold mb-1">License Type</p>
                        <p className="text-slate-900 font-medium capitalize">
                          {project.license_type}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 mb-6">
                      {user ? (
                        <button
                          onClick={handlePurchase}
                          disabled={purchasing}
                          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {purchasing ? 'Processing...' : 'Buy Now'}
                        </button>
                      ) : (
                        <Link
                          to="/auth/signin"
                          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-center"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Sign In to Buy
                        </Link>
                      )}

                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-5 w-5" />
                          View Demo
                        </a>
                      )}

                      {project.download_url && (
                        <a
                          href={project.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="h-5 w-5" />
                          Download Free
                        </a>
                      )}
                    </div>

                    {/* Share */}
                    <button className="w-full py-3 px-4 border border-slate-300 text-slate-900 font-semibold rounded-lg hover:border-slate-400 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </>
                )}
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold">License</p>
                      <p className="text-slate-900 font-medium capitalize">
                        {project.license_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold">Category</p>
                      <p className="text-slate-900 font-medium">
                        {CATEGORY_LABELS[project.category]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/project/${p.slug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-200"
                  >
                    {p.screenshots[0] && (
                      <img
                        src={p.screenshots[0]}
                        alt={p.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{p.short_description}</p>
                      <p className="font-semibold text-slate-900 mt-3">{p.price_display}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
