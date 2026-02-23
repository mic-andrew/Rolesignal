import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   SEVEUM — AI INTERVIEWER PLATFORM
   Full Interactive Prototype v2
   ═══════════════════════════════════════════ */

// ─── ICONS ───
const I = {
  home: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  briefcase: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  users: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  clipCheck: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  barChart: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  fileText: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  gear: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  search: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  bell: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  mic: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>,
  cam: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  phoneOff: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  check: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>,
  arrowR: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  chevD: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>,
  x: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  plus: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
  upload: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  eye: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  play: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  flag: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>,
};

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <defs><linearGradient id="svlg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#7C6FFF"/><stop offset="1" stopColor="#5046E5"/></linearGradient></defs>
    <rect width="32" height="32" rx="8" fill="url(#svlg)"/>
    <path d="M8 16L16 8L24 16L16 24Z" fill="white" opacity="0.85"/>
    <path d="M12 16L16 12L20 16L16 20Z" fill="url(#svlg)"/>
  </svg>
);

// ─── STYLES ───
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#07070F;--bg2:#0D0D1A;--bg3:#131325;
  --s1:#171730;--s2:#1C1C3A;--s3:#222245;
  --b1:#252550;--b2:#2F2F60;--b3:#3A3A70;
  --t1:#EEEEF8;--t2:#A0A0C0;--t3:#6A6A90;
  --ac:#7C6FFF;--ac2:#9D93FF;--ac3:#BEB8FF;--acg:rgba(124,111,255,0.12);--acg2:rgba(124,111,255,0.06);
  --gr:#22C997;--grg:rgba(34,201,151,0.12);
  --am:#FFAD33;--amg:rgba(255,173,51,0.12);
  --rd:#FF5A5A;--rdg:rgba(255,90,90,0.12);
  --f:'Plus Jakarta Sans',system-ui,sans-serif;--m:'JetBrains Mono',monospace;
  --r1:8px;--r2:12px;--r3:16px;--r4:20px;
  --sh1:0 1px 2px rgba(0,0,0,0.3),0 1px 3px rgba(0,0,0,0.15);
  --sh2:0 4px 12px rgba(0,0,0,0.25),0 1px 4px rgba(0,0,0,0.15);
  --sh3:0 8px 30px rgba(0,0,0,0.35),0 2px 8px rgba(0,0,0,0.2);
  --shac:0 0 0 1px rgba(124,111,255,0.25),0 4px 20px rgba(124,111,255,0.15);
}
body{background:var(--bg);color:var(--t1);font-family:var(--f)}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fis{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
@keyframes pul{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes glo{0%,100%{box-shadow:0 0 20px rgba(124,111,255,0.25)}50%{box-shadow:0 0 50px rgba(124,111,255,0.5)}}
@keyframes orb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.04)}}
@keyframes wv{0%,100%{height:3px}50%{height:18px}}
@keyframes sp{to{transform:rotate(360deg)}}
@keyframes bf{from{width:0}}
@keyframes br{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.2);opacity:1}}
@keyframes sld{from{transform:translateX(-100%)}to{transform:translateX(200%)}}
.fi{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) both}
.fi1{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) 0.06s both}
.fi2{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) 0.12s both}
.fi3{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) 0.18s both}
.fi4{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) 0.24s both}
.fi5{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) 0.3s both}
.fi6{animation:fi 0.45s cubic-bezier(0.16,1,0.3,1) 0.36s both}
.fis{animation:fis 0.4s cubic-bezier(0.16,1,0.3,1) both}
button{font-family:var(--f)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--b1);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:var(--b2)}
`;

// ─── DATA ───
const cands = [
  { nm:"Sarah Chen",sc:92,st:"shortlisted",dt:"Feb 20",av:"SC",sk:{Tech:95,Behav:88,Comm:90,Problem:94,Culture:91}},
  { nm:"Marcus Johnson",sc:87,st:"reviewed",dt:"Feb 19",av:"MJ",sk:{Tech:90,Behav:85,Comm:82,Problem:89,Culture:88}},
  { nm:"Priya Patel",sc:84,st:"reviewed",dt:"Feb 19",av:"PP",sk:{Tech:82,Behav:88,Comm:86,Problem:80,Culture:84}},
  { nm:"Alex Rivera",sc:78,st:"pending",dt:"Feb 21",av:"AR",sk:{Tech:75,Behav:80,Comm:82,Problem:74,Culture:79}},
  { nm:"Emma Wilson",sc:71,st:"rejected",dt:"Feb 18",av:"EW",sk:{Tech:68,Behav:75,Comm:78,Problem:65,Culture:72}},
];

const txts = [
  {who:"ai",msg:"Welcome Sarah. Let's start with your experience building design systems. Can you walk me through a system you've built from scratch?"},
  {who:"u",msg:"Sure! At my last company, I led the creation of our component library serving 12 product teams. We used React with TypeScript, Storybook for documentation, and Chromatic for visual regression testing."},
  {who:"ai",msg:"That's a solid foundation. How did you handle versioning and breaking changes across 12 teams?"},
  {who:"u",msg:"We implemented semantic versioning with automated changelogs. For breaking changes, we used a deprecation-first approach with codemods to automate migration."},
  {who:"ai",msg:"Interesting approach. What was the most technically challenging aspect of maintaining consistency at that scale?"},
  {who:"u",msg:"Token synchronization was the hardest part. We built a design token pipeline that pulled from Figma, transformed through Style Dictionary, and output platform-specific formats."},
];

// ─── PRIMITIVES ───
const Av = ({t,sz=36,c="#7C6FFF"}) => (
  <div style={{width:sz,height:sz,minWidth:sz,borderRadius:"50%",background:`linear-gradient(145deg,${c}dd,${c}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(sz*0.34),fontWeight:700,color:"#fff",letterSpacing:"-0.02em"}}>{t}</div>
);

const Ring = ({v,sz=60,sw=3.5}) => {
  const r=(sz-sw*2)/2, circ=2*Math.PI*r, col=v>=80?"var(--gr)":v>=60?"var(--am)":"var(--rd)";
  return <div style={{position:"relative",width:sz,height:sz}}>
    <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="var(--b1)" strokeWidth={sw}/>
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-v/100)}
        style={{transition:"stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)"}}/>
    </svg>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(sz*0.28),fontWeight:800,color:col,fontFamily:"var(--m)"}}>{v}</div>
  </div>;
};

