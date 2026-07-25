import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProjects, fetchTags } from "../api/projects";
import type { Project, Tag } from "../types/project";
import ProjectCard from "../components/ProjectCard";
import TagFilter from "../components/TagFilter";

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");

  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags().then(setTags).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProjects({ tag: selectedTag ?? undefined })
      .then(setProjects)
      .catch(() => setError("Couldn't load projects. Is the API running?"))
      .finally(() => setLoading(false));
  }, [selectedTag]);

  const handleSelectTag = (tag: string | null) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Projects</h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Everything below is pulled live from the project database.
      </p>

      <div className="mb-8">
        <TagFilter tags={tags} selected={selectedTag} onSelect={handleSelectTag} />
      </div>

      {loading && <p className="text-slate-500 dark:text-slate-400">Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">No projects found.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
