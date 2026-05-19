import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_SOCIALS, DEFAULT_EMAILJS } from '../../data/defaults';

export default function ContactTab() {
  const [socials, setSocials] = useLocalStorage(LS.socials, DEFAULT_SOCIALS);
  const [ejs, setEjs]         = useLocalStorage(LS.emailjs, DEFAULT_EMAILJS);
  const [saved, setSaved]     = useState(false);
  const save = () => { setSocials(socials); setEjs(ejs); setSaved(true); setTimeout(()=>setSaved(false),2400); };
  const updS = (i:number,k:'name'|'url',v:string) => setSocials(s=>s.map((x,j)=>j===i?{...x,[k]:v}:x));
  const delS = (i:number) => setSocials(s=>s.filter((_,j)=>j!==i));
  const addS = () => setSocials(s=>[...s,{name:'',url:''}]);
  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Contact & Socials</h2><button className="adm-btn adm-btn-primary" onClick={save}>Save</button></div>

      <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'1rem',color:'var(--text-2)'}}>EmailJS Config</h3>
      <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.75rem',color:'var(--muted)',marginBottom:'1rem'}}>
        Get these from <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>emailjs.com</a> → Email Services / Email Templates / Account
      </p>
      <div className="adm-grid" style={{marginBottom:'2rem'}}>
        {(['serviceId','templateId','publicKey'] as const).map(k=>(
          <div key={k} className="adm-field-group">
            <label className="adm-label">{k}</label>
            <input className="adm-input" value={ejs[k]||''} onChange={e=>setEjs(prev=>({...prev,[k]:e.target.value}))} placeholder={`${k}…`} />
          </div>
        ))}
      </div>

      <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',marginBottom:'1rem',color:'var(--text-2)'}}>Social Links</h3>
      {socials.map((s,i)=>(
        <div key={i} className="adm-social-row">
          <input className="adm-input" placeholder="Name (e.g. GitHub)" value={s.name} onChange={e=>updS(i,'name',e.target.value)} />
          <input className="adm-input" placeholder="https://…" value={s.url} onChange={e=>updS(i,'url',e.target.value)} />
          <button className="adm-btn adm-btn-danger" onClick={()=>delS(i)}>✕</button>
        </div>
      ))}
      <button className="adm-btn adm-btn-outline" style={{marginTop:'0.5rem',fontFamily:'JetBrains Mono,monospace',fontSize:'0.8rem'}} onClick={addS}>+ Add Link</button>
      {saved && <span className="adm-toast" style={{display:'block',marginTop:'1rem'}}>✓ Saved</span>}
    </>
  );
}
