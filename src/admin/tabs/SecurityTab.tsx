import { useState } from 'react';
import { LS, DEFAULT_PROFILE, DEFAULT_SKILLS, DEFAULT_EXPERIENCE, DEFAULT_PROJECTS, DEFAULT_BUILDING, DEFAULT_BLOG, DEFAULT_TESTIMONIALS, DEFAULT_SOCIALS, DEFAULT_EMAILJS } from '../../data/defaults';
import { GH_TOKEN_KEY, GH_OWNER_KEY, GH_REPO_KEY } from '../publish';

async function sha256(str: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

export default function SecurityTab() {
  const [np, setNp] = useState('');
  const [cp, setCp] = useState('');
  const [msg, setMsg] = useState({text:'',err:false});

  const [ghToken, setGhToken] = useState(() => localStorage.getItem(GH_TOKEN_KEY) || '');
  const [ghOwner, setGhOwner] = useState(() => localStorage.getItem(GH_OWNER_KEY) || 'Ipramking');
  const [ghRepo,  setGhRepo]  = useState(() => localStorage.getItem(GH_REPO_KEY)  || 'portfolio-v2');
  const [ghSaved, setGhSaved] = useState(false);

  const saveGh = () => {
    localStorage.setItem(GH_TOKEN_KEY, ghToken.trim());
    localStorage.setItem(GH_OWNER_KEY, ghOwner.trim());
    localStorage.setItem(GH_REPO_KEY,  ghRepo.trim());
    setGhSaved(true);
    setTimeout(() => setGhSaved(false), 2400);
  };
  const toast = (text:string,err=false) => { setMsg({text,err}); setTimeout(()=>setMsg({text:'',err:false}),3000); };

  const changePass = async () => {
    if (!np)         return toast('Enter a new password.', true);
    if (np !== cp)   return toast('Passwords do not match.', true);
    if (np.length<6) return toast('Minimum 6 characters.', true);
    const h = await sha256(np);
    localStorage.setItem(LS.hash, h);
    setNp(''); setCp('');
    toast('Password updated!');
  };

  const exportData = () => {
    const keys = [LS.profile,LS.skills,LS.experience,LS.projects,LS.building,LS.blog,LS.testimonials,LS.socials,LS.emailjs];
    const data: Record<string,unknown> = {};
    keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k)||'null'); } catch {} });
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          Object.entries(data).forEach(([k,v]) => { if (v !== null) localStorage.setItem(k,JSON.stringify(v)); });
          toast('Data imported! Reload the site to see changes.');
        } catch { toast('Invalid file.', true); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetData = () => {
    if (!confirm('Reset ALL content to defaults? This cannot be undone.')) return;
    const defaults: Record<string,unknown> = {
      [LS.profile]:DEFAULT_PROFILE, [LS.skills]:DEFAULT_SKILLS,
      [LS.experience]:DEFAULT_EXPERIENCE, [LS.projects]:DEFAULT_PROJECTS,
      [LS.building]:DEFAULT_BUILDING, [LS.blog]:DEFAULT_BLOG,
      [LS.testimonials]:DEFAULT_TESTIMONIALS, [LS.socials]:DEFAULT_SOCIALS,
      [LS.emailjs]:DEFAULT_EMAILJS,
    };
    Object.entries(defaults).forEach(([k,v]) => localStorage.setItem(k,JSON.stringify(v)));
    toast('Reset to defaults. Reload the site.');
  };

  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Security</h2></div>

      <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'1rem',color:'var(--text-2)'}}>Change Password</h3>
      <div className="adm-grid" style={{marginBottom:'1.5rem'}}>
        <div className="adm-field-group full"><label className="adm-label">New Password</label><input type="password" className="adm-input" value={np} onChange={e=>setNp(e.target.value)} placeholder="Min 6 characters" /></div>
        <div className="adm-field-group full"><label className="adm-label">Confirm Password</label><input type="password" className="adm-input" value={cp} onChange={e=>setCp(e.target.value)} placeholder="Repeat new password" onKeyDown={e=>e.key==='Enter'&&changePass()} /></div>
      </div>
      <button className="adm-btn adm-btn-primary" onClick={changePass}>Update Password</button>
      {msg.text && <span className={`adm-toast${msg.err?' err':''}`} style={{display:'block',marginTop:'0.75rem'}}>{msg.text}</span>}

      <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'2.5rem 0'}} />

      <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'0.5rem',color:'var(--text-2)'}}>GitHub Publish Settings</h3>
      <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.73rem',color:'var(--muted)',marginBottom:'1.25rem',lineHeight:1.7}}>
        The "Publish" button at the top of every page uses these to push <code style={{background:'var(--surface-2)',padding:'0.1rem 0.4rem',borderRadius:4,fontSize:'0.72rem'}}>public/content.json</code> to GitHub, which triggers a Vercel redeploy so all visitors see your changes.<br/>
        Get a token at <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>github.com/settings/tokens</a> — needs <strong>repo</strong> scope.
      </p>
      <div className="adm-grid" style={{marginBottom:'1rem'}}>
        <div className="adm-field-group full">
          <label className="adm-label">GitHub Personal Access Token</label>
          <input className="adm-input" type="password" value={ghToken} onChange={e=>setGhToken(e.target.value)} placeholder="ghp_…" />
        </div>
        <div className="adm-field-group">
          <label className="adm-label">GitHub Username / Org</label>
          <input className="adm-input" value={ghOwner} onChange={e=>setGhOwner(e.target.value)} placeholder="Ipramking" />
        </div>
        <div className="adm-field-group">
          <label className="adm-label">Repository Name</label>
          <input className="adm-input" value={ghRepo} onChange={e=>setGhRepo(e.target.value)} placeholder="portfolio-v2" />
        </div>
      </div>
      <button className="adm-btn adm-btn-primary" onClick={saveGh}>Save GitHub Settings</button>
      {ghSaved && <span className="adm-toast" style={{display:'block',marginTop:'0.75rem'}}>✓ Saved</span>}

      <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'2.5rem 0'}} />
      <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'0.75rem',color:'var(--text-2)'}}>Data Management</h3>
      <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.75rem',color:'var(--muted)',marginBottom:'1.25rem'}}>Export a JSON backup of all content, or restore from a previous backup.</p>
      <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
        <button className="adm-btn adm-btn-outline" onClick={exportData}>↓ Export Backup</button>
        <button className="adm-btn adm-btn-outline" onClick={importData}>↑ Import Backup</button>
        <button className="adm-btn adm-btn-danger" style={{marginLeft:'auto'}} onClick={resetData}>Reset to Defaults</button>
      </div>
    </>
  );
}