const Bar = ({label,v,dl=0}) => {
  const c=v>=80?"var(--gr)":v>=60?"var(--am)":"var(--rd)";
  return <div style={{marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
      <span style={{fontSize:12,fontWeight:500,color:"var(--t2)"}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,color:c,fontFamily:"var(--m)"}}>{v}</span>
    </div>
    <div style={{height:5,background:"var(--b1)",borderRadius:3,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${v}%`,background:`linear-gradient(90deg,${c},${c}cc)`,borderRadius:3,animation:`bf 1s cubic-bezier(0.16,1,0.3,1) ${dl*0.08}s both`}}/>
    </div>
  </div>;
};

const Badge = ({type}) => {
  const m={shortlisted:{bg:"var(--grg)",c:"var(--gr)",l:"Shortlisted"},reviewed:{bg:"var(--acg)",c:"var(--ac2)",l:"Reviewed"},pending:{bg:"var(--amg)",c:"var(--am)",l:"Pending"},rejected:{bg:"var(--rdg)",c:"var(--rd)",l:"Rejected"},live:{bg:"var(--grg)",c:"var(--gr)",l:"Live"}};
  const s=m[type]||m.pending;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:s.bg,color:s.c,letterSpacing:"0.01em"}}>
    {type==="live"&&<span style={{width:6,height:6,borderRadius:"50%",background:s.c,animation:"br 2s ease-in-out infinite"}}/>}{s.l}
  </span>;
};

const Btn = ({children,variant="primary",size="md",onClick,style:st,...p}) => {
  const base = {display:"inline-flex",alignItems:"center",gap:8,borderRadius:"var(--r1)",fontFamily:"var(--f)",fontWeight:600,cursor:"pointer",border:"none",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)",outline:"none",letterSpacing:"-0.01em"};
  const sizes = {sm:{padding:"6px 14px",fontSize:12},md:{padding:"10px 20px",fontSize:13},lg:{padding:"13px 28px",fontSize:14}};
  const vars = {
    primary:{background:"linear-gradient(135deg,var(--ac),#6358E0)",color:"#fff",boxShadow:"0 2px 12px rgba(124,111,255,0.3)"},
    ghost:{background:"transparent",color:"var(--t2)",border:"1px solid var(--b1)"},
    danger:{background:"var(--rdg)",color:"var(--rd)",border:"1px solid rgba(255,90,90,0.2)"},
    success:{background:"var(--grg)",color:"var(--gr)",border:"1px solid rgba(34,201,151,0.2)"},
  };
  return <button {...p} onClick={onClick} style={{...base,...sizes[size],...vars[variant],...st}}>{children}</button>;
};

const Card = ({children,glow,style:st,...p}) => (
  <div {...p} style={{background:"linear-gradient(180deg,var(--s1),var(--s1)ee)",border:"1px solid var(--b1)",borderRadius:"var(--r3)",padding:24,transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",...(glow?{cursor:"pointer"}:{}),...st}}>{children}</div>
);

const Glass = ({children,style:st}) => (
  <div style={{background:"rgba(13,13,26,0.7)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(124,111,255,0.1)",borderRadius:"var(--r3)",...st}}>{children}</div>
);

// ─── LAYOUT ───
const navItems = [
  {id:"dashboard",icon:I.home,label:"Dashboard"},
  {id:"setup",icon:I.briefcase,label:"Setup Interview"},
  {id:"candidates",icon:I.users,label:"Candidates"},
  {id:"evaluation",icon:I.clipCheck,label:"Evaluations"},
  {id:"rankings",icon:I.barChart,label:"Rankings"},
  {id:"audit",icon:I.fileText,label:"Audit Log"},
  {id:"settings",icon:I.gear,label:"Settings"},
];

const Sidebar = ({page,go}) => (
  <div style={{width:220,background:"var(--bg2)",borderRight:"1px solid var(--b1)",display:"flex",flexDirection:"column",padding:"20px 10px",flexShrink:0,height:"100vh",position:"sticky",top:0}}>
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 12px",marginBottom:36,cursor:"pointer"}} onClick={()=>go("auth")}>
      <Logo/><span style={{fontSize:17,fontWeight:800,letterSpacing:"-0.03em",background:"linear-gradient(135deg,var(--t1),var(--t2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Seveum</span>
    </div>
    <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
      {navItems.map(n=>(
        <div key={n.id} onClick={()=>go(n.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 12px",borderRadius:"var(--r1)",cursor:"pointer",background:page===n.id?"var(--acg)":"transparent",color:page===n.id?"var(--ac2)":"var(--t3)",fontWeight:page===n.id?600:500,fontSize:13,transition:"all 0.15s ease",letterSpacing:"-0.01em"}}>
          <span style={{opacity:page===n.id?1:0.6}}>{n.icon}</span>{n.label}
        </div>
      ))}
    </nav>
    <div style={{borderTop:"1px solid var(--b1)",paddingTop:14,display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:9,padding:"6px 12px",cursor:"pointer",borderRadius:"var(--r1)"}} onClick={()=>go("lobby")}>
        <span style={{width:7,height:7,borderRadius:"50%",background:"var(--gr)",boxShadow:"0 0 8px var(--gr)",animation:"br 2s ease-in-out infinite"}}/>
        <span style={{fontSize:12,fontWeight:500,color:"var(--t2)"}}>1 Live Interview</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:9,padding:"6px 12px",borderRadius:"var(--r1)"}} onClick={()=>go("auth")}>
        <Av t="JS" sz={26}/><div><div style={{fontSize:12,fontWeight:600,color:"var(--t1)"}}>Jane Smith</div><div style={{fontSize:10,color:"var(--t3)"}}>Admin</div></div>
      </div>
    </div>
  </div>
);

const TopBar = ({title}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 28px",borderBottom:"1px solid var(--b1)",background:"var(--bg)"}}>
    <h1 style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",color:"var(--t1)"}}>{title}</h1>
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 16px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",cursor:"pointer",fontSize:12,color:"var(--t3)",fontWeight:500}}>
        {I.search}<span>Search...</span><span style={{padding:"1px 6px",background:"var(--b1)",borderRadius:4,fontSize:10,fontWeight:600,marginLeft:8}}>{"/"}</span>
      </div>
      <div style={{position:"relative",cursor:"pointer",padding:6}}>
        {I.bell}
        <span style={{position:"absolute",top:2,right:2,width:14,height:14,borderRadius:"50%",background:"var(--rd)",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid var(--bg)"}}>3</span>
      </div>
    </div>
  </div>
);

const Shell = ({page,go,title,children}) => (
  <div style={{display:"flex",minHeight:"100vh",background:"var(--bg)"}}>
    <Sidebar page={page} go={go}/>
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <TopBar title={title}/>
      <div style={{flex:1,padding:28,overflow:"auto"}}>{children}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════
const AuthPage = ({go}) => {
  const [mode,setMode] = useState("login");
  return <div style={{display:"flex",minHeight:"100vh",background:"var(--bg)"}}>
    <div style={{flex:"0 0 50%",background:"linear-gradient(160deg,var(--bg) 0%,#0E0E22 40%,#12123A 100%)",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 56px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"50%",left:"35%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,111,255,0.06),transparent 70%)",transform:"translate(-50%,-50%)"}}/>
      {[...Array(5)].map((_,i)=><div key={i} style={{position:"absolute",width:160+i*120,height:160+i*120,border:`1px solid rgba(124,111,255,${0.04-i*0.005})`,borderRadius:"50%",top:"50%",left:"35%",transform:"translate(-50%,-50%)",animation:`br ${4+i*0.8}s ease-in-out ${i*0.4}s infinite`}}/>)}
      <div style={{position:"relative",zIndex:1}}>
        <div className="fi" style={{display:"flex",alignItems:"center",gap:10,marginBottom:72}}><Logo/><span style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>Seveum</span></div>
        <h1 className="fi2" style={{fontSize:46,fontWeight:800,lineHeight:1.1,letterSpacing:"-0.04em",maxWidth:440}}>
          Autonomous AI{" "}<span style={{background:"linear-gradient(135deg,var(--ac),var(--ac2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Interviewer</span>
        </h1>
        <p className="fi3" style={{fontSize:16,color:"var(--t2)",marginTop:20,maxWidth:400,lineHeight:1.7,fontWeight:400}}>
          Replace manual screening calls with structured, real-time AI interviews that produce explainable hiring intelligence.
        </p>
      </div>
      <div className="fi5" style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:12}}>
        {["SC","MJ","PP"].map((x,i)=><Av key={i} t={x} sz={28} c={["#7C6FFF","#22C997","#FFAD33"][i]}/>)}
        <span style={{fontSize:12,color:"var(--t3)",fontWeight:500}}>2,400+ interviews conducted</span>
      </div>
    </div>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:48,background:"var(--bg)"}}>
      <div style={{width:"100%",maxWidth:380}} className="fi3">
        <h2 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",marginBottom:6}}>{mode==="login"?"Welcome back":"Get started"}</h2>
        <p style={{fontSize:14,color:"var(--t3)",marginBottom:32,fontWeight:400}}>{mode==="login"?"Sign in to your Seveum workspace":"Create your account to begin"}</p>
        <div style={{display:"flex",gap:10,marginBottom:24}}>
          {[{l:"Google",svg:<svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>},{l:"Microsoft",svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--t1)"><rect x="1" y="1" width="10" height="10"/><rect x="13" y="1" width="10" height="10"/><rect x="1" y="13" width="10" height="10"/><rect x="13" y="13" width="10" height="10"/></svg>}].map((p,i)=>(
            <Btn key={i} variant="ghost" style={{flex:1,justifyContent:"center",padding:"11px 0",gap:8}}>{p.svg}<span>{p.l}</span></Btn>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><div style={{flex:1,height:1,background:"var(--b1)"}}/><span style={{fontSize:11,color:"var(--t3)",fontWeight:500}}>or with email</span><div style={{flex:1,height:1,background:"var(--b1)"}}/></div>
        {mode==="signup"&&<div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Full Name</label><input style={{width:"100%",padding:"11px 14px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} placeholder="Jane Smith"/></div>}
        <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Email</label><input style={{width:"100%",padding:"11px 14px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} type="email" placeholder="you@company.com"/></div>
        <div style={{marginBottom:28}}><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Password</label><input style={{width:"100%",padding:"11px 14px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} type="password" placeholder="Enter your password"/></div>
        <Btn size="lg" onClick={()=>go("dashboard")} style={{width:"100%",justifyContent:"center"}}>{mode==="login"?"Sign In":"Create Account"}<span style={{marginLeft:4}}>{I.arrowR}</span></Btn>
        <p style={{textAlign:"center",marginTop:20,fontSize:13,color:"var(--t3)"}}>{mode==="login"?"No account? ":"Have an account? "}<span style={{color:"var(--ac)",cursor:"pointer",fontWeight:600}} onClick={()=>setMode(mode==="login"?"signup":"login")}>{mode==="login"?"Sign up":"Sign in"}</span></p>
      </div>
    </div>
  </div>;
};

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
const DashboardPage = ({go}) => (
  <Shell page="dashboard" go={go} title="Dashboard">
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
      {[{l:"Active Roles",v:"8",tr:"+2 this week",c:"var(--ac)"},{l:"Interviews This Week",v:"24",tr:"+12%",c:"var(--gr)"},{l:"Avg. Fit Score",v:"81",tr:"+3 pts",c:"var(--gr)"},{l:"Pending Reviews",v:"6",tr:"",c:"var(--am)"}].map((m,i)=>(
        <Card key={i} style={{padding:"18px 22px",borderLeft:`3px solid ${m.c}`}} className={`fi${i+1}`}>
          <div style={{fontSize:11,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>{m.l}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontSize:30,fontWeight:800,letterSpacing:"-0.03em",color:"var(--t1)"}}>{m.v}</span>
            {m.tr&&<span style={{fontSize:12,fontWeight:600,color:m.c}}>{m.tr}</span>}
          </div>
        </Card>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20}}>
      <div className="fi4">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{fontSize:15,fontWeight:700,color:"var(--t1)"}}>Interview Pipeline</h2>
          <Btn variant="ghost" size="sm" onClick={()=>go("setup")}>{I.plus}<span>New Role</span></Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:28}}>
          {[{l:"Invited",n:12,c:"var(--t3)"},{l:"Scheduled",n:8,c:"var(--ac)"},{l:"In Progress",n:2,c:"var(--gr)"},{l:"Completed",n:18,c:"var(--ac2)"},{l:"Reviewed",n:14,c:"var(--gr)"}].map((col,i)=>(
            <Card key={i} style={{padding:14,textAlign:"center"}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{col.l}</div>
              <div style={{fontSize:26,fontWeight:800,color:col.c,letterSpacing:"-0.02em",marginBottom:10}}>{col.n}</div>
              {cands.slice(0,i===2?1:2).map((c,j)=>(
                <div key={j} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 7px",background:"var(--bg2)",borderRadius:6,marginBottom:4,cursor:"pointer"}} onClick={()=>go("evaluation")}>
                  <Av t={c.av} sz={20}/><span style={{fontSize:11,fontWeight:500,color:"var(--t2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.nm.split(" ")[0]}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
        <h2 style={{fontSize:15,fontWeight:700,color:"var(--t1)",marginBottom:14}}>Active Roles</h2>
        {[{t:"Senior Frontend Engineer",d:"Engineering",cn:5,sc:84,dy:6},{t:"Product Designer",d:"Design",cn:3,sc:78,dy:12},{t:"Data Scientist",d:"ML Team",cn:7,sc:81,dy:3}].map((r,i)=>(
          <Card key={i} glow style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,padding:"14px 18px",cursor:"pointer"}} onClick={()=>go("rankings")}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:38,height:38,borderRadius:10,background:"var(--acg)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ac)"}}>{I.briefcase}</div>
              <div><div style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>{r.t}</div><div style={{fontSize:12,color:"var(--t3)",fontWeight:400}}>{r.d} &middot; {r.cn} candidates &middot; {r.dy}d ago</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{textAlign:"right"}}><div style={{fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase"}}>Avg Score</div><div style={{fontSize:18,fontWeight:800,color:r.sc>=80?"var(--gr)":"var(--am)",fontFamily:"var(--m)"}}>{r.sc}</div></div>
              <Badge type="live"/>
            </div>
          </Card>
        ))}
      </div>
      <div className="fi5">
        <h2 style={{fontSize:15,fontWeight:700,color:"var(--t1)",marginBottom:14}}>Activity</h2>
        <Card style={{padding:0,maxHeight:500,overflow:"auto"}}>
          {[
            {e:"\uD83C\uDFAF",t:"Sarah Chen scored 92 on Frontend Engineer",tm:"2m ago"},
            {e:"\uD83C\uDFA4",t:"Marcus Johnson completed interview",tm:"15m ago"},
            {e:"\uD83D\uDCCB",t:"New rubric generated for Data Scientist",tm:"1h ago"},
            {e:"\uD83D\uDCE9",t:"3 candidates invited for Product Designer",tm:"2h ago"},
            {e:"\u26A1",t:"AI flagged inconsistency in Alex Rivera responses",tm:"3h ago"},
            {e:"\u2705",t:"Priya Patel moved to Shortlisted",tm:"4h ago"},
          ].map((ev,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"13px 18px",borderBottom:"1px solid var(--b1)",cursor:"pointer",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="var(--acg2)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:16,lineHeight:"20px"}}>{ev.e}</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,lineHeight:1.5,color:"var(--t1)"}}>{ev.t}</div><div style={{fontSize:11,color:"var(--t3)",marginTop:2,fontWeight:400}}>{ev.tm}</div></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </Shell>
);

// ═══════════════════════════════════════════
// SETUP INTERVIEW (with Preview step)
// ═══════════════════════════════════════════
const SetupPage = ({go}) => {
  const [step,setStep] = useState(0);
  const steps = ["Create Role","Job Description","AI Rubric","Configure","Invite","Review & Preview"];
  const comps = [{nm:"System Design",w:25,q:3,c:"var(--ac)"},{nm:"React & TypeScript",w:25,q:4,c:"var(--ac2)"},{nm:"Performance Optimization",w:20,q:3,c:"var(--gr)"},{nm:"Team Collaboration",w:15,q:2,c:"var(--am)"},{nm:"Problem Solving",w:15,q:3,c:"#EC4899"}];

  return <Shell page="setup" go={go} title="Setup Interview">
    {/* Step rail */}
    <div style={{display:"flex",alignItems:"center",marginBottom:36,padding:"0 20px"}} className="fi">
      {steps.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:"none"}}>
        <div onClick={()=>setStep(i)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",whiteSpace:"nowrap"}}>
          <div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,
            background:i<step?"var(--gr)":i===step?"linear-gradient(135deg,var(--ac),#6358E0)":"var(--s2)",
            color:i<=step?"#fff":"var(--t3)",transition:"all 0.3s ease",boxShadow:i===step?"0 0 12px rgba(124,111,255,0.4)":"none"}}>
            {i<step?I.check:i+1}
          </div>
          <span style={{fontSize:12,fontWeight:i===step?700:500,color:i===step?"var(--t1)":"var(--t3)",transition:"all 0.2s"}}>{s}</span>
        </div>
        {i<steps.length-1&&<div style={{flex:1,height:2,background:i<step?"var(--gr)":"var(--b1)",margin:"0 14px",borderRadius:1,transition:"background 0.4s"}}/>}
      </div>)}
    </div>

    <div style={{maxWidth:700,margin:"0 auto"}} key={step} className="fis">
      {step===0&&<Card style={{padding:30}}>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:22,color:"var(--t1)"}}>Create Role</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{l:"Role Title",p:"Senior Frontend Engineer"},{l:"Department",p:"Engineering"}].map(f=><div key={f.l}><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>{f.l}</label><input style={{width:"100%",padding:"11px 14px",background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} placeholder={f.p}/></div>)}
          <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Seniority</label>
            <div style={{display:"flex",borderRadius:"var(--r1)",overflow:"hidden",border:"1px solid var(--b1)"}}>
              {["Junior","Mid","Senior","Lead"].map((l,i)=><div key={i} style={{flex:1,padding:"10px 0",textAlign:"center",fontSize:12,fontWeight:600,cursor:"pointer",background:i===2?"var(--ac)":"var(--s1)",color:i===2?"#fff":"var(--t3)",transition:"all 0.15s"}}>{l}</div>)}
            </div>
          </div>
          <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Location</label><input style={{width:"100%",padding:"11px 14px",background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} placeholder="Remote"/></div>
        </div>
      </Card>}

      {step===1&&<Card style={{padding:30}}>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6,color:"var(--t1)"}}>Job Description</h3>
        <p style={{fontSize:13,color:"var(--t3)",marginBottom:22}}>Paste or upload your JD. AI will extract competencies automatically.</p>
        <div style={{border:"2px dashed var(--b2)",borderRadius:"var(--r3)",padding:36,textAlign:"center",marginBottom:20,cursor:"pointer",background:"var(--bg2)",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--ac)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b2)"}>
          <div style={{color:"var(--ac)",marginBottom:10,opacity:0.8}}>{I.upload}</div>
          <div style={{fontSize:14,fontWeight:600,color:"var(--t1)"}}>Drop file here or click to upload</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>PDF, DOCX, or TXT</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}><div style={{flex:1,height:1,background:"var(--b1)"}}/><span style={{fontSize:11,color:"var(--t3)",fontWeight:500}}>or paste text</span><div style={{flex:1,height:1,background:"var(--b1)"}}/></div>
        <textarea style={{width:"100%",padding:14,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none",resize:"vertical",minHeight:120}} placeholder="Paste job description here..."/>
      </Card>}

      {step===2&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div><h3 style={{fontSize:17,fontWeight:700,color:"var(--t1)"}}>AI-Generated Rubric</h3><p style={{fontSize:13,color:"var(--t3)",marginTop:4}}>Drag to reorder. Adjust weights to tune scoring.</p></div>
          <Btn variant="ghost" size="sm">{I.plus}<span>Add Competency</span></Btn>
        </div>
        <div style={{display:"flex",borderRadius:6,overflow:"hidden",marginBottom:22,height:8,boxShadow:"inset 0 1px 3px rgba(0,0,0,0.3)"}}>
          {comps.map((c,i)=><div key={i} style={{flex:c.w,background:c.c,transition:"flex 0.4s cubic-bezier(0.16,1,0.3,1)"}}/>)}
        </div>
        {comps.map((c,i)=>(
          <Card key={i} glow style={{marginBottom:8,padding:"14px 18px",cursor:"grab"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shac)";e.currentTarget.style.borderColor="rgba(124,111,255,0.3)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="var(--b1)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--t3)"><circle cx="4" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="4" cy="7" r="1.5"/><circle cx="10" cy="7" r="1.5"/><circle cx="4" cy="11" r="1.5"/><circle cx="10" cy="11" r="1.5"/></svg>
                <div><div style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>{c.nm}</div><div style={{fontSize:12,color:"var(--t3)",fontWeight:400}}>{c.q} questions</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:100,height:5,background:"var(--b1)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${c.w}%`,height:"100%",background:c.c,borderRadius:3,transition:"width 0.3s"}}/>
                </div>
                <span style={{fontSize:13,fontWeight:700,fontFamily:"var(--m)",color:"var(--t2)",minWidth:36,textAlign:"right"}}>{c.w}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>}

      {step===3&&<Card style={{padding:30}}>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:22,color:"var(--t1)"}}>Interview Configuration</h3>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:10}}>Duration</label>
          <div style={{display:"flex",gap:10}}>
            {[15,30,45,60].map(d=>(
              <div key={d} style={{flex:1,padding:"16px 0",textAlign:"center",borderRadius:"var(--r2)",border:d===30?"2px solid var(--ac)":"1px solid var(--b1)",background:d===30?"var(--acg)":"var(--s1)",cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{fontSize:22,fontWeight:800,color:d===30?"var(--ac)":"var(--t1)",letterSpacing:"-0.02em"}}>{d}</div>
                <div style={{fontSize:11,color:"var(--t3)",fontWeight:500}}>minutes</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:10}}>AI Tone</label>
          <div style={{display:"flex",gap:10}}>
            {[{l:"Professional",d:"Formal and structured"},{l:"Conversational",d:"Warm and natural"},{l:"Challenging",d:"Probing and rigorous"}].map((t,i)=>(
              <div key={i} style={{flex:1,padding:16,borderRadius:"var(--r2)",border:i===1?"2px solid var(--ac)":"1px solid var(--b1)",background:i===1?"var(--acg)":"var(--s1)",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                <div style={{fontSize:13,fontWeight:700,color:i===1?"var(--ac)":"var(--t1)",marginBottom:3}}>{t.l}</div>
                <div style={{fontSize:11,color:"var(--t3)"}}>{t.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:16,background:"var(--bg2)",borderRadius:"var(--r2)",border:"1px solid var(--b1)"}}>
          <div><div style={{fontSize:14,fontWeight:600,color:"var(--t1)"}}>Adaptive Difficulty</div><div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>AI adjusts question depth based on candidate responses</div></div>
          <div style={{width:44,height:24,borderRadius:12,background:"var(--ac)",padding:2,cursor:"pointer",boxShadow:"0 0 10px rgba(124,111,255,0.3)"}}><div style={{width:20,height:20,borderRadius:10,background:"#fff",marginLeft:20,transition:"margin 0.2s"}}/></div>
        </div>
      </Card>}

      {step===4&&<Card style={{padding:30}}>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:6,color:"var(--t1)"}}>Invite Candidates</h3>
        <p style={{fontSize:13,color:"var(--t3)",marginBottom:20}}>Add candidate emails. Each receives a unique interview link.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,padding:12,background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",marginBottom:20,minHeight:48}}>
          {["sarah.chen@email.com","marcus.j@email.com","priya.p@email.com"].map((e,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 10px",background:"var(--s2)",borderRadius:6,fontSize:12,fontWeight:500,color:"var(--t1)"}}>
              {e}<span style={{cursor:"pointer",color:"var(--t3)",display:"flex"}}>{I.x}</span>
            </span>
          ))}
          <input style={{flex:1,minWidth:180,border:"none",background:"transparent",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} placeholder="Add email..."/>
        </div>
        <Glass style={{display:"flex",alignItems:"center",gap:12,padding:16}}>
          <div style={{color:"var(--ac)"}}>{I.users}</div>
          <div><div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>3 candidates ready to invite</div><div style={{fontSize:12,color:"var(--t3)"}}>Each receives a personalized interview link</div></div>
        </Glass>
      </Card>}

      {step===5&&<Card style={{padding:36,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,var(--acg),var(--acg2))",border:"2px solid rgba(124,111,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",animation:"glo 3s ease-in-out infinite"}}>
          <span style={{fontSize:30}}>{"✦"}</span>
        </div>
        <h3 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.02em",marginBottom:8}}>Ready to Launch</h3>
        <p style={{fontSize:14,color:"var(--t2)",marginBottom:24,maxWidth:380,margin:"0 auto 24px"}}>Senior Frontend Engineer interview with 3 candidates, 30-minute conversational AI sessions.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:28}}>
          {[{l:"Competencies",v:"5"},{l:"Duration",v:"30m"},{l:"Candidates",v:"3"},{l:"Questions",v:"~15"}].map((s,i)=>(
            <div key={i} style={{padding:"14px 20px",background:"var(--bg2)",borderRadius:"var(--r2)",border:"1px solid var(--b1)",minWidth:80}}>
              <div style={{fontSize:20,fontWeight:800,color:"var(--ac)",fontFamily:"var(--m)"}}>{s.v}</div>
              <div style={{fontSize:11,color:"var(--t3)",fontWeight:500,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <Btn variant="ghost" size="lg" onClick={()=>go("lobby")}>
            {I.play}<span>Preview Interview</span>
          </Btn>
          <Btn size="lg" onClick={()=>go("dashboard")}>
            Send Invitations<span style={{marginLeft:4}}>{I.arrowR}</span>
          </Btn>
        </div>
      </Card>}
    </div>

    <div style={{display:"flex",justifyContent:"space-between",maxWidth:700,margin:"22px auto 0"}}>
      <Btn variant="ghost" onClick={()=>step>0&&setStep(step-1)} style={{opacity:step===0?0.3:1}}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back
      </Btn>
      {step<5&&<Btn onClick={()=>setStep(step+1)}>Continue<span style={{marginLeft:2}}>{I.arrowR}</span></Btn>}
    </div>
  </Shell>;
};

// ═══════════════════════════════════════════
// LOBBY
// ═══════════════════════════════════════════
const LobbyPage = ({go}) => {
  const [cd,setCd] = useState(10);
  useEffect(()=>{const t=setInterval(()=>setCd(c=>c<=1?(clearInterval(t),0):c-1),1000);return()=>clearInterval(t)},[]);
  return <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:28}}>
    <div style={{maxWidth:880,width:"100%",display:"grid",gridTemplateColumns:"1fr 300px",gap:28}} className="fi">
      <div>
        <div style={{aspectRatio:"16/9",borderRadius:"var(--r4)",background:"linear-gradient(160deg,var(--s1),var(--bg2))",position:"relative",overflow:"hidden",marginBottom:20,border:"1px solid var(--b1)",boxShadow:"var(--sh3)"}}>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"var(--s2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--t3)"}}>{I.cam}</div>
            <span style={{fontSize:13,color:"var(--t3)",fontWeight:500}}>Camera Preview</span>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:14,background:"linear-gradient(transparent,rgba(0,0,0,0.7))",display:"flex",justifyContent:"center",gap:10}}>
            {[I.mic,I.cam].map((ic,i)=><div key={i} style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.12)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s",border:"1px solid rgba(255,255,255,0.1)"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.2)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"}>{ic}</div>)}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:"var(--grg)",borderRadius:"var(--r1)",width:"fit-content",border:"1px solid rgba(34,201,151,0.15)"}}>
          <div style={{display:"flex",gap:2}}>{[10,14,18].map((h,i)=><div key={i} style={{width:3,height:h,borderRadius:2,background:"var(--gr)"}}/>)}</div>
          <span style={{fontSize:12,fontWeight:600,color:"var(--gr)"}}>Excellent Connection</span>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <Card style={{textAlign:"center",padding:24}}>
          <div style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(145deg,var(--ac),#5046E5)",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",animation:"orb 3s ease-in-out infinite",boxShadow:"0 0 30px rgba(124,111,255,0.3)"}}>
            <span style={{fontSize:26,color:"#fff"}}>{"✦"}</span>
          </div>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:3}}>Aria</h3>
          <p style={{fontSize:11,color:"var(--t3)",marginBottom:14,fontWeight:500}}>Your AI Interviewer</p>
          <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>
            Hi Sarah, I'll be conducting your interview for <strong style={{color:"var(--t1)",fontWeight:600}}>Senior Frontend Engineer</strong> at Acme Corp.
          </p>
        </Card>
        <Card style={{padding:16}}>
          <div style={{fontSize:11,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Interview Details</div>
          {[{l:"Role",v:"Senior Frontend Engineer"},{l:"Company",v:"Acme Corp"},{l:"Duration",v:"30 minutes"},{l:"Sections",v:"5 sections"}].map(d=>(
            <div key={d.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--b1)"}}>
              <span style={{fontSize:12,color:"var(--t3)"}}>{d.l}</span><span style={{fontSize:12,fontWeight:600,color:"var(--t1)"}}>{d.v}</span>
            </div>
          ))}
        </Card>
        <div style={{textAlign:"center",marginTop:4}}>
          {cd>0?<div><div style={{fontSize:11,color:"var(--t3)",fontWeight:500,marginBottom:6}}>Interview starts in</div><div style={{fontSize:40,fontWeight:800,color:"var(--ac)",fontFamily:"var(--m)",letterSpacing:"-0.02em"}}>{cd}s</div></div>
          :<Btn size="lg" onClick={()=>go("interview")} style={{width:"100%",justifyContent:"center"}}>Join Interview<span style={{marginLeft:4}}>{I.arrowR}</span></Btn>}
        </div>
      </div>
    </div>
  </div>;
};

// ═══════════════════════════════════════════
// INTERVIEW ROOM
// ═══════════════════════════════════════════
const InterviewPage = ({go}) => {
  const [stage,setStage] = useState(1);
  const [qi,setQi] = useState(2);
  const stages = ["Intro","Technical","Behavioral","Situational","Closing"];
  const advance = () => { if(qi<3) setQi(qi+1); else if(stage<4) { setStage(stage+1); setQi(1); } };

  return <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#050510"}}>
    <div style={{display:"flex",alignItems:"center",padding:"0 20px",height:42,background:"var(--bg2)",borderBottom:"1px solid var(--b1)"}}>
      <div style={{display:"flex",flex:1,gap:0,height:3,borderRadius:2,overflow:"hidden"}}>
        {stages.map((_,i)=><div key={i} style={{flex:1,background:i<stage?"var(--ac)":i===stage?"rgba(124,111,255,0.3)":"var(--b1)",transition:"background 0.5s",position:"relative",overflow:"hidden"}}>
          {i===stage&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,var(--ac),transparent)",animation:"sld 2s linear infinite"}}/>}
        </div>)}
      </div>
      <div style={{marginLeft:16,fontSize:12,fontWeight:500,color:"var(--t2)",whiteSpace:"nowrap"}}>
        <span style={{color:"var(--ac)",fontWeight:700}}>{stages[stage]}</span>{" \u00B7 Q"}{Math.min(qi,4)}{" of 5"}
      </div>
      <div style={{marginLeft:18,fontSize:13,fontFamily:"var(--m)",color:"var(--t3)",fontWeight:500}}>12:34</div>
    </div>
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      <div style={{flex:1,position:"relative",background:"linear-gradient(160deg,#080818,#0A0A1A)"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Av t="SC" sz={110} c="#7C6FFF"/></div>
        <div style={{position:"absolute",bottom:20,left:20,display:"flex",alignItems:"center",gap:8}}>
          <Glass style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--gr)",boxShadow:"0 0 6px var(--gr)"}}/>
            <span style={{fontSize:13,fontWeight:600}}>Sarah Chen</span>
          </Glass>
        </div>
        <div style={{position:"absolute",top:20,right:20,width:170,height:120,borderRadius:"var(--r2)",overflow:"hidden",border:"1px solid var(--b1)"}}>
          <Glass style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6,borderRadius:"var(--r2)"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(145deg,var(--ac),#5046E5)",display:"flex",alignItems:"center",justifyContent:"center",animation:"orb 3s ease-in-out infinite",boxShadow:"0 0 20px rgba(124,111,255,0.35)"}}>
              <span style={{fontSize:18,color:"#fff"}}>{"✦"}</span>
            </div>
            <span style={{fontSize:10,fontWeight:600,color:"var(--ac2)"}}>{"Aria \u00B7 Speaking"}</span>
            <div style={{display:"flex",gap:2,alignItems:"end",height:14}}>
              {[0,1,2,3,4,3,2,1,0].map((v,i)=><div key={i} style={{width:2.5,background:"var(--ac)",borderRadius:2,animation:`wv 0.${4+i}s ease-in-out infinite`,animationDelay:`${i*50}ms`}}/>)}
            </div>
          </Glass>
        </div>
        <div style={{position:"absolute",bottom:72,left:"50%",transform:"translateX(-50)",maxWidth:480}} className="fi">
          <Glass style={{padding:"11px 18px"}}>
            <div style={{fontSize:13,color:"var(--t1)",lineHeight:1.5,fontWeight:400}}>{txts[Math.min(qi*2,txts.length-1)]?.msg.slice(0,100)}...</div>
          </Glass>
        </div>
      </div>
      <div style={{width:340,background:"var(--bg2)",borderLeft:"1px solid var(--b1)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 18px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:14,fontWeight:700}}>Live Transcript</span><Badge type="live"/>
        </div>
        <div style={{flex:1,overflow:"auto",padding:14}}>
          {txts.slice(0,qi*2+2).map((m,i)=><div key={i} style={{marginBottom:14}} className={`fi${Math.min(i+1,6)}`}>
            <div style={{fontSize:10,fontWeight:700,color:m.who==="ai"?"var(--ac)":"var(--gr)",marginBottom:3,fontFamily:"var(--m)",textTransform:"uppercase",letterSpacing:"0.04em"}}>
              {m.who==="ai"?"Aria":"Sarah Chen"}<span style={{color:"var(--t3)",fontWeight:400,marginLeft:6,textTransform:"none"}}>{`${Math.floor(i*4.5)}:${String((i*30)%60).padStart(2,"0")}`}</span>
            </div>
            <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.65,fontWeight:400}}>{m.msg}</div>
          </div>)}
          <div style={{display:"flex",gap:4,padding:8}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"var(--t3)",animation:`pul 1.4s ease-in-out ${i*0.2}s infinite`}}/>)}</div>
        </div>
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:14,background:"var(--bg2)",borderTop:"1px solid var(--b1)",gap:12}}>
      {[{ic:I.mic,l:"Mute"},{ic:I.cam,l:"Camera"}].map((c,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"var(--s2)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--b1)",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--s3)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--s2)"}>
            {c.ic}
          </div>
          <span style={{fontSize:10,color:"var(--t3)",fontWeight:500}}>{c.l}</span>
        </div>
      ))}
      <div style={{width:1,height:28,background:"var(--b1)",margin:"0 6px"}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}} onClick={advance}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"var(--acg)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ac)",border:"1px solid rgba(124,111,255,0.2)"}}>{I.arrowR}</div>
        <span style={{fontSize:10,color:"var(--t3)",fontWeight:500}}>Next Q</span>
      </div>
      <div style={{width:1,height:28,background:"var(--b1)",margin:"0 6px"}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}} onClick={()=>go("processing")}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"var(--rdg)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--rd)",border:"1px solid rgba(255,90,90,0.15)"}}>{I.phoneOff}</div>
        <span style={{fontSize:10,color:"var(--t3)",fontWeight:500}}>End</span>
      </div>
    </div>
  </div>;
};

