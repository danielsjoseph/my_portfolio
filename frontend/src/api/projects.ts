import type { Project, Tag } from "../types/project";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface ProjectFilters {
  tag?: string;
  featured?: boolean;
}

function buildQuery(filters: ProjectFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.featured !== undefined) params.set("featured", String(filters.featured));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  return request<Project[]>(`/projects/${buildQuery(filters)}`);
}

export function fetchProject(slug: string): Promise<Project> {
  return request<Project>(`/projects/${slug}/`);
}

export function fetchTags(): Promise<Tag[]> {
  return request<Tag[]>("/tags/");
}

export interface Profile {
  resume_url: string | null;
  updated_at: string;
}

export function fetchProfile(): Promise<Profile> {
  return request<Profile>("/profile/");
}
