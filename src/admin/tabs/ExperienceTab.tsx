import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_EXPERIENCE } from '../../data/defaults';
import type { ExperienceEntry } from '../../data/types';

export default function ExperienceTab() {
  const [exp, setExp] = useLocalStorage(LS.experience, DEFAULT_EXPERIENCE);
  const [saved, setSaved] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<number,boolean>>({});
  const [tagInp, setTagInp] = useState<Record<number,string>>({});
  const save = () => { setExp(exp); setSaved(true); setTimeout(()=>setSaved(false),2400); };
  const upd  = (id: number, k: keyof ExperienceEntry, v: unknown) => setExp(e => e.map(x => x.id===id ? {...x,[k]:v} : x));
  const del  = (id: number) => setExp(e => e.filter(x => x.id!==id));
  const addTag = (id: number) => {
    const v = tagInp[id]?.trim(); if (!v) return;
    setExp(e => e.map(x => x.id===id ? {...x,tags:[...x.tags,v]} : x));
    setTagInp(t => ({...t,[id]:''}));
  };
  const delTag = (id: number, ti: number) => setExp(e => e.map(x => x.id===id ? {...x,tags:x.tags.filter((_,j)=>j!==ti)} : x));
  const add = () => {
    const id = exp.length ? Math.max(...exp.map(x=>x.id))+1 : 1;
    setExp(e => [...e, {id,role:'New Role',company:'Company',location:'',start:'2024-01',end:'',current:true,description:'',tags:[]}]);
  };
  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Experience</h2><div style={{display:'flex',gap:'0.5rem'}}><button className="adm-btn adm-btn-outline" onClick={add}>+ Add Entry</button><button className="adm-btn adm-btn-primary" onClick={save}>Save</button></div></div>
      {exp.map(e => (
        <div key={e.id} className={`adm-block${collapsed[e.id]?' collapsed':''}`}>
          <div className="adm-block-header" onClick={()=>setCollapsed(c=>({...c,[e.id]:!c[e.id]}))}>
            <div className="adm-block-title">
              <span className="adm-block-chevron">▾</span>
              <span>{e.role} @ {e.company}</span>
              {e.current && <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.65rem',padding:'0.15rem 0.5rem',borderRadius:4,background:'rgba(74,222,128,0.1)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.2)'}}>Current</span>}
            </div>
            <button className="adm-btn adm-btn-danger" onClick={ev=>{ev.stopPropagation();del(e.id);}}>✕</button>
          </div>
          <div className="adm-block-body">
            <div className="adm-field-group"><label className="adm-label">Role</label><input className="adm-input" value={e.role} onChange={ev=>upd(e.id,'role',ev.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">Company</label><input className="adm-input" value={e.company} onChange={ev=>upd(e.id,'company',ev.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">Location</label><input className="adm-input" value={e.location} onChange={ev=>upd(e.id,'location',ev.target.value)} /></div>
            <div className="adm-field-group" style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'0.75rem'}}>
              <label className="adm-label" style={{margin:0}}>Currently here</label>
              <input type="checkbox" checked={e.current} onChange={ev=>upd(e.id,'current',ev.target.checked)} style={{width:18,height:18,accentColor:'var(--accent)',cursor:'pointer'}} />
            </div>
            <div className="adm-field-group"><label className="adm-label">Start (YYYY-MM)</label><input className="adm-input" value={e.start} onChange={ev=>upd(e.id,'start',ev.target.value)} placeholder="2024-01" /></div>
            {!e.current && <div className="adm-field-group"><label className="adm-label">End (YYYY-MM)</label><input className="adm-input" value={e.end} onChange={ev=>upd(e.id,'end',ev.target.value)} placeholder="2024-12" /></div>}
            <div className="adm-field-group full"><label className="adm-label">Description</label><textarea className="adm-input adm-textarea" value={e.description} onChange={ev=>upd(e.id,'description',ev.target.value)} /></div>
            <div className="adm-field-group full">
              <label className="adm-label">Tech Tags</label>
              <div className="adm-tags-row">
                {e.tags.map((t,ti)=><span key={ti} className="adm-chip">{t}<button onClick={()=>delTag(e.id,ti)}>✕</button></span>)}
                <input className="adm-input" style={{maxWidth:130,padding:'0.35rem 0.7rem',fontSize:'0.82rem'}} placeholder="Add tag" value={tagInp[e.id]||''} onChange={ev=>setTagInp(t=>({...t,[e.id]:ev.target.value}))} onKeyDown={ev=>ev.key==='Enter'&&addTag(e.id)} />
                <button className="adm-btn adm-btn-outline" style={{padding:'0.35rem 0.7rem',fontSize:'0.8rem'}} onClick={()=>addTag(e.id)}>+</button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {saved && <span className="adm-toast" style={{display:'block'}}>✓ Saved</span>}
    </>
  );
}