// ═══════════════════════════════════════════
// PROCESSING
// ═══════════════════════════════════════════
const ProcessingPage = ({go}) => {
  const [ph,setPh] = useState(0);
  const phases = ["Analyzing Transcript","Mapping Competencies","Computing Scores","Assessing Risks","Generating Report"];
  useEffect(()=>{const t=setInterval(()=>setPh(p=>p>=4?(clearInterval(t),setTimeout(()=>go("evaluation"),1000),4):p+1),1400);return()=>clearInterval(t)},[]);
  return <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 45%,rgba(124,111,255,0.05),transparent 60%)"}}/>
    <div style={{maxWidth:460,width:"100%",textAlign:"center",position:"relative",zIndex:1}} className="fi">
      <div style={{width:100,height:100,borderRadius:"50%",margin:"0 auto 28px",display:"flex",alignItems:"center",justifyContent:"center",animation:"glo 3s ease-in-out infinite"}}><Ring v={Math.min((ph+1)*20,100)} sz={88} sw={3}/></div>
      <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.02em",marginBottom:6}}>Processing Interview</h2>
      <p style={{fontSize:14,color:"var(--t3)",marginBottom:36,fontWeight:400}}>Evaluating Sarah Chen's responses</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,textAlign:"left"}}>
        {phases.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderRadius:"var(--r2)",background:i===ph?"var(--acg)":i<ph?"var(--s1)":"var(--bg2)",border:`1px solid ${i===ph?"rgba(124,111,255,0.25)":"var(--b1)"}`,transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
            <div style={{width:26,height:26,minWidth:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:i<ph?"var(--gr)":i===ph?"var(--ac)":"var(--s2)",color:"#fff",fontSize:11,fontWeight:700,transition:"all 0.3s"}}>
              {i<ph?I.check:i===ph?<div style={{width:10,height:10,borderRadius:"50%",border:"2px solid #fff",borderTopColor:"transparent",animation:"sp 0.7s linear infinite"}}/>:<span style={{color:"var(--t3)"}}>{i+1}</span>}
            </div>
            <span style={{fontSize:13,fontWeight:i===ph?700:500,color:i<=ph?"var(--t1)":"var(--t3)",flex:1}}>{p}</span>
            {i<ph&&<span style={{fontSize:11,fontWeight:600,color:"var(--gr)",fontFamily:"var(--m)"}}>Done</span>}
            {i===ph&&<span style={{fontSize:11,fontWeight:600,color:"var(--ac)",animation:"pul 1.5s ease-in-out infinite"}}>Processing</span>}
          </div>
        ))}
      </div>
    </div>
  </div>;
};

