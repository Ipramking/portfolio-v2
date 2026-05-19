import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_PROFILE } from '../../data/defaults';

export default function ProfileTab() {
  const [p, setP] = useLocalStorage(LS.profile, DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const upd = (k: keyof typeof DEFAULT_PROFILE, v: string) => setP(prev => ({ ...prev, [k]: v }));
  const save = () => { setP(p); setSaved(true); setTimeout(() => setSaved(false), 2400); };

  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Profile</h2><button className="adm-btn adm-btn-primary" onClick={save}>Save Changes</button></div>
      <div className="adm-grid">
        {([
          ['name',    'Display Name',   'Your Name',             false],
          ['role',    'Role / Title',   'Full-Stack Developer',  false],
          ['tagline', 'Tagline',        'I build things…',       false, true],
          ['bio1',    'Bio (para 1)',   '',                      true,  true],
          ['bio2',    'Bio (para 2)',   '',                      true,  true],
          ['h1',      'Highlight 1',   'University / Bootcamp', false],
          ['h2',      'Highlight 2',   'Current role',          false],
          ['h3',      'Highlight 3',   'Open to opportunities', false],
          ['email',   'Email',         'your@email.com',        false],
          ['githubUsername','GitHub Username','Ipramking',      false],
          ['resumeUrl','Resume URL',   'https://…',             false, true],
        ] as [keyof typeof DEFAULT_PROFILE, string, string, boolean, boolean?][]).map(([key, label, ph, isTA, full]) => (
          <div key={key} className={`adm-field-group${full ? ' full' : ''}`}>
            <label className="adm-label">{label}</label>
            {isTA
              ? <textarea className="adm-input adm-textarea" value={(p as any)[key]||''} onChange={e => upd(key, e.target.value)} />
              : <input    className="adm-input" placeholder={ph} value={(p as any)[key]||''} onChange={e => upd(key, e.target.value)} />}
          </div>
        ))}
      </div>
      {saved && <span className="adm-toast">✓ Saved</span>}
    </>
  );
}
