import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchProject } from "../api/projects";
import type { Project } from "../types/project";
import WakingDatabase from "../components/WakingDatabase";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProject(slug)
      .then((p) => {
        setProject(p);
        document.title = `${p.title} — Portfolio`;
      })
      .catch(() => setError("Project not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <WakingDatabase />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-red-500">{error ?? "Project not found."}</p>
        <Link to="/projects" className="mt-4 inline-block text-sm underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/projects" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
        ← Back to projects
      </Link>

      {project.thumbnail_url && (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="mt-4 max-h-96 w-full rounded-lg object-cover"
        />
      )}

      <h1 className="mt-6 text-3xl font-bold">{project.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{project.short_description}</p>

      {project.tech_stack && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.split(",").map((t) => t.trim()).filter(Boolean).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            View code
          </a>
        )}
        {project.live_demo_url && (
          <a
            href={project.live_demo_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Live demo
          </a>
        )}
      </div>

      {project.long_description && (
        <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
          <ReactMarkdown>{project.long_description}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
