import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project, ProjectCategory } from '../lib/types';
import { CATEGORY_LABELS } from '../lib/types';

export function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'popular'>('newest');

  const categories: ProjectCategory[] = [
    'java',
    'spring_boot',
    'react',
    'ai',
    'erp',
    'crm',
    'mobile',
    'other',
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (data) setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let results = projects;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.short_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((project) => project.category === selectedCategory);
    }

    // Sort results
    switch (sortBy) {
      case 'price_low':
        results.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price_high':
        results.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case 'popular':
        results.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'newest':
      default:
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProjects(results);
  }, [projects, searchTerm, selectedCategory, sortBy]);

  const fallbackProjects: Project[] = [
    {
      id: '1',
      name: 'CRM Pro Suite',
      slug: 'crm-pro-suite',
      description: 'Enterprise CRM with AI-powered lead scoring and automation',
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
      features: ['Content Generation', 'SEO Optimization'],
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
      tech_stack: ['React Native', 'Node.js'],
      features: ['Inventory Management', 'Mobile Access'],
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
    {
      id: '4',
      name: 'Java Spring Boot Template',
      slug: 'java-spring-boot-template',
      description: 'Production-ready Spring Boot backend template',
      short_description: 'Complete Spring Boot starter project',
      category: 'spring_boot',
      tech_stack: ['Java', 'Spring Boot', 'PostgreSQL'],
      features: ['REST APIs', 'JWT Auth', 'Database'],
      price_cents: 19999,
      price_display: '₹19,999',
      license_type: 'standard',
      demo_url: null,
      download_url: 'https://example.com/download',
      screenshots: ['https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?w=800'],
      demo_video_url: null,
      is_featured: false,
      is_active: true,
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'React Dashboard Kit',
      slug: 'react-dashboard-kit',
      description: 'Beautiful React dashboard with charts and tables',
      short_description: 'Pre-built React components and dashboard',
      category: 'react',
      tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
      features: ['Components', 'Charts', 'Responsive'],
      price_cents: 14999,
      price_display: '₹14,999',
      license_type: 'standard',
      demo_url: 'https://example.com/demo',
      download_url: null,
      screenshots: ['https://images.pexels.com/photos/3194521/pexels-photo-3194521.jpeg?w=800'],
      demo_video_url: null,
      is_featured: false,
      is_active: true,
      sort_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Mobile App Starter',
      slug: 'mobile-app-starter',
      description: 'React Native starter template',
      short_description: 'Quick start for React Native apps',
      category: 'mobile',
      tech_stack: ['React Native', 'Expo'],
      features: ['Navigation', 'Auth', 'Offline'],
      price_cents: 9999,
      price_display: '₹9,999',
      license_type: 'standard',
      demo_url: null,
      download_url: 'https://example.com/download',
      screenshots: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?w=800'],
      demo_video_url: null,
      is_featured: false,
      is_active: true,
      sort_order: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const displayProjects = projects.length > 0 ? filteredProjects : fallbackProjects.filter(p => {
    let matches = true;
    if (searchTerm) {
      matches = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedCategory) {
      matches = matches && p.category === selectedCategory;
    }
    return matches;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Project Marketplace
          </h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 placeholder-slate-500"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 font-medium appearance-none pr-10 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{displayProjects.length}</span> projects
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-200 hover:border-blue-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-slate-200 h-48">
                    {project.screenshots[0] ? (
                      <img
                        src={project.screenshots[0]}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    {project.is_featured && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex-1">
                        {project.name}
                      </h3>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                        {CATEGORY_LABELS[project.category]}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 h-10">
                      {project.short_description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="font-semibold text-slate-900 text-lg">
                        {project.price_display}
                      </span>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:gap-1 transition-all">
                        View Details
                        <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-slate-100 p-4">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Projects Found
              </h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Loading State Skeleton */}
      {loading && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-slate-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                    </div>
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
