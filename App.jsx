import React,{useState,useEffect,useRef} from 'react'
import {MODULES,SUBJECTS} from './curriculum.js'
const KEY='nourish-curiosity-v1'
const SECS=[['ctx','Core / Context'],['evd','Supporting Evidence'],['app','Application'],['inq','Prompt / Inquiry'],['act','Activity'],['mk','Assignment / Create']]
const TABS=['Dashboard','Curriculum','Fieldwork','Calendar','Progress','Assessment','Portfolio']
const blank={notes:{},rating:{},start:'',active:0}
const load=()=>{try{return {...blank,...JSON.parse(localStorage.getItem(KEY))}}catch{return blank}}
const secDone=(st,i)=>SECS.filter(([k])=>(st.notes[i+'.'+k]||'').trim().length>20).length
const pct=(st,i)=>Math.round(secDone(st,i)/6*100)
export default function App(){
 const [st,setSt]=useState(load),[tab,setTab]=useState('Dashboard'),file=useRef()
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch{}},[st])
 const set=p=>setSt(s=>({...s,...p}))
 const note=(k,v)=>setSt(s=>({...s,notes:{...s.notes,[k]:v}}))
 const open=i=>{set({active:i});setTab('Curriculum');window.scrollTo(0,0)}
 const total=Math.round(MODULES.reduce((a,_,i)=>a+pct(st,i),0)/12)
 const backup=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(st,null,2)],{type:'application/json'}));a.download='nourish-curiosity-backup.json';a.click()}
 const restore=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{setSt({...blank,...JSON.parse(t)});alert('Restored.')}catch{alert('Invalid backup file.')}})}
 const m=MODULES[st.active]
 return <div className="app">
  <header><div><h1>Nourish Curiosity</h1><p>A twelve-week intellectual residency in Copenhagen</p></div>
   <div className="bk"><button onClick={backup}>Backup</button><button onClick={()=>file.current.click()}>Restore</button><input ref={file} type="file" accept=".json" hidden onChange={restore}/></div></header>
  <nav>{TABS.map(t=><button key={t} className={t===tab?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</nav>
  <main>
  {tab==='Dashboard'&&<section><h2>Overall progress: {total}%</h2><div className="bar"><i style={{width:total+'%'}}/></div>
   <p className="lead">Four disciplines, three weekly seminars each. Every module has six worksheets; a section counts as complete once you write more than a few lines. Work saves automatically in this browser. Use Backup regularly.</p>
   <div className="grid">{SUBJECTS.map((s,j)=><div className="card" key={s}><h3>{s}</h3>{MODULES.map((x,i)=>x.s===j&&<button className="row" key={i} onClick={()=>open(i)}><span>Week {i+1}: {x.t}</span><b>{pct(st,i)}%</b></button>)}</div>)}</div>
   <button className="big" onClick={()=>open(MODULES.findIndex((_,i)=>pct(st,i)<100)>=0?MODULES.findIndex((_,i)=>pct(st,i)<100):0)}>Continue where I left off</button></section>}
  {tab==='Curriculum'&&<section><select value={st.active} onChange={e=>set({active:+e.target.value})}>{MODULES.map((x,i)=><option key={i} value={i}>Week {i+1} · {SUBJECTS[x.s]} · {x.t}</option>)}</select>
   <h2>{m.t}</h2><p className="tag">{SUBJECTS[m.s]} · Week {st.active+1} · {pct(st,st.active)}% complete</p>
   {SECS.map(([k,l],n)=><div className="card ws" key={k}><h3>{n+1}. {l}</h3>
    {k==='ctx'&&<><p>{m.ctx}</p><ul>{m.con.map(c=><li key={c}>{c}</li>)}</ul></>}
    {k==='evd'&&<><ul>{m.rd.map(([t,u])=><li key={u}><a href={u} target="_blank" rel="noreferrer">{t}</a></li>)}</ul><p><b>Contrasting perspective:</b> {m.cx}</p></>}
    {k==='app'&&<p><b>Copenhagen fieldwork:</b> {m.ap}</p>}
    {k==='inq'&&<p><b>Reflect:</b> {m.pq}</p>}
    {k==='act'&&<p>{m.ac}</p>}
    {k==='mk'&&<p>{m.as}</p>}
    <textarea placeholder={k==='ctx'?'Summarise the core ideas in your own words…':k==='evd'?'Notes and evidence from your readings…':'Your response…'} value={st.notes[st.active+'.'+k]||''} onChange={e=>note(st.active+'.'+k,e.target.value)}/></div>)}</section>}
  {tab==='Fieldwork'&&<section><h2>Copenhagen fieldwork guide</h2><p className="lead">One outing per week. Carry a notebook; photograph, sketch and count.</p>
   {MODULES.map((x,i)=><div className="card" key={i}><h3>Week {i+1} · {x.t}</h3><p>{x.ap}</p><textarea placeholder="Field notes…" value={st.notes[i+'.app']||''} onChange={e=>note(i+'.app',e.target.value)}/></div>)}</section>}
  {tab==='Calendar'&&<section><h2>Study calendar</h2><label>Start date (a Monday) <input type="date" value={st.start} onChange={e=>set({start:e.target.value})}/></label>
   <div className="grid">{MODULES.map((x,i)=>{const d=st.start?new Date(new Date(st.start).getTime()+i*6048e5):null;const f=n=>d?new Date(d.getTime()+n*864e5).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):['Mon','Tue','Wed','Thu','Fri','Sat'][n]
   return <div className="card" key={i}><h3>Week {i+1}: {x.t}</h3><ul className="cal"><li><b>{f(0)}</b> Read & concepts</li><li><b>{f(1)}</b> Evidence & contrast</li><li><b>{f(2)}</b> Copenhagen fieldwork</li><li><b>{f(3)}</b> Inquiry reflection</li><li><b>{f(4)}</b> Activity</li><li><b>{f(5)}</b> Assignment & self-assessment</li></ul></div>})}</div></section>}
  {tab==='Progress'&&<section><h2>Progress tracker</h2>{SUBJECTS.map((s,j)=>{const ids=MODULES.map((x,i)=>x.s===j?i:-1).filter(i=>i>=0);const p=Math.round(ids.reduce((a,i)=>a+pct(st,i),0)/3);return <div className="card" key={s}><h3>{s} · {p}%</h3><div className="bar"><i style={{width:p+'%'}}/></div>{ids.map(i=><p key={i}>Week {i+1}: {SECS.map(([k])=>(st.notes[i+'.'+k]||'').trim().length>20?'●':'○').join(' ')}</p>)}</div>})}</section>}
  {tab==='Assessment'&&<section><h2>Mastery assessments</h2><p className="lead">For each module: write a teach-back explaining it to a smart friend without notes, then rate yourself honestly (1 = vague, 5 = could teach it).</p>
   {MODULES.map((x,i)=><div className="card" key={i}><h3>Week {i+1} · {x.t}</h3><p>Teach-back: explain {x.con.slice(0,3).join(', ')} and defend or attack: {x.cx}</p>
   <textarea value={st.notes[i+'.teach']||''} onChange={e=>note(i+'.teach',e.target.value)} placeholder="Teach-back…"/>
   <div className="rate">{[1,2,3,4,5].map(n=><button key={n} className={st.rating[i]===n?'on':''} onClick={()=>set({rating:{...st.rating,[i]:n}})}>{n}</button>)}</div></div>)}
   <p>Average mastery: {(()=>{const r=Object.values(st.rating);return r.length?(r.reduce((a,b)=>a+b,0)/r.length).toFixed(1):'–'})()} / 5</p></section>}
  {tab==='Portfolio'&&<section><h2>Final portfolio</h2><p className="lead">Your assignments, compiled. Print or save as PDF from your browser.</p><button className="big" onClick={()=>window.print()}>Print / save PDF</button>
   {SUBJECTS.map((s,j)=><div key={s}><h3>{s}</h3>{MODULES.map((x,i)=>x.s===j&&<article className="card" key={i}><h4>Week {i+1}: {x.t}</h4><p className="tag">{x.as}</p><div className="pre">{st.notes[i+'.mk']||'(not yet written)'}</div></article>)}</div>)}
   <h3>Closing synthesis</h3><textarea placeholder="Across the four disciplines, what connects? What changed in how you see Copenhagen and yourself?" value={st.notes.final||''} onChange={e=>note('final',e.target.value)}/></section>}
  </main></div>}
