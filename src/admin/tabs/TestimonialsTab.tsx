import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_TESTIMONIALS } from '../../data/defaults';
import type { Testimonial } from '../../data/types';

export default function TestimonialsTab() {
  const [items, setItems] = useLocalStorage(LS.testimonials, DEFAULT_TESTIMONIALS);
  const [saved, setSaved] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<number,boolean>>({});
  const save = () => { setItems(items); setSaved(true); setTimeout(()=>setSaved(false),2400); };
  const upd  = (id:number, k:keyof Testimonial, v:string) => setItems(i=>i.map(x=>x.id===id?{...x,[k]:v}:x));
  const del  = (id:number) => setItems(i=>i.filter(x=>x.id!==id));
  const add  = () => { const id=items.length?Math.max(...items.map(x=>x.id))+1:1; setItems(i=>[...i,{id,name:'New Person',role:'',company:'',text:'',avatar:''}]); };
  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Testimonials</h2><div style={{display:'flex',gap:'0.5rem'}}><button className="adm-btn adm-btn-outline" onClick={add}>+ Add</button><button className="adm-btn adm-btn-primary" onClick={save}>Save</button></div></div>
      {items.map(t=>(
        <div key={t.id} className={`adm-block${collapsed[t.id]?' collapsed':''}`}>
          <div className="adm-block-header" onClick={()=>setCollapsed(c=>({...c,[t.id]:!c[t.id]}))}>
            <div className="adm-block-title"><span className="adm-block-chevron">▾</span><span>{t.name} · {t.role}</span></div>
            <button className="adm-btn adm-btn-danger" onClick={e=>{e.stopPropagation();del(t.id);}}>✕</button>
          </div>
          <div className="adm-block-body">
            <div className="adm-field-group"><label className="adm-label">Name</label><input className="adm-input" value={t.name} onChange={e=>upd(t.id,'name',e.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">Role</label><input className="adm-input" value={t.role} onChange={e=>upd(t.id,'role',e.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">Company</label><input className="adm-input" value={t.company} onChange={e=>upd(t.id,'company',e.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">Avatar URL (optional)</label><input className="adm-input" value={t.avatar} onChange={e=>upd(t.id,'avatar',e.target.value)} placeholder="https://…" /></div>
            <div className="adm-field-group full"><label className="adm-label">Quote</label><textarea className="adm-input adm-textarea" value={t.text} onChange={e=>upd(t.id,'text',e.target.value)} placeholder="What they said about you…" /></div>
          </div>
        </div>
      ))}
      {saved && <span className="adm-toast" style={{display:'block'}}>✓ Saved</span>}
    </>
  );
}
