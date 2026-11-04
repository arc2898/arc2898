const THEMES = [
  {id:"liquid",label:"Liquid glass"},
  {id:"minimal",label:"Minimalism"},
  {id:"neo",label:"Neomorphism"},
  {id:"skeuo",label:"Skeuomorphism"},
  {id:"tinted",label:"Tinted glass"},
  {id:"glass",label:"Glassmorphism"},
  {id:"burst",label:"Neo burst"},
  {id:"campus",label:"Campus ’04"},
  {id:"pixel",label:"Pixel"},
  {id:"future",label:"Futuristic"}
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const db = {profile:null,repos:[],events:[],snapshots:[],loadedAt:null};
let currentTheme = THEMES[Math.floor(Math.random()*THEMES.length)].id;
let threeState = null;
let glitchTimer = null;
let spark = null;
const NAV = [["about","About"],["repos","Repos"],["stack","Stack"],["now","Now"],["done","Done"],["updates","Updates"],["visuals","Shots"]];
const SCREENSHOTS = [
  ["Universal Package Manager","upm"],
  ["Self-hosted dashboard","selfhost-dashboard"],
  ["WinIsland","winisland"],
  ["Termimg / Linux","termimg"],
  ["Android projects","android"],
  ["Windows projects","windows"],
  ["rEFInd GUI","refind-gui"],
  ["ShareXF","sharexf"]
];
const PROJECTS = [
  ["Universal Package Manager","One Go interface for common package-management workflows across operating systems. Safer validation, predictable execution and automated cross-platform checks.","arc2898/Universal-Package-Manager"],
  ["Self-hosted server dashboard","A private Node.js dashboard for system monitoring, file management, media streaming and a browser terminal, with security hardening.","arc2898/selfhost-dashboard"],
  ["WinIsland","An experiment in bringing a useful dynamic-island style experience to Windows.","arc2898/WinIsland"],
  ["Termimg / Linux","Terminal-based image and video playback experiments and Linux tooling.","arc2898/Linux"]
];
const MILESTONES = [
  ["01","Universal Package Manager","A Go CLI that brings multiple package managers behind one consistent interface, with validation and safer command behaviour."],
  ["02","Security hardening","Hardened upload handling, ZIP extraction, path validation, WebSocket origin checks and process controls in the self-hosted dashboard."],
  ["03","Cross-platform checks","Expanded automated tests, static analysis and build verification across Linux, macOS and Windows."],
  ["04","Windows interface experiments","Exploring a useful dynamic-island experience with WinIsland."],
  ["05","Systems curiosity","Working across Android, Windows and Linux, including low-level and operating-system projects."]
];
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const fmt = value => Number(value||0).toLocaleString("en-US");
const shortDate = value => value ? new Date(value).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}) : "—";
const since = value => {
  if(!value) return "date unknown";
  const ms = Math.max(0,Date.now()-new Date(value).getTime());
  const days = Math.floor(ms/86400000);
  if(days===0) return "today";
  if(days===1) return "yesterday";
  if(days<30) return days+" days ago";
  if(days<365) return Math.floor(days/30)+" months ago";
  return Math.floor(days/365)+" years ago";
};
function themeOptions(){
  return THEMES.map(t=>'<option value="'+t.id+'" '+(t.id===currentTheme?'selected':'')+'>'+t.label+'</option>').join("");
}
function controlPanel(){
  return '<div class="head-tools"><span class="clock-readout" id="clock">--:--:--</span><select class="theme-select" id="theme-select" aria-label="Change the complete visual theme">'+themeOptions()+'</select><button class="shuffle-btn" id="shuffle-theme" type="button" title="Choose another random theme">↻ Shuffle</button></div>';
}
function header(theme){
  const brand = '<a class="brand" href="#top" aria-label="arc home"><span class="brand-mark">a.</span><span>arc2898</span><small>/ profile system</small></a>';
  const nav = '<nav class="main-nav" aria-label="Main navigation">'+NAV.map((x,i)=>'<a href="#'+x[0]+'"><span>'+String(i+1).padStart(2,"0")+'</span> '+x[1]+'</a>').join("")+'</nav>';
  if(theme==="campus"){
    return '<div class="campus-browser"><span>arc2898 / personal profile</span><span>THE CAMPUS WEB · THEFACEBOOK ERA / FEBRUARY 2004</span><span>FILE　EDIT　VIEW　FAVORITES　HELP</span></div><header class="masthead campus-masthead">'+brand+'<span class="campus-network-label">MEMBER DIRECTORY / 0002898</span>'+nav+controlPanel()+'</header><div class="campus-address"><span>Location:</span><code>https://campus.example/member/arc2898</code><b>GO</b></div>';
  }
  const extras = theme==="burst" ? '<span class="head-sticker">INDEPENDENT / EST. 2026</span>' : theme==="pixel" ? '<span class="pixel-online">● ONLINE</span>' : theme==="future" ? '<span class="telemetry-light">SYS / ACTIVE</span>' : theme==="skeuo" ? '<span class="screw-head">✣</span>' : "";
  return '<header class="masthead '+theme+'-masthead">'+brand+extras+nav+controlPanel()+'</header>';
}
function actionLinks(){
  return '<div class="hero-actions"><a class="action primary" href="#repos">Explore the work <span>↘</span></a><a class="action" href="https://github.com/arc2898" target="_blank" rel="noreferrer">Open GitHub ↗</a></div>';
}
function hero(theme){
  const tag = '<div class="eyebrow">Independent developer · systems curious · open to experiments</div>';
  const title = '<h1>Ideas into <em>systems.</em></h1>';
  const copy = '<p class="hero-copy">I’m arc — a solo developer building applications, command-line tools and interface experiments across Android, Windows and Linux. Curious about the low-level details, serious about making useful things.</p>';
  const art = '<div class="hero-art" aria-hidden="true"><div class="liquid-lens"></div><span class="floating-chip one">BUILD / BREAK</span><span class="floating-chip two">SYSTEMS × UI</span><span class="floating-chip three">OPEN ENDED</span><span class="art-label">ARC / 2898 — LIVE SIGNAL</span></div>';
  if(theme==="minimal"){
    return '<section class="hero minimal-hero" id="top"><div class="minimal-index">PERSONAL INDEX　/　2026<br>INDEPENDENT DEVELOPER</div><div>'+tag+title+copy+actionLinks()+'<div class="hero-meta"><span>BASED IN CURIOSITY</span><b>·</b><span>CODE / SYSTEMS / INTERFACES</span></div></div>'+art+'</section><aside class="minimal-rail"><span>INDEX</span>'+NAV.map(x=>'<a href="#'+x[0]+'">'+x[1]+'</a>').join("")+'</aside>';
  }
  if(theme==="burst"){
    return '<section class="hero brutal-hero" id="top"><div class="brutal-stamp">THE PERSONAL<br>DEV ARCHIVE<br>№ 02898</div><div>'+tag+'<h1>MAKE<br>IT <em>WORK.</em><br>MAKE IT<br>MATTER.</h1>'+copy+actionLinks()+'</div><div class="brutal-art"><div class="paper-back">ARC<br>2898</div><div class="paper-front">IDEAS<br>→<br>TOOLS</div><span class="paper-star">✳</span><span class="paper-note">NO TEMPLATE<br>NO SHORTCUTS</span></div><span class="brutal-bottom">DIGITAL OBJECTS / HUMAN CURIOSITY / CONTINUOUS ITERATION</span></section>';
  }
  if(theme==="skeuo"){
    return '<section class="hero skeuo-hero" id="top"><div class="hardware-copy">'+tag+title+copy+actionLinks()+'</div><div class="device-stage"><div class="device-screen"><div class="device-screen-top"><span>ARC INTERFACE</span><span>READY ●</span></div><div class="device-display"><span class="display-small">SYSTEM PROFILE</span><b>ARC<span>2898</span></b><i>BUILD / EXPLORE / REPEAT</i></div><div class="device-controls"><span class="knob">◉</span><span class="knob">◉</span><span class="toggle">ON</span></div></div><div class="device-foot">SOLID STATE / 001</div></div></section>';
  }
  if(theme==="neo"){
    return '<section class="hero soft-hero" id="top"><div>'+tag+title+copy+actionLinks()+'</div><div class="soft-dock"><div class="soft-icon">a.</div><div class="soft-dock-label">A SPACE TO BUILD</div><div class="soft-keys"><span>◌</span><span>⌘</span><span>↗</span></div></div></section>';
  }
  if(theme==="tinted"){
    return '<section class="hero tinted-hero" id="top"><div class="tinted-copy">'+tag+title+copy+actionLinks()+'</div><div class="tint-stack"><div class="tint-pane pane-a"></div><div class="tint-pane pane-b"></div><div class="tint-pane pane-c"></div><span class="tint-caption">COLOR / LIGHT / DEPTH</span></div></section>';
  }
  if(theme==="glass"){
    return '<section class="hero prism-hero" id="top"><div class="prism-copy">'+tag+title+copy+actionLinks()+'</div><div class="glass-gallery"><div class="glass-card gc-one"></div><div class="glass-card gc-two"></div><div class="glass-card gc-three"></div><span class="glass-caption">REFRACTION STUDY / 01</span></div></section>';
  }
  if(theme==="pixel"){
    return '<section class="hero pixel-hero" id="top"><div class="pixel-hero-copy"><div class="pixel-status">PLAYER 01　/　STATUS: BUILDING</div>'+tag+'<h1>HELLO,<br>I’M <em>ARC.</em></h1>'+copy+actionLinks()+'</div><div class="pixel-world"><div class="pixel-sun"></div><div class="pixel-mountain"></div><div class="pixel-sprite"><i></i><i></i><i></i><i></i></div><span class="pixel-world-label">WORLD 2898 · LEVEL 01</span></div><div class="pixel-bottom-line">▰▰▰▱▱ EXPERIENCE POINTS　　NEXT LEVEL: KEEP BUILDING</div></section>';
  }
  if(theme==="campus"){
    return '<section class="hero campus-hero" id="top"><div class="campus-era-line"><span>THE CAMPUS NETWORK / MEMBER PROFILE</span><span>THEFACEBOOK LAUNCH ERA · 04 FEB 2004</span></div><div class="campus-profile-grid"><aside class="campus-profile-side"><div class="campus-avatar-frame"><img id="campus-avatar" src="https://avatars.githubusercontent.com/u/329584786?v=4" alt="arc profile"></div><b class="campus-side-name">arc2898</b><span class="campus-online"><i></i> online now</span><hr><a href="#about">View profile</a><a href="#repos">My projects</a><a href="#visuals">Photo / screenshots</a><a href="mailto:rc002898@gmail.com">Send a message</a><div class="campus-side-foot">MEMBER ID: 02898</div></aside><div class="campus-profile-main"><div class="campus-profile-kicker">PERSONAL PROFILE <span>·</span> INDEPENDENT DEVELOPER</div><h1>arc<span>2898</span></h1><p class="hero-copy">Building useful software, exploring operating systems, and learning by making things. A small collection of tools, interface experiments, and systems work.</p><div class="campus-facts"><div><b>INTERESTS</b><span>Systems · CLI · GUI · OS</span></div><div><b>WORKING WITH</b><span>Go · Rust · Dart · JavaScript</span></div><div><b>STATUS</b><span>Building / experimenting</span></div></div>'+actionLinks()+'<div class="campus-profile-note">A personal corner of the early social web. No feed algorithm — just projects, notes, and links.</div></div><aside class="campus-network-side"><div class="campus-side-box"><b>QUICK LINKS</b><a href="https://github.com/arc2898" target="_blank" rel="noreferrer">GitHub profile ↗</a><a href="https://x.com/arc3338" target="_blank" rel="noreferrer">X / @arc3338 ↗</a><a href="https://tryhackme.com/p/shikarin1113" target="_blank" rel="noreferrer">TryHackMe ↗</a></div><div class="campus-side-box campus-side-status"><b>WHAT I’M INTO</b><span>Cross-platform tools</span><span>Linux and Windows</span><span>Low-level engineering</span><span>Useful interfaces</span></div></aside></div><div class="campus-footer-rule"><span>WELCOME TO MY PAGE</span><span>LAST UPDATED: WEEKLY</span></div></section>';
  }
  if(theme==="future"){
    return '<section class="hero hud-hero" id="top"><div class="hud-copy">'+tag+'<div class="hud-overline">IDENTITY / ARC-2898 / NODE 01</div>'+title+copy+actionLinks()+'<div class="hero-meta"><span><i class="tick-dot"></i> PROFILE UPLINK</span><span>LATENCY <b>LIVE</b></span><span>DATA SOURCE <b>GITHUB API</b></span></div></div><div class="hud-radar"><div class="radar-rings"><i></i><i></i><i></i><b>ARC</b></div><span class="radar-coordinate">X: 28.98　Y: 01.00</span><span class="radar-mark">SIGNAL FOUND</span></div></section>';
  }
  return '<section class="hero liquid-hero" id="top"><div>'+tag+title+copy+actionLinks()+'<div class="hero-meta"><span><i class="tick-dot"></i> PUBLIC PROFILE / ACTIVE</span><span>BUILT WITH CURIOSITY</span></div></div>'+art+'</section>';
}
function sectionIntro(num,title,desc){
  return '<div class="section-heading"><div><span class="section-kicker">'+num+' / '+title+'</span><h2>'+title+'</h2></div><p>'+desc+'</p></div>';
}
function wrapSection(theme,id,num,title,desc,body){
  const intro = sectionIntro(num,title,desc);
  if(theme==="burst") return '<section id="'+id+'" class="profile-section reveal"><div class="paper-section"><div class="paper-index">'+num+' / INDEX</div>'+intro+body+'</div></section>';
  if(theme==="pixel") return '<section id="'+id+'" class="profile-section reveal"><div class="pixel-window"><div class="pixel-window-bar"><b>'+title.toUpperCase()+'</b><span>□　×</span></div>'+intro+body+'<div class="pixel-window-foot">END OF BLOCK // '+num+'</div></div></section>';
  if(theme==="campus") return '<section id="'+id+'" class="profile-section reveal campus-module"><div class="campus-module-head"><b>'+num+' / '+title.toUpperCase()+'</b><span>MEMBER DIRECTORY</span></div><div class="campus-module-body">'+intro+body+'</div></section>';
  if(theme==="future") return '<section id="'+id+'" class="profile-section reveal"><div class="hud-frame"><div class="hud-frame-label">MODULE '+num+' / '+title.toUpperCase()+'</div><div class="hud-corner tl"></div><div class="hud-corner tr"></div><div class="hud-corner bl"></div><div class="hud-corner br"></div>'+intro+body+'</div></section>';
  if(theme==="skeuo") return '<section id="'+id+'" class="profile-section reveal"><div class="metal-panel"><div class="metal-panel-top"><span>✣　MODULE '+num+'</span><span>● READY</span></div>'+intro+body+'</div></section>';
  if(theme==="minimal") return '<section id="'+id+'" class="profile-section reveal"><div class="minimal-section-number">'+num+'</div>'+intro+body+'</section>';
  if(theme==="neo") return '<section id="'+id+'" class="profile-section reveal"><div class="neo-section-surface">'+intro+body+'</div></section>';
  if(theme==="tinted") return '<section id="'+id+'" class="profile-section reveal"><div class="tinted-section-surface">'+intro+body+'</div></section>';
  if(theme==="glass") return '<section id="'+id+'" class="profile-section reveal"><div class="glass-section-pane">'+intro+body+'</div></section>';
  return '<section id="'+id+'" class="profile-section reveal"><div class="section-inner">'+intro+body+'</div></section>';
}
function aboutBody(){
  return '<div class="about-layout"><article class="surface about-bio"><img class="avatar" id="avatar" src="https://avatars.githubusercontent.com/u/329584786?v=4" alt="arc GitHub avatar"><div><h3 class="bio-title" id="profile-name">arc / independent developer</h3><p class="bio-text">A small solo developer interested in building CLI and GUI applications or tools for Android, Windows and Linux. Also interested in low-level engineering and operating-system work.</p><div class="bio-focus"><span class="tag">Go</span><span class="tag">Rust</span><span class="tag">Dart</span><span class="tag">JavaScript</span><span class="tag">Systems</span><span class="tag">Cross-platform</span></div><div class="social-row"><a class="social-link" href="https://github.com/arc2898" target="_blank" rel="noreferrer">GitHub ↗</a><a class="social-link" href="mailto:rc002898@gmail.com">Gmail ↗</a><a class="social-link" href="https://x.com/arc3338" target="_blank" rel="noreferrer">X · @arc3338 ↗</a><a class="social-link" href="https://tryhackme.com/p/shikarin1113" target="_blank" rel="noreferrer">TryHackMe · shikarin1113 ↗</a></div></div></article><div class="stats-grid"><article class="surface stat-tile"><strong id="stat-repos">—</strong><span>Public repositories</span></article><article class="surface stat-tile"><strong id="stat-followers">—</strong><span>Followers</span></article><article class="surface stat-tile"><strong id="stat-stars">—</strong><span>Stars earned</span></article><article class="surface stat-tile"><strong id="stat-forks">—</strong><span>Repository forks</span></article></div></div>';
}
function reposBody(){
  return '<div class="repo-toolbar"><input class="repo-search" id="repo-search" placeholder="Find a repository…" aria-label="Search repositories"><select class="repo-filter" id="repo-sort" aria-label="Sort repositories"><option value="updated">Recently updated</option><option value="stars">Most stars</option><option value="name">Name A–Z</option></select><select class="repo-filter" id="repo-language" aria-label="Filter by language"><option value="all">All languages</option></select></div><div class="repo-grid" id="repo-grid"><div class="data-empty">Establishing GitHub connection…</div></div><p class="hero-tag" id="repo-counter" style="margin-top:16px">PUBLIC REPOSITORIES / LOADING</p>';
}
function stackBody(){
  return '<div class="stack-grid" id="stack-grid"><div class="data-empty">Reading language metadata…</div></div><p class="hero-tag" style="margin-top:17px">LANGUAGE COUNTS REFLECT PUBLIC REPOSITORIES, NOT SKILL RATINGS.</p>';
}
function nowBody(){
  return '<div class="live-layout"><article class="surface feed-panel"><h3 class="panel-title">Recent public activity <span class="live-badge"><i class="tick-dot"></i> LIVE FEED</span></h3><div id="activity-list"><div class="data-empty">Waiting for public GitHub events…</div></div></article><article class="surface feed-panel"><h3 class="panel-title">What is going on <span class="live-badge">CURRENT FOCUS</span></h3><div class="focus-item"><span class="focus-icon">◈</span><div><b>Building useful software</b><p>Working across CLI utilities, desktop interfaces, Android apps and systems experiments.</p></div></div><div class="focus-item"><span class="focus-icon">◈</span><div><b>Exploring the lower layers</b><p>Operating systems, developer tooling, Linux workflows and the details beneath the interface.</p></div></div><div class="focus-item"><span class="focus-icon">◈</span><div><b>Latest data sync</b><p id="last-sync">Waiting for GitHub…</p></div></div></article></div>';
}
function doneBody(theme){
  return '<div class="done-grid">'+MILESTONES.map((p,i)=>'<article class="surface done-card"><span class="done-no">'+p[0]+' / '+(i+1===5?"ONGOING":"SHIPPED WORK")+'</span><h3>'+p[1]+'</h3><p>'+p[2]+'</p></article>').join("")+'</div>';
}
function updatesBody(){
  return '<div class="updates-grid" id="updates-grid"><div class="data-empty">The first public snapshot will appear after the weekly refresh.</div></div><p class="hero-tag" style="margin-top:17px">WEEKLY SNAPSHOTS · PUBLIC METADATA ONLY · NO FABRICATED TRAFFIC FIGURES</p>';
}
function galleryBody(theme){
  const orders = {
    liquid:["winisland","upm","selfhost-dashboard","termimg","android","windows","sharexf","refind-gui"],
    minimal:["upm","selfhost-dashboard","winisland","termimg","refind-gui","sharexf","android","windows"],
    neo:["android","upm","windows","winisland","sharexf","selfhost-dashboard","termimg","refind-gui"],
    skeuo:["termimg","refind-gui","windows","android","selfhost-dashboard","upm","winisland","sharexf"],
    tinted:["winisland","android","upm","sharexf","selfhost-dashboard","windows","refind-gui","termimg"],
    glass:["selfhost-dashboard","winisland","upm","android","termimg","sharexf","windows","refind-gui"],
    burst:["android","winisland","termimg","upm","windows","refind-gui","selfhost-dashboard","sharexf"],
    campus:["upm","selfhost-dashboard","winisland","android","windows","termimg","refind-gui","sharexf"],
    pixel:["termimg","winisland","upm","android","refind-gui","windows","sharexf","selfhost-dashboard"],
    future:["selfhost-dashboard","upm","refind-gui","winisland","termimg","sharexf","android","windows"]
  };
  const lookup = new Map(SCREENSHOTS.map(s=>[s[1],s]));
  const selected = (orders[theme]||SCREENSHOTS.map(s=>s[1])).map(id=>lookup.get(id)).filter(Boolean);
  return '<div class="gallery-grid gallery-'+theme+'" id="gallery-grid">'+selected.map((s,i)=>'<article class="surface shot-card" data-shot="'+s[1]+'"><div class="shot-preview" id="shot-'+s[1]+'"><span>0'+(i+1)+' · IMAGE SLOT</span></div><b>'+s[0]+'</b><small>assets/screenshots/'+s[1]+'.webp</small></article>').join("")+'</div>';
}