// ═══════════════════════════════════════════
// EVALUATION
// ═══════════════════════════════════════════
const EvaluationPage = ({go}) => {
  const [ex,setEx] = useState(0);
  const skills=[{nm:"System Design",sc:95,ev:"Demonstrated deep understanding of distributed systems with real production examples from multiple scaling challenges."},{nm:"React & TypeScript",sc:92,ev:"Strong TypeScript generics usage. Explained discriminated unions and mapped types with practical team-wide adoption."},{nm:"Performance",sc:88,ev:"Detailed Core Web Vitals knowledge. Described bundle optimization reducing LCP by 40% with measurable production impact."},{nm:"Collaboration",sc:90,ev:"Led design system initiative across 12 product teams with clear deprecation protocols and migration support."},{nm:"Problem Solving",sc:94,ev:"Excellent structured thinking. Decomposed complex token synchronization into clear sub-problems with iterative solution design."}];
  return <Shell page="evaluation" go={go} title="Candidate Evaluation">
    <Card className="fi" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,padding:"18px 22px"}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <Av t="SC" sz={46}/><div><div style={{fontSize:18,fontWeight:800,letterSpacing:"-0.02em"}}>Sarah Chen</div><div style={{fontSize:12,color:"var(--t3)",fontWeight:400}}>Senior Frontend Engineer &middot; Feb 20, 2026 &middot; 28 min</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <Ring v={92} sz={52} sw={3}/>
        <div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase"}}>Confidence</div><div style={{fontSize:17,fontWeight:800,color:"var(--gr)",fontFamily:"var(--m)"}}>96%</div></div>
        <Badge type="shortlisted"/>
        <div style={{display:"flex",gap:6}}><Btn variant="success" size="sm">Approve</Btn><Btn variant="danger" size="sm">Reject</Btn></div>
      </div>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:20}}>
      <div>
        <Card className="fi1" style={{marginBottom:14,padding:18}}>
          <h3 style={{fontSize:13,fontWeight:700,color:"var(--t2)",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em"}}>Competency Profile</h3>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
            {skills.map((s,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{height:70,display:"flex",alignItems:"end",justifyContent:"center",marginBottom:6}}>
                <div style={{width:24,borderRadius:"4px 4px 0 0",background:s.sc>=90?"var(--gr)":"var(--ac)",height:`${s.sc*0.7}px`,animation:`bf 0.8s cubic-bezier(0.16,1,0.3,1) ${i*0.08}s both`,boxShadow:s.sc>=90?"0 0 8px rgba(34,201,151,0.3)":"0 0 8px rgba(124,111,255,0.3)"}}/>
              </div>
              <div style={{fontSize:15,fontWeight:800,fontFamily:"var(--m)",color:s.sc>=90?"var(--gr)":"var(--ac)"}}>{s.sc}</div>
              <div style={{fontSize:10,color:"var(--t3)",fontWeight:500,marginTop:2}}>{s.nm.split(" ")[0]}</div>
            </div>)}
          </div>
        </Card>
        {skills.map((s,i)=>(
          <Card key={i} glow className={`fi${Math.min(i+2,6)}`} style={{marginBottom:8,cursor:"pointer"}} onClick={()=>setEx(ex===i?-1:i)}
            onMouseEnter={e=>{if(ex!==i){e.currentTarget.style.boxShadow="var(--shac)";e.currentTarget.style.borderColor="rgba(124,111,255,0.2)"}}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="var(--b1)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:s.sc>=90?"var(--grg)":"var(--acg)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:s.sc>=90?"var(--gr)":"var(--ac)",fontFamily:"var(--m)"}}>{s.sc}</div>
                <div><div style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>{s.nm}</div><div style={{fontSize:12,color:"var(--t3)"}}>Score: {s.sc}/100</div></div>
              </div>
              <div style={{transform:ex===i?"rotate(180deg)":"none",transition:"transform 0.2s",color:"var(--t3)"}}>{I.chevD}</div>
            </div>
            {ex===i&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--b1)"}} className="fi">
              <div style={{fontSize:11,fontWeight:700,color:"var(--ac)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>AI Rationale</div>
              <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.65,marginBottom:10}}>{s.ev}</p>
              <div style={{display:"flex",gap:6}}>
                <span style={{padding:"3px 10px",background:"var(--acg)",borderRadius:6,fontSize:11,fontWeight:600,color:"var(--ac)",cursor:"pointer"}}>View transcript evidence</span>
                <span style={{padding:"3px 10px",background:"var(--grg)",borderRadius:6,fontSize:11,fontWeight:600,color:"var(--gr)"}}>No risk flags</span>
              </div>
            </div>}
          </Card>
        ))}
      </div>
      <Card className="fi3" style={{padding:0,position:"sticky",top:20,maxHeight:"calc(100vh - 180px)",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 18px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:14,fontWeight:700}}>Transcript</span><span style={{fontFamily:"var(--m)",fontSize:11,fontWeight:600,color:"var(--t3)",padding:"2px 8px",background:"var(--s2)",borderRadius:4}}>28:14</span>
        </div>
        <div style={{flex:1,overflow:"auto",padding:14}}>
          {txts.map((m,i)=><div key={i} style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:m.who==="ai"?"var(--ac)":"var(--gr)",marginBottom:3,fontFamily:"var(--m)",display:"flex",alignItems:"center",gap:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>
              {m.who==="ai"?"Aria":"Sarah Chen"}<span style={{fontSize:10,color:"var(--t3)",fontWeight:400,textTransform:"none"}}>{`${Math.floor(i*4.5)}:${String((i*30)%60).padStart(2,"0")}`}</span>
            </div>
            <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>{m.msg}</div>
          </div>)}
        </div>
      </Card>
    </div>
  </Shell>;
};

