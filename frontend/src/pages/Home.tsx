import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../api/projects";
import type { Project } from "../types/project";
import ProjectCard from "../components/ProjectCard";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import { siteConfig } from "../config/site";

export default function Home() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects({ featured: true })
      .then(setFeatured)
      .catch(() => setError("Couldn't load featured projects. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12">
      <section className="flex flex-col-reverse items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{siteConfig.role}</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">{siteConfig.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{siteConfig.tagline}</p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/projects"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View all projects
            </Link>
            <Link
              to="/about"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              About me
            </Link>
          </div>
        </div>
        {siteConfig.photoUrl && (
          <img
            src={siteConfig.photoUrl}
            alt={siteConfig.name}
            className="h-36 w-36 shrink-0 rounded-full object-cover ring-4 ring-slate-100 sm:h-44 sm:w-44 dark:ring-slate-800"
          />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Featured projects</h2>
        {loading && <p className="text-slate-500 dark:text-slate-400">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && featured.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400">
            No featured projects yet — mark a project as "Featured" in the admin panel to have it show up here.
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <SkillsSection />
      <ContactSection />
    </div>
  );
}
