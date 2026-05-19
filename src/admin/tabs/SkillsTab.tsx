import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_SKILLS } from '../../data/defaults';

export default function SkillsTab() {
  const [skills, setSkills] = useLocalStorage(LS.skills, DEFAULT_SKILLS);
  const [saved, setSaved]   = useState(false);
  const [inp, setInp]       = useState<Record<string,string>>({});
  const save = () => { setSkills(skills); setSaved(true); setTimeout(() => setSaved(false), 2400); };
  const updCat = (gi: number, v: string) => setSkills(s => s.map((g,i) => i===gi ? {...g,category:v} : g));
  const delGrp = (gi: number) => setSkills(s => s.filter((_,i) => i!==gi));
  const delSkl = (gi: number, ii: number) => setSkills(s => s.map((g,i) => i===gi ? {...g,items:g.items.filter((_,j)=>j!==ii)} : g));
  const addSkl = (gi: number) => {
    const n = inp[`n${gi}`]?.trim(); const ic = inp[`i${gi}`]?.trim();
    if (!n) return;
    setSkills(s => s.map((g,i) => i===gi ? {...g,items:[...g.items,{name:n,icon:ic||'devicon-devicon-plain'}]} : g));
    setInp(p => ({...p,[`n${gi}`]:'',[`i${gi}`]:''}));
  };
  return (
    <>
      <div className="adm-header"><h2 className="adm-title">Skills</h2><button className="adm-btn adm-btn-primary" onClick={save}>Save</button></div>
      {skills.map((g,gi) => (
        <div key={gi} className="adm-block">
          <div className="adm-block-header">
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flex:1}}>
              <input className="adm-input" style={{maxWidth:200}} value={g.category} onChange={e=>updCat(gi,e.target.value)} placeholder="Category" />
            </div>
            <button className="adm-btn adm-btn-danger" onClick={()=>delGrp(gi)}>✕ Remove</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',margin:'0.85rem 0'}}>
            {g.items.map((item,ii)=>(
              <span key={ii} className="adm-skill-item">{item.name}<button onClick={()=>delSkl(gi,ii)}>✕</button></span>
            ))}
          </div>
          <div className="adm-add-row">
            <input className="adm-input" placeholder="Skill name" value={inp[`n${gi}`]||''} onChange={e=>setInp(p=>({...p,[`n${gi}`]:e.target.value}))} />
            <input className="adm-input" placeholder="devicon-react-original colored" style={{flex:2}} value={inp[`i${gi}`]||''} onChange={e=>setInp(p=>({...p,[`i${gi}`]:e.target.value}))} />
            <button className="adm-btn adm-btn-outline" onClick={()=>addSkl(gi)}>+</button>
          </div>
        </div>
      ))}
      <button className="adm-btn adm-btn-outline" style={{marginTop:'0.5rem',fontFamily:'JetBrains Mono,monospace',fontSize:'0.8rem'}} onClick={()=>setSkills(s=>[...s,{category:'New Category',items:[]}])}>+ Add Category</button>
      {saved && <span className="adm-toast" style={{display:'block'}}>✓ Saved</span>}
    </>
  );
}
