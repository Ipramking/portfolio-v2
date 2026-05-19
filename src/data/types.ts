export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio1: string;
  bio2: string;
  h1: string;
  h2: string;
  h3: string;
  email: string;
  githubUsername: string;
  resumeUrl: string;
}

export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillGroup {
  category: string;
  items: SkillItem[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  featured: boolean;
}

export interface ExperienceEntry {
  id: number;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  tags: string[];
}

export interface BuildingItem {
  show: boolean;
  title: string;
  description: string;
  status: string;
  tags: string[];
  link: string;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  tags: string[];
  content: string;
  published: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  avatar: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}
