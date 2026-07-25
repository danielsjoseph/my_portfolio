import { Link } from "react-router-dom";
import type { Project } from "../types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700"
    >
      {project.thumbnail_url ? (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-900">
          No preview
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold group-hover:underline">{project.title}</h3>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
          {project.short_description}
        </p>
        {project.tech_stack && (
          <p className="mt-auto pt-2 text-xs text-slate-400 dark:text-slate-500">
            {project.tech_stack}
          </p>
        )}
      </div>
    </Link>
  );
}
