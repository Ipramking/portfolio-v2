import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_BLOG } from '../../data/defaults';
import type { BlogPost } from '../../data/types';

export default function BlogTab() {
  const [posts, setPosts] = useLocalStorage(LS.blog, DEFAULT_BLOG);
  const [saved, setSaved] = useState('');
  const [collapsed, setCollapsed] = useState<Record<number,boolean>>({});

  const save = (id?: number) => { setPosts(posts); setSaved(id ? `post-${id}` : 'all'); setTimeout(()=>setSaved(''),2400); };
  const add  = () => {
    const id = posts.length ? Math.max(...posts.map(p=>p.id))+1 : 1;
    const today = new Date().toISOString().split('T')[0];
    setPosts([{id,title:'New Post',date:today,tags:[],content:'',published:false},...posts]);
  };
  const del  = (id:number) => { if(confirm('Delete this post?')) setPosts(posts.filter(p=>p.id!==id)); };
  const upd  = (id:number, k:keyof BlogPost, v:unknown) => setPosts(posts.map(p=>p.id===id?{...p,[k]:v}:p));

  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Devlog</h2><button className="adm-btn adm-btn-primary" onClick={add}>+ New Post</button></div>
      {posts.length===0 && <p style={{color:'var(--muted)',fontFamily:'JetBrains Mono,monospace',fontSize:'0.85rem',padding:'1.5rem 0'}}>No posts yet — click "+ New Post" to get started.</p>}
      {posts.map(p=>(
        <div key={p.id} className={`adm-block${collapsed[p.id]?' collapsed':''}`}>
          <div className="adm-block-header" onClick={()=>setCollapsed(c=>({...c,[p.id]:!c[p.id]}))}>
            <div className="adm-block-title">
              <span className="adm-block-chevron">▾</span>
              <span>{p.title||'Untitled'}</span>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.65rem',padding:'0.15rem 0.5rem',borderRadius:4,background:p.published?'rgba(99,102,241,0.12)':'var(--surface-2)',color:p.published?'var(--accent)':'var(--muted)',border:p.published?'1px solid rgba(99,102,241,0.25)':'1px solid var(--border)'}}>
                {p.published?'Live':'Draft'}
              </span>
            </div>
            <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}} onClick={e=>e.stopPropagation()}>
              <button className="adm-btn adm-btn-primary" style={{fontSize:'0.75rem',padding:'0.35rem 0.8rem'}} onClick={()=>save(p.id)}>Save</button>
              <button className="adm-btn adm-btn-danger" onClick={()=>del(p.id)}>✕</button>
            </div>
          </div>
          <div className="adm-block-body">
            <div className="adm-field-group"><label className="adm-label">Title</label><input className="adm-input" value={p.title} onChange={e=>upd(p.id,'title',e.target.value)} /></div>
            <div className="adm-field-group"><label className="adm-label">Date</label><input type="date" className="adm-input" value={p.date||''} onChange={e=>upd(p.id,'date',e.target.value)} /></div>
            <div className="adm-field-group full"><label className="adm-label">Tags (comma-separated)</label><input className="adm-input" value={(p.tags||[]).join(', ')} onChange={e=>upd(p.id,'tags',e.target.value.split(',').map((t:string)=>t.trim()).filter(Boolean))} /></div>
            <div className="adm-field-group full"><label className="adm-label">Content — **bold**, *italic*, `code`</label><textarea className="adm-input adm-textarea" style={{minHeight:200}} value={p.content||''} onChange={e=>upd(p.id,'content',e.target.value)} /></div>
            <div className="adm-field-group full" style={{flexDirection:'row',alignItems:'center',gap:'0.75rem'}}>
              <label className="adm-label" style={{margin:0}}>Published</label>
              <input type="checkbox" checked={!!p.published} onChange={e=>upd(p.id,'published',e.target.checked)} style={{width:18,height:18,accentColor:'var(--accent)',cursor:'pointer'}} />
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'0.72rem',color:'var(--muted)'}}>Toggle to make visible on site</span>
            </div>
          </div>
        </div>
      ))}
      {saved && <span className="adm-toast" style={{display:'block'}}>✓ {saved==='all'?'All saved':'Post saved'}</span>}
    </>
  );
}
