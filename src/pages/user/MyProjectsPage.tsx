import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Project, UserProjectAccess } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { Download, FolderOpen, Calendar, Download as DownloadIcon, ExternalLink, Code2 } from 'lucide-react';

interface ProjectWithAccess extends UserProjectAccess {
  project: Project | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProjectAccess(data: any[]): ProjectWithAccess[] {
  return (data || []).map((item: any) => {
    const { projects, ...rest } = item;
    return { ...rest, project: Array.isArray(projects) ? projects[0] : projects };
  });
}

export function MyProjectsPage() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<ProjectWithAccess[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchUserProjects();
  }, [user]);

  const fetchUserProjects = async () => {
    if (!user) return;
    setDataLoading(true);

    try {
      const { data } = await supabase
        .from('user_project_access')
        .select(
          `
          id,
          user_id,
          project_id,
          order_id,
          download_count,
          last_downloaded_at,
          created_at,
          projects:project_id (
            id,
            name,
            slug,
            description,
            short_description,
            category,
            tech_stack,
            price_display,
            download_url,
            screenshots,
            is_featured
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setProjects(mapProjectAccess(data || []));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDownload = async (projectAccess: ProjectWithAccess) => {
    if (!projectAccess.project?.download_url) {
      setDownloadError('Download URL not available');
      setTimeout(() => setDownloadError(null), 3000);
      return;
    }

    setDownloading(projectAccess.id);
    setDownloadError(null);
    setDownloadSuccess(null);

    try {
      // Update download count and last_downloaded_at
      const { error } = await supabase
        .from('user_project_access')
        .update({
          download_count: (projectAccess.download_count || 0) + 1,
          last_downloaded_at: new Date().toISOString(),
        })
        .eq('id', projectAccess.id);

      if (error) throw error;

      // Trigger download
      const link = document.createElement('a');
      link.href = projectAccess.project.download_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(`${projectAccess.project.name} download started!`);
      setTimeout(() => setDownloadSuccess(null), 3000);

      // Refresh projects to show updated count
      await fetchUserProjects();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download project';
      setDownloadError(message);
      setTimeout(() => setDownloadError(null), 3000);
    } finally {
      setDownloading(null);
    }
  };

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
            <FolderOpen className="text-blue-600" size={32} />
            My Projects
          </h1>
          <p className="text-slate-600 mt-2">
            {projects.length} project{projects.length !== 1 ? 's' : ''} purchased
          </p>
        </div>

        {/* Alerts */}
        {downloadError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-red-800">{downloadError}</p>
          </div>
        )}

        {downloadSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-emerald-800">{downloadSuccess}</p>
          </div>
        )}

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-slate-200 p-12 text-center">
            <FolderOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h3>
            <p className="text-slate-600 mb-6">
              You haven't purchased any projects yet. Browse our marketplace to find amazing code solutions.
            </p>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition">
              <Code2 size={18} />
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((projectAccess) => {
              const project = projectAccess.project;
              if (!project) return null;

              return (
                <div key={projectAccess.id} className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden hover:shadow-lg transition group">
                  {/* Project Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                    {project.screenshots && project.screenshots.length > 0 ? (
                      <img
                        src={project.screenshots[0]}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Code2 size={48} className="text-blue-300 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {project.short_description || project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {project.tech_stack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="inline-block text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="inline-block text-xs text-slate-600">+{project.tech_stack.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Purchase and Download Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} />
                        <span>Purchased: {formatDate(projectAccess.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <DownloadIcon size={16} />
                        <span>Downloads: {projectAccess.download_count || 0}</span>
                      </div>
                      {projectAccess.last_downloaded_at && (
                        <div className="flex items-center gap-2 text-slate-600 text-xs">
                          <span>Last: {formatDate(projectAccess.last_downloaded_at)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 border-t border-slate-200 pt-4">
                      <button
                        onClick={() => handleDownload(projectAccess)}
                        disabled={downloading === projectAccess.id}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download size={18} />
                        {downloading === projectAccess.id ? 'Downloading...' : 'Download'}
                      </button>
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition"
                        >
                          <ExternalLink size={18} />
                          View Demo
                        </a>
                      )}
                    </div>

                    {/* Price Info */}
                    <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                      <p className="text-xs text-slate-600 mb-1">Price at Purchase</p>
                      <p className="text-lg font-bold text-slate-900">{project.price_display}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
