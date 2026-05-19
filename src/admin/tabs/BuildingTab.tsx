import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_BUILDING } from '../../data/defaults';

const STATUSES = ['In Progress','Shipping Soon','Planning','On Hold','Shipped ✓'];

export default function BuildingTab() {
  const [d, setD] = useLocalStorage(LS.building, DEFAULT_BUILDING);
  const [saved, setSaved] = useState(false);
  const upd  = (k: keyof typeof DEFAULT_BUILDING, v: unknown) => setD(prev => ({...prev,[k]:v}));
  const save = () => { setD(d); setSaved(true); setTimeout(()=>setSaved(false),2400); };
  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Currently Building</h2><button className="adm-btn adm-btn-primary" onClick={save}>Save</button></div>
      <div className="adm-grid">
        <div className="adm-field-group full" style={{flexDirection:'row',alignItems:'center',gap:'0.75rem'}}>
          <label className="adm-label" style={{margin:0}}>Show on site</label>
          <input type="checkbox" checked={d.show!==false} onChange={e=>upd('show',e.target.checked)} style={{width:18,height:18,accentColor:'var(--accent)',cursor:'pointer'}} />
        </div>
        <div className="adm-field-group"><label className="adm-label">Project Title</label><input className="adm-input" value={d.title||''} onChange={e=>upd('title',e.target.value)} placeholder="What are you building?" /></div>
        <div className="adm-field-group"><label className="adm-label">Status</label>
          <select className="adm-input" value={d.status||'In Progress'} onChange={e=>upd('status',e.target.value)}>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="adm-field-group full"><label className="adm-label">Description</label><textarea className="adm-input adm-textarea" value={d.description||''} onChange={e=>upd('description',e.target.value)} /></div>
        <div className="adm-field-group full"><label className="adm-label">Tags (comma-separated)</label><input className="adm-input" value={(d.tags||[]).join(', ')} onChange={e=>upd('tags',e.target.value.split(',').map((t:string)=>t.trim()).filter(Boolean))} /></div>
        <div className="adm-field-group full"><label className="adm-label">Repo / Link (optional)</label><input className="adm-input" type="url" value={d.link||''} onChange={e=>upd('link',e.target.value)} /></div>
      </div>
      {saved && <span className="adm-toast">✓ Saved</span>}
    </>
  );
}
