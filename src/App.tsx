import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { LS } from './data/defaults';
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
    document.documentElement.setAttribute('data-theme', theme);
    document.title = `Portfolio | ${JSON.parse(localStorage.getItem(LS.profile) || '{}')?.name || 'Developer'}`;
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