function footer(){
  return '<footer class="site-footer"><span>© '+new Date().getFullYear()+' ARC2898 / BUILT WITH CURIOSITY</span><span id="footer-status"><i class="tick-dot"></i> CONNECTING TO PUBLIC DATA</span><span class="footer-links"><a href="https://github.com/arc2898" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="#top">BACK TO TOP ↑</a></span></footer>';
}
function ticker(theme){
  const txt = "BUILDING TOOLS　✳　EXPLORING SYSTEMS　✳　OPEN SOURCE　✳　LOW LEVEL CURIOSITY　✳　CLI / GUI / OS　✳　";
  if(theme==="campus") return '<div class="ticker campus-ticker"><div class="marquee"><span>✦ WELCOME TO THE CAMPUS WEB ✦ PERSONAL PAGES · PROJECTS · LINKS · NOTES · UPDATED WEEKLY ✦</span></div></div>';
  if(theme==="pixel") return '<div class="ticker"><div class="marquee"><span>▰▰▱▱　PLAYER 01　✦　QUEST: BUILD SOMETHING USEFUL　✦　SAVE POINT: GITHUB　　</span></div></div>';
  if(theme==="future") return '<div class="ticker"><div class="marquee"><span>SYS.STATUS: NOMINAL　/　SIGNAL: ACTIVE　/　DATA: PUBLIC　/　'+txt+'</span></div></div>';
  return '<div class="ticker"><div class="ticker-track">'+(txt+txt+txt)+'</div></div>';
}
function renderTheme(theme, restoreId){
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  $("#app").innerHTML = '<div class="site-shell '+theme+'-site">'+header(theme)+hero(theme)+ticker(theme)+'<main class="wrap content-flow">'+
    wrapSection(theme,"about","01","About","The person and interests behind the projects.",aboutBody())+
    wrapSection(theme,"repos","02","Repositories","Public repositories and their live GitHub metadata. Private projects stay private.",reposBody())+
    wrapSection(theme,"stack","03","Tech stack","Languages discovered from public repository metadata; presence, not proficiency.",stackBody())+
    wrapSection(theme,"now","04","What is going on","Recent public GitHub events and the current areas of focus.",nowBody())+
    wrapSection(theme,"done","05","What was done","Selected engineering work and project milestones.",doneBody(theme))+
    wrapSection(theme,"updates","06","Updates","Weekly snapshots plus the latest visible changes.",updatesBody())+
    wrapSection(theme,"visuals","07","Project screenshots","Eight individual frames ready for screenshots, added one by one.",galleryBody(theme))+
    '</main>'+footer()+'</div>';
  bindThemeControls();
  bindRepoControls();
  bindReveal();
  paintData();
  setSceneTheme(theme);
  updateClock();
  if(restoreId){setTimeout(()=>{const el=document.getElementById(restoreId);if(el)el.scrollIntoView({behavior:"instant",block:"start"});},40);}
  else window.scrollTo({top:0,behavior:"instant"});
}
function activeSection(){
  const sections = $$(".profile-section");
  const found = sections.find(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight*.45 && r.bottom>innerHeight*.45;});
  return found?.id || null;
}
function changeTheme(theme){
  if(!THEMES.some(t=>t.id===theme)) return;
  if(theme===currentTheme) return;
  const anchor = activeSection();
  const curtain = $("#transition-curtain");
  if(curtain) curtain.classList.add("active");
  setTimeout(()=>{
    renderTheme(theme,anchor);
    const nextCurtain=$("#transition-curtain");
    if(nextCurtain){nextCurtain.classList.remove("active");}
    flashGlitch();
  },180);
}
function bindThemeControls(){
  const select=$("#theme-select");
  if(select)select.addEventListener("change",()=>changeTheme(select.value));
  const shuffle=$("#shuffle-theme");
  if(shuffle)shuffle.addEventListener("click",()=>{
    const choices=THEMES.filter(t=>t.id!==currentTheme);
    changeTheme(choices[Math.floor(Math.random()*choices.length)].id);
  });
  $$(".main-nav a").forEach(a=>a.addEventListener("click",()=>a.classList.add("clicked")));
}
function bindRepoControls(){
  const search=$("#repo-search"),sort=$("#repo-sort"),language=$("#repo-language");
  if(search)search.addEventListener("input",renderRepos);
  if(sort)sort.addEventListener("change",renderRepos);
  if(language)language.addEventListener("change",renderRepos);
}
function bindReveal(){
  const nodes=$$(".reveal");
  if(!("IntersectionObserver" in window)){nodes.forEach(n=>n.classList.add("in-view"));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target);}
  }),{threshold:.1});
  nodes.forEach((node,i)=>{node.classList.toggle(i%2?"from-right":"from-left",currentTheme!=="campus"&&currentTheme!=="pixel");observer.observe(node);});
}
function paintData(){
  if(!db.profile && !db.repos.length)return;
  const p=db.profile||{};
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set("profile-name",(p.name||"arc")+" / @arc2898");
  const avatar=$("#avatar");if(avatar&&p.avatar_url)avatar.src=p.avatar_url;
  const campusAvatar=$("#campus-avatar");if(campusAvatar&&p.avatar_url)campusAvatar.src=p.avatar_url;
  set("stat-repos",fmt(db.repos.length));
  set("stat-followers",fmt(p.followers));
  set("stat-stars",fmt(db.repos.reduce((sum,r)=>sum+(r.stargazers_count||0),0)));
  set("stat-forks",fmt(db.repos.reduce((sum,r)=>sum+(r.forks_count||0),0)));
  renderRepos();
  renderStack();
  renderActivity();
  renderUpdates();
  set("last-sync",db.loadedAt?db.loadedAt.toLocaleString():"Waiting for GitHub…");
  const status=$("#footer-status");
  if(status)status.innerHTML='<i class="tick-dot"></i> GITHUB PUBLIC API / '+(db.loadedAt?"SYNCED "+db.loadedAt.toLocaleTimeString():"LOADING");
}
function renderRepos(){
  const grid=$("#repo-grid");if(!grid)return;
  const search=($("#repo-search")?.value||"").trim().toLowerCase();
  const sort=$("#repo-sort")?.value||"updated";
  const lang=$("#repo-language")?.value||"all";
  let repos=db.repos.filter(r=>(r.name+" "+(r.description||"")+" "+(r.language||"")).toLowerCase().includes(search)&&(lang==="all"||r.language===lang));
  repos.sort((a,b)=>sort==="stars"?(b.stargazers_count-a.stargazers_count):sort==="name"?a.name.localeCompare(b.name):new Date(b.pushed_at||b.updated_at)-new Date(a.pushed_at||a.updated_at));
  if(!repos.length){grid.innerHTML='<div class="data-empty">No matching repositories. Change the filters and try again.</div>';}
  else grid.innerHTML=repos.map((r,i)=>
    '<article class="surface repo-card reveal in-view" style="--card-index:'+i+'"><div class="repo-topline"><span class="repo-name">'+esc(r.name)+'</span><a class="repo-open" href="'+esc(r.html_url)+'" target="_blank" rel="noreferrer" aria-label="Open '+esc(r.name)+' on GitHub">↗</a></div><p class="repo-description">'+esc(r.description||"No description added yet.")+'</p><div class="repo-data"><span><i class="lang-dot"></i>'+esc(r.language||"Unspecified")+'</span><span>★ '+fmt(r.stargazers_count)+'</span><span>⑂ '+fmt(r.forks_count)+'</span><span>'+esc(r.license?.spdx_id||"No license")+'</span></div><div class="repo-updated">Updated '+since(r.updated_at)+' · '+shortDate(r.updated_at)+'</div></article>'
  ).join("");
  const counter=$("#repo-counter");
  if(counter)counter.textContent=repos.length+" SHOWN / "+db.repos.length+" PUBLIC REPOSITORIES · SORT: "+sort.toUpperCase();
  const languages=[...new Set(db.repos.map(r=>r.language).filter(Boolean))].sort();
  const select=$("#repo-language");
  if(select){
    const selected=select.value||"all";
    select.innerHTML='<option value="all">All languages</option>'+languages.map(l=>'<option value="'+esc(l)+'">'+esc(l)+'</option>').join("");
    select.value=languages.includes(selected)?selected:"all";
  }
}
function renderStack(){
  const node=$("#stack-grid");if(!node)return;
  const counts={};
  db.repos.forEach(r=>{if(r.language)counts[r.language]=(counts[r.language]||0)+1;});
  const list=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!list.length){node.innerHTML='<div class="data-empty">Language metadata is unavailable.</div>';return;}
  const max=Math.max(...list.map(x=>x[1]));
  node.innerHTML=list.map(([name,count])=>'<article class="surface stack-card"><span class="stack-name">'+esc(name)+'</span><span class="stack-count">'+count+' public '+(count===1?"repository":"repositories")+'</span><div class="stack-meter"><i style="width:'+(count/max*100)+'%"></i></div></article>').join("");
}
function eventDescription(event){
  const actor=event.actor?.login||"Someone",repo=event.repo?.name||"GitHub";
  const action=event.payload?.action;
  switch(event.type){
    case "PushEvent": return actor+" pushed "+(event.payload?.commits?.length||1)+" commit(s) to "+repo;
    case "CreateEvent": return actor+" created "+(event.payload?.ref_type||"a ref")+" in "+repo;
    case "DeleteEvent": return actor+" deleted "+(event.payload?.ref_type||"a ref")+" in "+repo;
    case "PullRequestEvent": return actor+" "+(action||"updated")+" a pull request in "+repo;
    case "IssuesEvent": return actor+" "+(action||"updated")+" an issue in "+repo;
    case "WatchEvent": return actor+" starred "+repo;
    case "ForkEvent": return actor+" forked "+repo;
    case "ReleaseEvent": return actor+" published a release in "+repo;
    default:return actor+" · "+event.type.replace("Event","")+" · "+repo;
  }
}
function renderActivity(){
  const node=$("#activity-list");if(!node)return;
  if(!db.events.length){node.innerHTML='<div class="data-empty">No recent public events were returned by GitHub.</div>';return;}
  node.innerHTML=db.events.slice(0,9).map(e=>'<div class="activity-item"><time>'+shortDate(e.created_at)+'</time><p>'+esc(eventDescription(e))+'</p></div>').join("");
}
function renderUpdates(){
  const node=$("#updates-grid");if(!node)return;
  const snapshots=db.snapshots.slice().sort((a,b)=>b.weekOf.localeCompare(a.weekOf));
  if(snapshots.length){
    node.innerHTML=snapshots.slice(0,6).map((s,i)=>
      '<article class="surface update-card"><span class="update-date">WEEK OF '+shortDate(s.weekOf)+'</span><h3>'+fmt(s.publicRepos)+' public repositories</h3><p>'+fmt(s.stars)+' stars · '+fmt(s.forks)+' forks · '+fmt(s.followers)+' followers<br>Captured '+shortDate(s.capturedAt)+'</p></article>'
    ).join("");
  }else{
    const buckets={};
    db.events.forEach(e=>{
      const d=new Date(e.created_at), monday=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-((d.getUTCDay()+6)%7)));
      const key=monday.toISOString().slice(0,10);buckets[key]=(buckets[key]||0)+1;
    });
    const weeks=Object.entries(buckets).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,3);
    node.innerHTML=(weeks.map(([week,count])=>'<article class="surface update-card"><span class="update-date">WEEK OF '+shortDate(week)+'</span><h3>'+count+' public events</h3><p>Activity observed in GitHub’s limited public events feed. This is not a complete contribution history.</p></article>').join(""))+
      '<article class="surface update-card"><span class="update-date">WEEKLY ARCHIVE</span><h3>First snapshot pending</h3><p>The scheduled job records public repository totals every Monday. No views or traffic numbers are fabricated.</p></article>';
  }
}
function imageFrames(){
  SCREENSHOTS.forEach(([title,key])=>{
    const slot=$("#shot-"+key);if(!slot)return;
    const img=new Image();img.alt=title+" screenshot";img.loading="lazy";img.src="./assets/screenshots/"+key+".webp";
    img.onload=()=>{slot.innerHTML="";slot.appendChild(img);};
    img.onerror=()=>{};
  });
}
async function getJson(url){
  const response=await fetch(url,{headers:{Accept:"application/vnd.github+json"}});
  if(!response.ok)throw new Error("GitHub API "+response.status);
  return response.json();
}
async function loadProfile(){
  try{
    const [profile,repos,events]=await Promise.all([
      getJson("https://api.github.com/users/arc2898"),
      getJson("https://api.github.com/users/arc2898/repos?type=owner&sort=updated&per_page=100"),
      getJson("https://api.github.com/users/arc2898/events/public?per_page=30")
    ]);
    db.profile=profile;db.repos=repos.filter(r=>!r.private);db.events=events;db.loadedAt=new Date();
    paintData();
  }catch(error){
    const status=$("#footer-status");
    if(status)status.textContent="GITHUB API UNAVAILABLE · RETRY LATER";
    const grid=$("#repo-grid");if(grid)grid.innerHTML='<div class="data-empty">Could not load GitHub right now ('+esc(error.message)+'). Reload the page to retry.</div>';
    const activity=$("#activity-list");if(activity)activity.innerHTML='<div class="data-empty">Public activity could not be loaded.</div>';
  }
  try{
    const weekly=await fetch("./data/weekly.json",{cache:"no-store"});
    if(weekly.ok){const content=await weekly.json();db.snapshots=content.snapshots||[];renderUpdates();}
  }catch(error){console.info("Weekly snapshot not available yet.",error);}
  imageFrames();
}
function updateClock(){
  const node=$("#clock");if(!node)return;
  const now=new Date();
  node.textContent=now.toLocaleTimeString("en-GB",{hour12:false});
}
function flashGlitch(){
  const layer=$("#glitch-layer");if(!layer)return;
  layer.classList.remove("active");void layer.offsetWidth;layer.classList.add("active");
  const headings=$$(".hero h1");
  if(headings.length){const target=headings[0];target.classList.remove("flash-mark");void target.offsetWidth;target.classList.add("flash-mark");}
  setTimeout(()=>layer.classList.remove("active"),330);
}
function scheduleGlitches(){
  clearTimeout(glitchTimer);
  const delay=6500+Math.random()*11500;
  glitchTimer=setTimeout(()=>{if(Math.random()>.18)flashGlitch();scheduleGlitches();},delay);
}
function bindGlobalMotion(){
  spark=document.createElement("div");spark.className="cursor-spark";document.body.appendChild(spark);
  let lastRipple=0;
  window.addEventListener("pointermove",event=>{
    spark.style.left=event.clientX+"px";spark.style.top=event.clientY+"px";spark.classList.add("visible");
    if(threeState){threeState.pointer.x=(event.clientX/innerWidth)*2-1;threeState.pointer.y=-(event.clientY/innerHeight)*2+1;}
    if(Date.now()-lastRipple>850 && (currentTheme==="liquid"||currentTheme==="glass")){
      lastRipple=Date.now();const ring=document.createElement("i");ring.className="ripple";ring.style.left=event.clientX+"px";ring.style.top=event.clientY+"px";document.body.appendChild(ring);setTimeout(()=>ring.remove(),800);
    }
  },{passive:true});
  window.addEventListener("pointerout",()=>spark.classList.remove("visible"));
  window.addEventListener("scroll",()=>{
    const span=document.documentElement.scrollHeight-innerHeight;
    $("#scroll-progress").style.width=(span>0?Math.min(100,scrollY/span*100):0)+"%";
  },{passive:true});
  window.addEventListener("keydown",event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();$("#theme-select")?.focus();}
    if(event.key==="Escape")$("#theme-select")?.blur();
  });
}
function setSceneTheme(theme){
  const wrap=$("#scene-wrap"),fallback=$(".scene-fallback");
  if(!wrap)return;
  const active=["liquid","glass","tinted","future"].includes(theme);
  wrap.style.opacity=theme==="liquid"?"1":theme==="glass"?".7":theme==="future"?".45":theme==="tinted"?".2":"0";
  wrap.dataset.scene=theme;
  if(fallback)fallback.style.opacity=theme==="liquid"?"1":theme==="glass"?".5":theme==="tinted"?".3":"0";
  if(threeState){
    const map={
      liquid:["#55d8d3","#887cff"],
      glass:["#ed8ddd","#71dfe0"],
      tinted:["#5c9dff","#bd76d8"],
      future:["#0a9bcb","#8bfa70"],
      minimal:["#b3bcae","#d5c6b8"]
    };
    const colors=map[theme]||map.liquid;
    threeState.uniforms.uColorA.value.set(colors[0]);
    threeState.uniforms.uColorB.value.set(colors[1]);
    if(threeState.knotMaterial){threeState.knotMaterial.color.set(colors[0]);}
  }
}
async function initThree(){
  const canvas=$("#liquid-scene");if(!canvas||!window.WebGLRenderingContext||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  try{
    const THREE=await import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");
    const {RoomEnvironment}=await import("https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/environments/RoomEnvironment.js");
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.08;
    const scene=new THREE.Scene();
    const pmrem=new THREE.PMREMGenerator(renderer);
    const environmentScene=new RoomEnvironment();
    scene.environment=pmrem.fromScene(environmentScene,.04).texture;
    environmentScene.dispose();
    pmrem.dispose();
    const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);camera.position.set(0,0,8.5);
    const uniforms={
      uTime:{value:0},uPointer:{value:new THREE.Vector2(0,0)},uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)},
      uColorA:{value:new THREE.Color("#55d8d3")},uColorB:{value:new THREE.Color("#887cff")}
    };
    const planeMaterial=new THREE.ShaderMaterial({
      transparent:true,depthWrite:false,uniforms,
      vertexShader:"varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader:[
        "precision highp float;",
        "uniform float uTime; uniform vec2 uPointer; uniform vec2 uResolution; uniform vec3 uColorA; uniform vec3 uColorB; varying vec2 vUv;",
        "float blob(vec2 p,vec2 c,float s){return s/(dot(p-c,p-c)+0.018);}",
        "float noise(vec2 p){return sin(p.x*3.2+uTime*.27)*cos(p.y*3.6-uTime*.21);}",
        "void main(){",
        "vec2 uv=vUv; vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.0);",
        "vec2 drift=vec2(sin(uTime*.19),cos(uTime*.15))*.15;",
        "float f=blob(p,vec2(-.42,.13)+drift,.018)+blob(p,vec2(.37,-.1)-drift,.016)+blob(p,vec2(.03,.43)+drift.yx,.012)+blob(p,uPointer*.32,.012);",
        "float n=noise(p*2.0)*.055;",
        "float liquid=smoothstep(1.08,1.9,f+n);",
        "float edge=1.0-smoothstep(.08,.5,abs(f-1.45));",
        "vec2 refractUv=uv+normalize(p+vec2(.001))*liquid*.045+vec2(n,-n)*.12;",
        "float bands=sin((refractUv.x+refractUv.y)*26.0+uTime*.7)*.5+.5;",
        "vec3 col=mix(uColorA,uColorB,smoothstep(-.5,.6,p.x+noise(p)*.25));",
        "col=mix(col,vec3(.55,.88,1.0),bands*.25);",
        "float spec=pow(max(0.0,1.0-abs(f-1.4)*2.7),7.0);",
        "vec3 normal=normalize(vec3(dFdx(f),dFdy(f),.22));",
        "float light=pow(max(dot(normal,normalize(vec3(-.4,.65,.8))),0.0),12.0);",
        "col+=vec3(1.0)*edge*.42+vec3(.62,.95,1.0)*(spec*.32+light*.55);",
        "float alpha=liquid*.22+edge*.15+spec*.08;",
        "gl_FragColor=vec4(col,alpha);",
        "}"
      ].join("\n")
    });
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(26,16),planeMaterial);plane.position.z=-3.7;scene.add(plane);
    const ambient=new THREE.AmbientLight(0x9fcfff,1.15);scene.add(ambient);
    const key=new THREE.PointLight(0x83f2e8,30,22);key.position.set(2.7,2.8,4);scene.add(key);
    const rim=new THREE.PointLight(0xa18aff,24,20);rim.position.set(-3,-2,2);scene.add(rim);
    const knotGeometry=new THREE.IcosahedronGeometry(1.24,7);
    const knotMaterial=new THREE.MeshPhysicalMaterial({color:0x70e4dd,metalness:.04,roughness:.035,transmission:.96,thickness:1.8,ior:1.42,clearcoat:1,clearcoatRoughness:.015,iridescence:1,iridescenceIOR:1.38,iridescenceThicknessRange:[120,720],envMapIntensity:1.55,transparent:true,opacity:.96});
    knotMaterial.onBeforeCompile=shader=>{
      shader.uniforms.uFluidTime=uniforms.uTime;
      shader.vertexShader=shader.vertexShader.replace("#include <common>","#include <common>\nuniform float uFluidTime;");
      shader.vertexShader=shader.vertexShader.replace("#include <begin_vertex>","#include <begin_vertex>\nfloat swell=sin(position.x*3.1+uFluidTime*.62)*sin(position.y*2.7-uFluidTime*.47)*.48+cos(position.z*3.4+uFluidTime*.36)*.24;\ntransformed+=objectNormal*swell*.14;");
    };
    knotMaterial.customProgramCacheKey=()=>"arc-liquid-sculpture-v2";
    const knot=new THREE.Mesh(knotGeometry,knotMaterial);knot.position.set(2.15,.15,.2);knot.scale.setScalar(1.08);scene.add(knot);
    const beadGeometry=new THREE.SphereGeometry(.34,48,32);
    const beadMaterial=new THREE.MeshPhysicalMaterial({color:0xb7a8ff,metalness:.02,roughness:.025,transmission:.94,thickness:1.1,ior:1.38,clearcoat:1,iridescence:1,envMapIntensity:1.35});
    const beadA=new THREE.Mesh(beadGeometry,beadMaterial);beadA.position.set(.55,1.72,.35);scene.add(beadA);
    const beadB=new THREE.Mesh(beadGeometry,beadMaterial);beadB.scale.setScalar(.62);beadB.position.set(3.5,-1.05,.28);scene.add(beadB);
    const beadC=new THREE.Mesh(beadGeometry,beadMaterial);beadC.scale.setScalar(.42);beadC.position.set(.95,-1.55,.42);scene.add(beadC);
    const ringMaterial=new THREE.MeshPhysicalMaterial({color:0x87e8e7,metalness:.16,roughness:.09,transmission:.6,clearcoat:1,iridescence:1,transparent:true,opacity:.48});
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.85,.018,12,180),ringMaterial);ring.position.set(2.15,.15,-.35);ring.rotation.set(1.15,.2,.35);scene.add(ring);
    const ring2=new THREE.Mesh(new THREE.TorusGeometry(2.12,.009,8,180),new THREE.MeshBasicMaterial({color:0xc0b4ff,transparent:true,opacity:.6}));ring2.position.copy(ring.position);ring2.rotation.set(.75,-.5,.7);scene.add(ring2);
    const shardMat=new THREE.MeshPhysicalMaterial({color:0x8ceee4,metalness:.12,roughness:.04,transmission:.84,thickness:.7,clearcoat:1,iridescence:1,transparent:true,opacity:.58});
    const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.5,0),shardMat);shard.position.set(-2.9,-1.3,.15);scene.add(shard);
    const pointer={x:0,y:0};
    threeState={THREE,renderer,scene,camera,uniforms,knot,knotMaterial,ring,ring2,shard,pointer};
    setSceneTheme(currentTheme);
    function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();uniforms.uResolution.value.set(innerWidth,innerHeight);}
    window.addEventListener("resize",resize,{passive:true});
    function animate(t){
      requestAnimationFrame(animate);
      if(document.hidden)return;
      uniforms.uTime.value=t*.001;
      uniforms.uPointer.value.set(pointer.x,pointer.y);
      knot.rotation.x=t*.00012+.4;knot.rotation.y=t*.00025;knot.rotation.z=Math.sin(t*.00016)*.3;
      knot.position.y=.15+Math.sin(t*.0005)*.18;
      ring.rotation.z=t*.00012;ring2.rotation.x=t*.00018;
      shard.rotation.x=t*.00035;shard.rotation.y=t*.00025;shard.position.y=-1.3+Math.sin(t*.0006)*.2;
      renderer.render(scene,camera);
    }
    requestAnimationFrame(animate);
  }catch(error){console.info("Three.js scene unavailable; CSS atmosphere remains active.",error);}
}
renderTheme(currentTheme);
bindGlobalMotion();
scheduleGlitches();
setInterval(updateClock,1000);
loadProfile();
initThree();
