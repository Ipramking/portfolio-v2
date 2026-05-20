import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { LS } from './data/defaults';

const PUBLISHED_TS_KEY = 'pf_published_ts';

async function seedFromPublished() {
  try {
    const res = await fetch('/content.json', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const remoteTs: number = data._timestamp ?? 0;
    const localTs  = parseInt(localStorage.getItem(PUBLISHED_TS_KEY) ?? '0', 10);

    // Only overwrite localStorage if published content is newer
    if (remoteTs > localTs) {
      const { _timestamp, ...content } = data as Record<string, unknown>;
      Object.entries(content).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          localStorage.setItem(k, JSON.stringify(v));
        }
      });
      localStorage.setItem(PUBLISHED_TS_KEY, String(remoteTs));
    }
  } catch {
    // Network error or JSON parse error — silently continue using localStorage
  }
}
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import CustomCursor  from './components/layout/CustomCursor';
import ScrollProgress from './components/layout/ScrollProgress';
import Hero          from './components/sections/Hero';
import About         from './components/sections/About';
import Skills        from './components/sections/Skills';
import Experience    from './components/sections/Experience';
import Projects      from './components/sections/Projects';
import Building      from './components/sections/Building';
import Blog          from './components/sections/Blog';
import Testimonials  from './components/sections/Testimonials';
import GitHubStats   from './components/sections/GitHubStats';
import Contact       from './components/sections/Contact';
import './styles/globals.css';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Seed localStorage from published content.json on every load
    seedFromPublished().then(() => {
      document.title = `Portfolio | ${JSON.parse(localStorage.getItem(LS.profile) || '{}')?.name || 'Developer'}`;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Building />
        <Blog />
        <Testimonials />
        <GitHubStats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
