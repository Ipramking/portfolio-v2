import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LS, DEFAULT_ADMIN_HASH } from '../data/defaults';
import { publishToGitHub } from './publish';
import '../styles/admin.css';
import ProfileTab     from './tabs/ProfileTab';
import SkillsTab      from './tabs/SkillsTab';
import ExperienceTab  from './tabs/ExperienceTab';
import ProjectsTab    from './tabs/ProjectsTab';
import BuildingTab    from './tabs/BuildingTab';
import BlogTab        from './tabs/BlogTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import ContactTab     from './tabs/ContactTab';
import SecurityTab    from './tabs/SecurityTab';

async function sha256(str: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

const TABS = [
  { id:'profile',      label:'Profile',      icon:'👤', component: ProfileTab     },
  { id:'skills',       label:'Skills',       icon:'⚡', component: SkillsTab      },
  { id:'experience',   label:'Experience',   icon:'💼', component: ExperienceTab  },
  { id:'projects',     label:'Projects',     icon:'🖥',  component: ProjectsTab    },
  { id:'building',     label:'Building',     icon:'🔧', component: BuildingTab    },
  { id:'blog',         label:'Blog',         icon:'✍',  component: BlogTab        },
  { id:'testimonials', label:'Testimonials', icon:'💬', component: TestimonialsTab},
  { id:'contact',      label:'Contact',      icon:'📬', component: ContactTab     },
  { id:'security',     label:'Security',     icon:'🔒', component: SecurityTab    },
];

function Login({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]   = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const hash   = await sha256(pw);
    const stored = localStorage.getItem(LS.hash) || DEFAULT_ADMIN_HASH;
    if (hash === stored) {
      onLogin();
    } else {
      setErr('Incorrect password.');
      setPw('');
      setTimeout(() => setErr(''), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="adm-login-screen">
      <motion.div className="adm-login-card"
        initial={{ scale:0.92, opacity:0, y:20 }}
        animate={{ scale:1, opacity:1, y:0 }}
        transition={{ type:'spring', damping:25, stiffness:280 }}>
        <motion.div className="adm-login-icon"
          initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ delay:0.15, type:'spring', damping:15 }}>⚙</motion.div>
        <h1 className="adm-login-title">Portfolio Admin</h1>
        <p className="adm-login-sub">Enter your password to continue</p>
        <form onSubmit={submit} className="adm-login-form">
          <input type="password" className="adm-field" placeholder="Password"
            value={pw} onChange={e => setPw(e.target.value)} autoFocus required />
          <AnimatePresence>
            {err && <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="adm-login-err">{err}</motion.p>}
          </AnimatePresence>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:'0.25rem' }}>
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminApp() {
  const [authed,    setAuthed]    = useState(() => sessionStorage.getItem(LS.session) === '1');
  const [tab,       setTab]       = useState('profile');
  const [publishing, setPublishing] = useState(false);
  const [pubStatus,  setPubStatus]  = useState<{ ok: boolean; msg: string } | null>(null);

  const login  = () => { sessionStorage.setItem(LS.session,'1'); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem(LS.session); setAuthed(false); };

  const handlePublish = async () => {
    setPublishing(true);
    setPubStatus(null);
    const result = await publishToGitHub();
    setPublishing(false);
    if (result.ok) {
      setPubStatus({ ok: true,  msg: '✓ Published! Vercel is deploying (~30s).' });
    } else {
      setPubStatus({ ok: false, msg: `✕ ${result.error}` });
    }
    setTimeout(() => setPubStatus(null), 6000);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme','dark');
    return () => {};
  }, []);

  if (!authed) return <Login onLogin={login} />;

  const ActiveTab = TABS.find(t => t.id === tab)?.component || ProfileTab;

  return (
    <div className="adm-shell">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-logo">Admin<span style={{ color:'var(--accent)' }}>.</span></div>
        <nav className="adm-nav">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`adm-nav-item${tab===t.id?' active':''}`}>
              <span className="adm-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-footer-link">
            <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Site
          </a>
          <button onClick={logout} className="adm-footer-link adm-logout">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="adm-main">
        {/* Publish bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.85rem 1.25rem', marginBottom: '1.5rem',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, gap: '1rem', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem' }}>
              Publish to Site
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--muted)' }}>
              Saves all changes to GitHub → auto-deploys to Vercel (~30s)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {pubStatus && (
              <motion.span
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
                  color: pubStatus.ok ? '#4ade80' : '#f87171',
                }}
              >
                {pubStatus.msg}
              </motion.span>
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handlePublish}
              disabled={publishing}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.25rem', borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent-dim), var(--accent2))',
                color: 'white', border: 'none', cursor: publishing ? 'not-allowed' : 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem',
                opacity: publishing ? 0.7 : 1,
                boxShadow: '0 0 20px rgba(99,102,241,0.3)',
              }}
            >
              {publishing ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'block', width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
                  />
                  Publishing…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
                  </svg>
                  Publish
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity:0, x:16 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-16 }}
            transition={{ duration:0.22 }}>
            <ActiveTab />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