// ═══════════════════════════════════════════
// RANKINGS
// ═══════════════════════════════════════════
const RankingsPage = ({go}) => {
  const [cm,setCm] = useState(false);
  const [sel,setSel] = useState([0,1]);
  return <Shell page="rankings" go={go} title="Candidate Rankings">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}} className="fi">
      <div style={{display:"flex",alignItems:"center",gap:10}}><h2 style={{fontSize:16,fontWeight:700}}>Senior Frontend Engineer</h2><Badge type="reviewed"/></div>
      <div style={{display:"flex",gap:8}}><Btn variant="ghost" size="sm" onClick={()=>setCm(!cm)}>{I.eye}<span>{cm?"Hide":"Compare"}</span></Btn><Btn variant="ghost" size="sm">Export</Btn></div>
    </div>
    <Card className="fi2" style={{padding:0,overflow:"hidden",marginBottom:cm?20:0}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"var(--bg2)"}}>
          {["#","Candidate","Score","Tech","Behav","Comm","Risk","Status",""].map((h,i)=><th key={i} style={{padding:"11px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid var(--b1)"}}>{h}</th>)}
        </tr></thead>
        <tbody>{cands.map((c,i)=><tr key={i} style={{borderBottom:"1px solid var(--b1)",cursor:"pointer",background:sel.includes(i)&&cm?"var(--acg2)":"transparent",transition:"background 0.15s"}}
          onClick={()=>{if(cm)setSel(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i].slice(-3));else go("evaluation")}}
          onMouseEnter={e=>{if(!cm||!sel.includes(i))e.currentTarget.style.background="var(--acg2)"}}
          onMouseLeave={e=>{if(!cm||!sel.includes(i))e.currentTarget.style.background="transparent"}}>
          <td style={{padding:"12px 14px"}}><span style={{fontSize:14,fontWeight:800,color:i<3?["#FFD700","#C0C0C0","#CD7F32"][i]:"var(--t3)"}}>{i+1}</span></td>
          <td style={{padding:"12px 14px"}}><div style={{display:"flex",alignItems:"center",gap:10}}>
            {cm&&<input type="checkbox" checked={sel.includes(i)} readOnly style={{accentColor:"var(--ac)"}}/>}
            <Av t={c.av} sz={30} c={["#7C6FFF","#22C997","#FFAD33","#EC4899","#6B6B8A"][i]}/>
            <div><div style={{fontSize:13,fontWeight:600}}>{c.nm}</div><div style={{fontSize:11,color:"var(--t3)"}}>{c.dt}</div></div>
          </div></td>
          <td style={{padding:"12px 14px"}}><div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:44,height:5,background:"var(--b1)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,background:c.sc>=80?"var(--gr)":c.sc>=60?"var(--am)":"var(--rd)",width:`${c.sc}%`,animation:"bf 0.8s ease both"}}/></div>
            <span style={{fontSize:14,fontWeight:800,fontFamily:"var(--m)",color:c.sc>=80?"var(--gr)":c.sc>=60?"var(--am)":"var(--rd)"}}>{c.sc}</span>
          </div></td>
          {["Tech","Behav","Comm"].map(sk=><td key={sk} style={{padding:"12px 14px",fontSize:13,fontWeight:600,fontFamily:"var(--m)",color:c.sk[sk]>=80?"var(--gr)":c.sk[sk]>=60?"var(--am)":"var(--rd)"}}>{c.sk[sk]}</td>)}
          <td style={{padding:"12px 14px"}}>{c.sc>=80?<Badge type="shortlisted"/>:c.sc>=60?<Badge type="pending"/>:<Badge type="rejected"/>}</td>
          <td style={{padding:"12px 14px"}}><Badge type={c.st}/></td>
          <td style={{padding:"12px 14px",color:"var(--t3)"}}>{I.arrowR}</td>
        </tr>)}</tbody>
      </table>
    </Card>
    {cm&&sel.length>=2&&<Card className="fis" style={{padding:22}}>
      <h3 style={{fontSize:15,fontWeight:700,marginBottom:18}}>Comparing: {sel.map(i=>cands[i].nm.split(" ")[0]).join(" vs ")}</h3>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${sel.length},1fr)`,gap:20}}>
        {sel.map(idx=>{const c=cands[idx];return <div key={idx}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><Av t={c.av} sz={34}/><div><div style={{fontWeight:700,fontSize:14}}>{c.nm}</div></div><Ring v={c.sc} sz={38} sw={2.5}/></div>
          {Object.entries(c.sk).map(([k,v],j)=><Bar key={k} label={k} value={v} dl={j}/>)}
        </div>})}
      </div>
    </Card>}
  </Shell>;
};

// ═══════════════════════════════════════════
// CANDIDATES
// ═══════════════════════════════════════════
const CandidatesPage = ({go}) => (
  <Shell page="candidates" go={go} title="Candidates">
    <div style={{display:"flex",gap:10,marginBottom:22}} className="fi">
      <input style={{flex:1,padding:"10px 14px",background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} placeholder="Search candidates..."/>
      {["All","Scheduled","Completed"].map((f,i)=><Btn key={i} variant={i===0?"primary":"ghost"} size="sm">{f}</Btn>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
      {cands.map((c,i)=>(
        <Card key={i} glow className={`fi${Math.min(i+1,6)}`} style={{cursor:"pointer",padding:18}} onClick={()=>go("evaluation")}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shac)";e.currentTarget.style.borderColor="rgba(124,111,255,0.2)"}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="var(--b1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <Av t={c.av} sz={38} c={["#7C6FFF","#22C997","#FFAD33","#EC4899","#6B6B8A"][i]}/>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{c.nm}</div><div style={{fontSize:12,color:"var(--t3)"}}>Sr. Frontend Engineer</div></div>
            <Ring v={c.sc} sz={40} sw={2.5}/>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12}}><Badge type={c.st}/><span style={{padding:"3px 8px",borderRadius:4,fontSize:11,fontWeight:500,fontFamily:"var(--m)",background:"var(--s2)",color:"var(--t3)"}}>{c.dt}</span></div>
          <Bar label="Technical" value={c.sk.Tech} dl={0}/><Bar label="Behavioral" value={c.sk.Behav} dl={1}/><Bar label="Communication" value={c.sk.Comm} dl={2}/>
        </Card>
      ))}
    </div>
  </Shell>
);

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
const SettingsPage = ({go}) => {
  const [tab,setTab] = useState("general");
  return <Shell page="settings" go={go} title="Settings">
    <div style={{display:"flex",gap:28}}>
      <div style={{width:180,flexShrink:0}}>
        {[{id:"general",l:"General"},{id:"team",l:"Team"},{id:"templates",l:"Templates"},{id:"ai",l:"AI Config"},{id:"brand",l:"Branding"},{id:"governance",l:"Governance"},{id:"integrations",l:"Integrations"}].map(t=>(
          <div key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 14px",borderRadius:"var(--r1)",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?"var(--ac2)":"var(--t3)",background:tab===t.id?"var(--acg)":"transparent",marginBottom:2,transition:"all 0.15s"}}>{t.l}</div>
        ))}
      </div>
      <div style={{flex:1}} key={tab} className="fis">
        {tab==="ai"&&<div>
          <h2 style={{fontSize:17,fontWeight:700,marginBottom:18}}>AI Configuration</h2>
          <Card style={{padding:22}}>
            <h3 style={{fontSize:13,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14}}>Interview Tone</h3>
            <div style={{display:"flex",gap:10,marginBottom:22}}>
              {[{l:"Professional",d:"Formal"},{l:"Conversational",d:"Warm and natural"},{l:"Challenging",d:"Rigorous probing"}].map((t,i)=>(
                <div key={i} style={{flex:1,padding:14,borderRadius:"var(--r2)",border:i===1?"2px solid var(--ac)":"1px solid var(--b1)",background:i===1?"var(--acg)":"var(--s1)",cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,color:i===1?"var(--ac)":"var(--t1)",marginBottom:3}}>{t.l}</div>
                  <div style={{fontSize:11,color:"var(--t3)"}}>{t.d}</div>
                </div>
              ))}
            </div>
            {[{l:"Formality",v:60},{l:"Probing Depth",v:75},{l:"Warmth",v:50},{l:"Pace",v:65}].map(s=><div key={s.l} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:500,color:"var(--t2)"}}>{s.l}</span><span style={{fontSize:12,fontFamily:"var(--m)",fontWeight:600,color:"var(--ac)"}}>{s.v}%</span></div>
              <div style={{height:5,background:"var(--b1)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${s.v}%`,background:"linear-gradient(90deg,var(--ac),var(--ac2))",borderRadius:3}}/></div>
            </div>)}
          </Card>
        </div>}
        {tab==="integrations"&&<div>
          <h2 style={{fontSize:17,fontWeight:700,marginBottom:18}}>Integrations</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{n:"Greenhouse",s:true,e:"\uD83C\uDF3F"},{n:"Lever",s:false,e:"\u26A1"},{n:"Google Calendar",s:true,e:"\uD83D\uDCC5"},{n:"Slack",s:false,e:"\uD83D\uDCAC"},{n:"Workday",s:false,e:"\uD83D\uDCCA"},{n:"BambooHR",s:false,e:"\uD83C\uDF8B"}].map(int=>(
              <Card key={int.n} glow style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{int.e}</span><div><div style={{fontSize:14,fontWeight:600}}>{int.n}</div><Badge type={int.s?"live":"pending"}/></div></div>
                <Btn variant={int.s?"ghost":"primary"} size="sm">{int.s?"Configure":"Connect"}</Btn>
              </Card>
            ))}
          </div>
        </div>}
        {tab==="general"&&<div>
          <h2 style={{fontSize:17,fontWeight:700,marginBottom:18}}>Organization</h2>
          <Card style={{padding:22}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[{l:"Company Name",v:"Acme Corp"},{l:"Industry",v:"Technology"},{l:"Company Size",v:"201-500"},{l:"Website",v:"acme.com"}].map(f=><div key={f.l}><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>{f.l}</label><input style={{width:"100%",padding:"11px 14px",background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:"var(--r1)",color:"var(--t1)",fontSize:13,fontFamily:"var(--f)",outline:"none"}} defaultValue={f.v}/></div>)}
            </div>
          </Card>
        </div>}
        {!["general","ai","integrations"].includes(tab)&&<Card style={{padding:36,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:14}}>{"⚙️"}</div>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>{tab.charAt(0).toUpperCase()+tab.slice(1)} Settings</h3>
          <p style={{fontSize:13,color:"var(--t3)"}}>{`Configure your ${tab} preferences here.`}</p>
        </Card>}
      </div>
    </div>
  </Shell>;
};

