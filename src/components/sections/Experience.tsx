import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LS, DEFAULT_EXPERIENCE } from '../../data/defaults';

function formatDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m)-1] || ''} ${y}`;
}

export default function Experience() {
  const [exp] = useLocalStorage(LS.experience, DEFAULT_EXPERIENCE);
  const ref   = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" ref={ref} className="section">
      <div className="container">
        <motion.span initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ duration:0.5 }} className="section-label">
          My journey
        </motion.span>
        <motion.h2 initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6, delay:0.08 }} className="section-title">
          Experience <span className="gradient-text">&</span> Education
        </motion.h2>

        <div style={{ position:'relative', marginTop:'3.5rem' }}>
          {/* Timeline spine */}
          <motion.div
            initial={{ scaleY:0 }}
            animate={inView ? { scaleY:1 } : {}}
            transition={{ duration:1.2, delay:0.3, ease:[0.25,0.46,0.45,0.94] }}
            style={{
              position:'absolute', left:'50%', top:0, bottom:0,
              width:2, transformOrigin:'top',
              background:'linear-gradient(to bottom, var(--accent-dim), var(--accent2), transparent)',
              transform:'translateX(-50%)',
            }}
          />

          {exp.map((e, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity:0, x: isLeft ? -50 : 50 }}
                animate={inView ? { opacity:1, x:0 } : {}}
                transition={{ duration:0.7, delay:0.2 + i*0.15, ease:[0.25,0.46,0.45,0.94] }}
                style={{
                  display:'grid',
                  gridTemplateColumns:'1fr 60px 1fr',
                  gap:'0 1rem',
                  marginBottom:'3rem',
                  alignItems:'center',
                }}
              >
                {/* Left card */}
                {isLeft ? (
                  <div className="glass" style={{ padding:'1.5rem', borderRadius:16, gridColumn:1 }}>
                    <TimelineCard entry={e} />
                  </div>
                ) : <div />}

                {/* Center dot */}
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gridColumn:2 }}>
                  <motion.div
                    whileInView={{ scale:[0,1.2,1] }}
                    transition={{ duration:0.5, delay:0.3+i*0.15 }}
                    style={{
                      width:14, height:14, borderRadius:'50%',
                      background:'linear-gradient(135deg, var(--accent-dim), var(--accent2))',
                      boxShadow:'0 0 12px var(--accent-glow)',
                    }}
                  />
                </div>

                {/* Right card */}
                {!isLeft ? (
                  <div className="glass" style={{ padding:'1.5rem', borderRadius:16, gridColumn:3 }}>
                    <TimelineCard entry={e} />
                  </div>
                ) : <div />}
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #experience .container > div > div {
            grid-template-columns: 1fr !important;
          }
          #experience .container > div > div > div:first-child:empty,
          #experience .container > div > div > div:last-child:empty { display: none !important; }
          #experience .container > div > div > div[style*="grid-column: 2"] { display: none !important; }
          #experience .container > div > div > div.glass { grid-column: 1 !important; }
          #experience .container > div > div:before {
            content: '';
            display: block;
            width: 2px;
            background: var(--accent);
            position: absolute;
            left: 0;
            top: 0; bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}

function TimelineCard({ entry }: { entry: ReturnType<typeof useLocalStorage<typeof DEFAULT_EXPERIENCE>>[0][number] }) {
  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem', flexWrap:'wrap', gap:'0.25rem' }}>
        <div>
          <h3 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.05rem', marginBottom:'0.2rem' }}>{entry.role}</h3>
          <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.78rem', color:'var(--accent)' }}>
            {entry.company}{entry.location ? ` · ${entry.location}` : ''}
          </p>
        </div>
        <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.7rem', color:'var(--muted)', whiteSpace:'nowrap', marginTop:'0.25rem' }}>
          {entry.current ? `${formatDate(entry.start)} — Present` : `${formatDate(entry.start)} — ${formatDate(entry.end)}`}
        </span>
      </div>
      <p style={{ fontSize:'0.88rem', color:'var(--text-2)', lineHeight:1.7, marginBottom:'0.75rem' }}>{entry.description}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
        {entry.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </>
  );
}
