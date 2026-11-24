import React,{useState,useEffect,useRef} from 'react'
import {MODULES,SUBJECTS} from './curriculum.js'
import {SITE,PROJECTS,SEASONS} from './site.js'
const KEY='nourish-curiosity-v1'
const SECS=[['ctx','Core / Context'],['evd','Supporting Evidence'],['app','Application'],['inq','Prompt / Inquiry'],['act','Activity'],['mk','Assignment / Create']]
const SUB=[['season','Season'],['work','Worksheets'],['field','Fieldwork'],['mastery','Mastery'],['portfolio','Portfolio']]
const blank={notes:{},rating:{},season:0,active:0}
const load=()=>{try{return {...blank,...JSON.parse(localStorage.getItem(KEY))}}catch{return blank}}
const done=(st,i)=>SECS.filter(([k])=>(st.notes[i+'.'+k]||'').trim().length>20).length
const pct=(st,i)=>Math.round(done(st,i)/6*100)
const sOf=x=>SEASONS.findIndex(s=>s.subject===x.s)
const idsOf=s=>MODULES.map((x,i)=>x.s===SEASONS[s]?.subject?i:-1).filter(i=>i>=0)
export default function App(){
 const [st,setSt]=useState(load),[page,setPage]=useState('about'),[sub,setSub]=useState('season'),file=useRef()
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch{}},[st])
 const set=p=>setSt(s=>({...s,...p}))
 const note=(k,v)=>setSt(s=>({...s,notes:{...s.notes,[k]:v}}))
 const cur=Math.min(st.season,SEASONS.length-1)
 const avail=MODULES.map((x,i)=>sOf(x)>=0&&sOf(x)<=cur?i:-1).filter(i=>i>=0)
 const go=(p)=>{setPage(p);window.scrollTo(0,0)}
 const openMod=i=>{set({active:i});setSub('work');window.scrollTo(0,0)}
 const backup=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(st,null,2)],{type:'application/json'}));a.download='nourish-curiosity-backup.json';a.click()}
 const restore=e=>{const f=e.target.files[0];if(f)f.text().then(t=>{try{setSt({...blank,...JSON.parse(t)});alert('Restored.')}catch{alert('Invalid backup file.')}})}
 const m=MODULES[avail.includes(st.active)?st.active:avail[0]],mi=MODULES.indexOf(m)
 const ModRow=({i})=><button className="row" onClick={()=>openMod(i)}><span>{MODULES[i].t}</span><b>{pct(st,i)}%</b></button>
 return <div className="app">
  <header><button className="brand" onClick={()=>go('about')}>{SITE.name}</button>
   <nav>{[['about','About'],['projects','Projects'],['nourish','Nourish Curiosity']].map(([k,l])=><button key={k} className={page===k?'on':''} onClick={()=>go(k)}>{l}</button>)}</nav></header>
  {page==='about'&&<main className="narrow fade"><p className="eyebrow">{SITE.title}</p>
   {SITE.bio.map((p,i)=><p className="bio" key={i}>{p.split(/(\[\d+\])/).map((t,j)=>/^\[\d+\]$/.test(t)?<sup key={j}><a href={'#fn'+t.slice(1,-1)}>{t.slice(1,-1)}</a></sup>:t)}</p>)}
   <ol className="notes">{SITE.notes.map((n,i)=><li id={'fn'+(i+1)} key={i}>{n}</li>)}</ol>
   <button className="pill" onClick={()=>go('projects')}>See what I'm working on</button></main>}
  {page==='projects'&&<main className="narrow fade"><p className="eyebrow">Currently</p><h1>What I'm working on</h1>
   {PROJECTS.map(p=><button className="card tile" key={p.id} onClick={()=>go('nourish')}><span className="tag">{p.status}</span><h2>{p.title}</h2><p>{p.blurb}</p><span className="arrow">Open →</span></button>)}
   <p className="mut">New projects appear here as they begin.</p></main>}
  {page==='nourish'&&<main className="wide fade"><p className="eyebrow">A rolling residency</p><h1>Nourish Curiosity</h1>
   <div className="seg">{SUB.map(([k,l])=><button key={k} className={sub===k?'on':''} onClick={()=>setSub(k)}>{l}</button>)}</div>
   {sub==='season'&&<section><div className="card hero"><span className="tag">Now · {SEASONS[cur].name}</span><h2>{SUBJECTS[SEASONS[cur].subject]}</h2>
     <p className="mut">One subject at a time. Work through the modules in any order and at your own pace.</p>{idsOf(cur).map(i=><ModRow key={i} i={i}/>)}
     <div className="acts">{cur<SEASONS.length-1&&<button className="pill" onClick={()=>confirm('Close this season and open the next? Your work stays saved in the archive.')&&set({season:cur+1})}>Close season, open the next</button>}{cur>0&&<button onClick={()=>set({season:cur-1})}>Reopen previous season</button>}</div></div>
    {cur<SEASONS.length-1&&<><h3>Next</h3><div className="card"><b>{SEASONS[cur+1].name}</b> · {SUBJECTS[SEASONS[cur+1].subject]}</div></>}
    {cur>0&&<><h3>Archive</h3>{SEASONS.slice(0,cur).map((s,j)=><div className="card" key={j}><b>{s.name}</b> · {SUBJECTS[s.subject]}{idsOf(j).map(i=><ModRow key={i} i={i}/>)}</div>)}</>}</section>}
   {sub==='work'&&m&&<section><select value={mi} onChange={e=>set({active:+e.target.value})}>{avail.map(i=><option key={i} value={i}>{SUBJECTS[MODULES[i].s]} · {MODULES[i].t}</option>)}</select>
    <h2>{m.t}</h2><p className="tag">{SUBJECTS[m.s]} · {pct(st,mi)}% complete</p>
    {SECS.map(([k,l],n)=><div className="card" key={k}><h3>{n+1}. {l}</h3>
     {k==='ctx'&&<><p>{m.ctx}</p><ul>{m.con.map(c=><li key={c}>{c}</li>)}</ul></>}
     {k==='evd'&&<><ul>{m.rd.map(([t,u])=><li key={u}><a href={u} target="_blank" rel="noreferrer">{t}</a></li>)}</ul><p><b>Contrasting view:</b> {m.cx}</p></>}
     {k==='app'&&<p><b>Copenhagen fieldwork:</b> {m.ap}</p>}{k==='inq'&&<p><b>Reflect:</b> {m.pq}</p>}{k==='act'&&<p>{m.ac}</p>}{k==='mk'&&<p>{m.as}</p>}
     <textarea placeholder="Write here…" value={st.notes[mi+'.'+k]||''} onChange={e=>note(mi+'.'+k,e.target.value)}/></div>)}</section>}
   {sub==='field'&&<section>{avail.map(i=><div className="card" key={i}><h3>{MODULES[i].t}</h3><p>{MODULES[i].ap}</p><textarea placeholder="Field notes…" value={st.notes[i+'.app']||''} onChange={e=>note(i+'.app',e.target.value)}/></div>)}</section>}
   {sub==='mastery'&&<section><p className="mut">Explain it to a smart friend without notes, then rate yourself honestly: 1 is vague, 5 is could teach it.</p>{avail.map(i=><div className="card" key={i}><h3>{MODULES[i].t}</h3><p>Teach-back: {MODULES[i].con.slice(0,3).join(', ')}. Defend or attack: {MODULES[i].cx}</p>
     <textarea placeholder="Teach-back…" value={st.notes[i+'.teach']||''} onChange={e=>note(i+'.teach',e.target.value)}/>
     <div className="rate">{[1,2,3,4,5].map(n=><button key={n} className={st.rating[i]===n?'on':''} onClick={()=>set({rating:{...st.rating,[i]:n}})}>{n}</button>)}</div></div>)}</section>}
   {sub==='portfolio'&&<section><button className="pill" onClick={()=>window.print()}>Print / save PDF</button>{avail.map(i=><article className="card" key={i}><h3>{MODULES[i].t}</h3><p className="tag">{MODULES[i].as}</p><div className="pre">{st.notes[i+'.mk']||'Not yet written.'}</div></article>)}</section>}
  </main>}
  <footer><span>Saved automatically in this browser.</span><span><button onClick={backup}>Backup</button><button onClick={()=>file.current.click()}>Restore</button><input ref={file} type="file" accept=".json" hidden onChange={restore}/></span></footer>
 </div>}
