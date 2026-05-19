import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_PROJECTS } from '../../data/defaults';
import type { Project } from '../../data/types';

export default function ProjectsTab() {
  const [projects, setProjects] = useLocalStorage(LS.projects, DEFAULT_PROJECTS);
  const [saved, setSaved]   = useState(false);
  const [collapsed, setCollapsed] = useState<Record<number,boolean>>({});
  const [tagInp, setTagInp] = useState<Record<number,string>>({});
  const save = () => { setProjects(projects); setSaved(true); setTimeout(()=>setSaved(false),2400); };
  const upd  = (id:number, k:keyof Project, v:unknown) => setProjects(p => p.map(x => x.id===id ? {...x,[k]:v} : x));
  const del  = (id:number) => setProjects(p => p.filter(x => x.id!==id));
  const addTag = (id:number) => { const v=tagInp[id]?.trim(); if(!v)return; setProjects(p=>p.map(x=>x.id===id?{...x,tags:[...x.tags,v]}:x)); setTagInp(t=>({...t,[id]:''})); };
  const delTag = (id:number,ti:number) => setProjects(p=>p.map(x=>x.id===id?{...x,tags:x.tags.filter((_,j)=>j!==ti)}:x));
  const add = () => { const id=projects.length?Math.max(...projects.map(x=>x.id))+1:1; setProjects(p=>[...p,{id,title:'New Project',description:'',tags:[],github:'',live:'',featured:false}]); };
  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Projects</h2><div style={{display:'flex',gap:'0.5rem'}}><button className="adm-btn adm-btn-outline" onClick={add}>+ Add</button><button className="adm-btn adm-btn-primary" onClick={save}>Save</button></div></div>
      {projects.map(p => (
        <div key={p.id} className={`adm-block${collapsed[p.id]?' collapsed':''}`}>
          <div className="adm-block-header" onClick={()=>setCollapsed(c=>({...c,[p.id]:!c[p.id]}))}>
            <div className="adm-block-title">
              <span className="adm-block-chevron">▾</span>
              <span>{p.title}</span>
              {p.featured && <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.65rem',padding:'0.15rem 0.5rem',borderRadius:4,background:'rgba(99,102,241,0.12)',color:'var(--accent)',border:'1px solid rgba(99,102,241,0.25)'}}>Featured</span>}
            </div>
            <button className="adm-btn adm-btn-danger" onClick={ev=>{ev.stopPropagation();del(p.id);}}>✕</button>
          </div>
          <div className="adm-block-body">
            <div className="adm-field-group full"><label className="adm-label">Title</label><input className="adm-input" value={p.title} onChange={e=>upd(p.id,'title',e.target.value)} /></div>
            <div className="adm-field-group full"><label className="adm-label">Description</label><textarea className="adm-input adm-textarea" value={p.description} onChange={e=>upd(p.id,'description',e.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">GitHub URL</label><input className="adm-input" value={p.github} onChange={e=>upd(p.id,'github',e.target.value)} placeholder="https://github.com/…" /></div>
            <div className="adm-field-group"><label className="adm-label">Live URL → preview thumbnail</label><input className="adm-input" value={p.live} onChange={e=>upd(p.id,'live',e.target.value)} placeholder="https://…" /></div>
            <div className="adm-field-group" style={{flexDirection:'row',alignItems:'center',gap:'0.75rem'}}><label className="adm-label" style={{margin:0}}>Featured</label><input type="checkbox" checked={p.featured} onChange={e=>upd(p.id,'featured',e.target.checked)} style={{width:18,height:18,accentColor:'var(--accent)',cursor:'pointer'}} /></div>
            <div className="adm-field-group full">
              <label className="adm-label">Tech Tags</label>
              <div className="adm-tags-row">
                {p.tags.map((t,ti)=><span key={ti} className="adm-chip">{t}<button onClick={()=>delTag(p.id,ti)}>✕</button></span>)}
                <input className="adm-input" style={{maxWidth:130,padding:'0.35rem 0.7rem',fontSize:'0.82rem'}} placeholder="Add tag" value={tagInp[p.id]||''} onChange={e=>setTagInp(t=>({...t,[p.id]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addTag(p.id)} />
                <button className="adm-btn adm-btn-outline" style={{padding:'0.35rem 0.7rem'}} onClick={()=>addTag(p.id)}>+</button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {saved && <span className="adm-toast" style={{display:'block'}}>✓ Saved</span>}
    </>
  );
}