// ═══════════════════════════════════════════
// AUDIT
// ═══════════════════════════════════════════
const AuditPage = ({go}) => {
  const events=[
    {tp:"ai",a:"Score generated for Sarah Chen",d:"Overall: 92/100, Confidence: 96%",t:"2:47 PM",e:"\uD83C\uDFAF"},
    {tp:"human",a:"Jane Smith shortlisted Sarah Chen",d:"Override: None",t:"2:52 PM",e:"\u2705"},
    {tp:"ai",a:"Interview completed: Marcus Johnson",d:"Duration: 32 min, 14 questions",t:"1:15 PM",e:"\uD83C\uDFA4"},
    {tp:"ai",a:"Risk flag: Alex Rivera inconsistency",d:"Conflicting claims about team size",t:"11:30 AM",e:"\u26A0\uFE0F"},
    {tp:"system",a:"Rubric updated for Frontend Engineer",d:"System Design weight: 20% to 25%",t:"10:00 AM",e:"\uD83D\uDCCB"},
  ];
  return <Shell page="audit" go={go} title="Audit & Governance">
    <div style={{display:"flex",gap:8,marginBottom:20}} className="fi">
      {["All Events","AI Decisions","Human Actions","System"].map((f,i)=><Btn key={i} variant={i===0?"primary":"ghost"} size="sm">{f}</Btn>)}
      <div style={{flex:1}}/><Btn variant="ghost" size="sm">Export Report</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:20}}>
      <div>{events.map((ev,i)=>(
        <Card key={i} glow className={`fi${Math.min(i+1,6)}`} style={{marginBottom:8,padding:"14px 18px",cursor:"pointer"}}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--shac)";e.currentTarget.style.borderColor="rgba(124,111,255,0.2)"}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="var(--b1)"}}>
          <div style={{display:"flex",gap:12}}>
            <span style={{fontSize:18}}>{ev.e}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:14,fontWeight:600}}>{ev.a}</div><span style={{fontSize:11,fontFamily:"var(--m)",color:"var(--t3)",fontWeight:500}}>{ev.t}</span></div>
              <div style={{fontSize:12,color:"var(--t3)",marginTop:3}}>{ev.d}</div>
              <div style={{marginTop:8}}>
                <span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,
                  background:ev.tp==="ai"?"var(--acg)":ev.tp==="human"?"var(--grg)":"var(--amg)",
                  color:ev.tp==="ai"?"var(--ac2)":ev.tp==="human"?"var(--gr)":"var(--am)"}}>
                  {ev.tp==="ai"?"AI Decision":ev.tp==="human"?"Human Action":"System"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}</div>
      <Card className="fi4" style={{padding:0,position:"sticky",top:20}}>
        <div style={{padding:"12px 18px",borderBottom:"1px solid var(--b1)"}}><span style={{fontSize:14,fontWeight:700}}>AI Reasoning Trace</span></div>
        <div style={{padding:16}}>
          <p style={{fontSize:12,color:"var(--t3)",marginBottom:16}}>Select an AI decision to view its reasoning chain.</p>
          {[{s:"Input Analysis",d:"Parsed 14 responses across 5 competency areas"},{s:"Pattern Detection",d:"Identified strong system design knowledge"},{s:"Evidence Mapping",d:"Linked 8 transcript excerpts to rubric criteria"},{s:"Score Computation",d:"Weighted average: 92.4, rounded to 92"},{s:"Confidence",d:"High evidence density, consistent signals: 96%"}].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:"var(--acg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"var(--ac)"}}>{i+1}</div>
                {i<4&&<div style={{width:1,height:18,background:"var(--b1)",marginTop:4}}/>}
              </div>
              <div><div style={{fontSize:13,fontWeight:700,color:"var(--t1)"}}>{s.s}</div><div style={{fontSize:12,color:"var(--t3)",lineHeight:1.5}}>{s.d}</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </Shell>;
};

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("auth");
  return (
    <div style={{fontFamily:"var(--f)"}}>
      <style>{css}</style>
      {page==="auth"&&<AuthPage go={setPage}/>}
      {page==="dashboard"&&<DashboardPage go={setPage}/>}
      {page==="setup"&&<SetupPage go={setPage}/>}
      {page==="candidates"&&<CandidatesPage go={setPage}/>}
      {page==="lobby"&&<LobbyPage go={setPage}/>}
      {page==="interview"&&<InterviewPage go={setPage}/>}
      {page==="processing"&&<ProcessingPage go={setPage}/>}
      {page==="evaluation"&&<EvaluationPage go={setPage}/>}
      {page==="rankings"&&<RankingsPage go={setPage}/>}
      {page==="settings"&&<SettingsPage go={setPage}/>}
      {page==="audit"&&<AuditPage go={setPage}/>}
    </div>
  );
}
