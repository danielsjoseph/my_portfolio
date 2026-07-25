export interface Tag {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  tech_stack: string;
  tags: Tag[];
  github_url: string;
  live_demo_url: string;
  thumbnail_url: string;
  featured: boolean;
  date_completed: string | null;
  order: number;
  views: number;
  created_at: string;
  updated_at: string;
}
