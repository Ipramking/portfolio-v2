import { lsGet } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_PROFILE } from '../../data/defaults';

export default function Footer() {
  const profile = lsGet(LS.profile, DEFAULT_PROFILE);
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: '2rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--muted)' }}>
          © {new Date().getFullYear()} {profile.name || 'Your Name'}. Designed & built with React + Vite.
        </p>
        <a href="#hero" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--muted)', transition: 'color 0.2s' }}
           onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
           onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
