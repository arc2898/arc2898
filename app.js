const THEMES = [
  {id:"liquid",label:"Liquid glass"},
  {id:"minimal",label:"Minimalism"},
  {id:"neo",label:"Neomorphism"},
  {id:"skeuo",label:"Skeuomorphism"},
  {id:"tinted",label:"Tinted glass"},
  {id:"glass",label:"Glassmorphism"},
  {id:"burst",label:"Neo burst"},
  {id:"retro",label:"Retro"},
  {id:"pixel",label:"Pixel"},
  {id:"oldweb",label:"90s web / old internet"},
  {id:"future",label:"Futuristic"}
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const db = {profile:null,repos:[],events:[],snapshots:[],loadedAt:null};
let currentTheme = THEMES[Math.floor(Math.random()*THEMES.length)].id;
let threeState = null;
let glitchTimer = null;
let spark = null;
const NAV = [["about","About"],["projects","Projects"],["repos","Repos"],["stack","Stack"],["now","Now"],["done","Done"],["updates","Updates"],["visuals","Shots"]];
const SCREENSHOTS = [
  ["AIOF — Explorer","aiof-explorer","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061548.png"],
  ["AIOF — File preview","aiof-preview","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061618.png"],
  ["AIOF — Media tools","aiof-media","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061633.png"],
  ["AIOF — Downloads","aiof-downloads","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061646.png"],
  ["FT-music — Player","ft-player","https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/playerview.png"],
  ["FT-music — Playlist","ft-playlist","https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/playlistview.png"],
  ["FT-music — Artist","ft-artist","https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/artistview.png"],
  ["FT-music — Lyrics","ft-lyrics","https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/lyricsview1.png"]
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
  if(theme==="retro" || theme==="oldweb"){
    return '<div class="browser-chrome"><span class="browser-lights"><i></i><i></i><i></i></span><b>'+ (theme==="retro"?"Netscape-ish Navigator 4.0":"PERSONAL HOME PAGE") +'</b><span>FILE　EDIT　VIEW　GO　BOOKMARKS　HELP</span></div><header class="masthead">'+brand+nav+controlPanel()+'</header><div class="browser-address"><span>Location:</span><code>https://arc2898.github.io/arc2898/</code><span class="address-go">GO</span></div>';
  }
  const extras = theme==="burst" ? '<span class="head-sticker">INDEPENDENT / EST. 2026</span>' : theme==="pixel" ? '<span class="pixel-online">● ONLINE</span>' : theme==="future" ? '<span class="telemetry-light">SYS / ACTIVE</span>' : theme==="skeuo" ? '<span class="screw-head">✣</span>' : "";
  return '<header class="masthead '+theme+'-masthead">'+brand+extras+nav+controlPanel()+'</header>';
}
function actionLinks(){
  return '<div class="hero-actions"><a class="action primary" href="#projects">Explore the work <span>↘</span></a><a class="action" href="https://github.com/arc2898" target="_blank" rel="noreferrer">Open GitHub ↗</a></div>';
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
  if(theme==="retro"){
    return '<section class="hero retro-hero" id="top"><div class="retro-banner"><span>★ ★ ★ WELCOME TO MY HOMEPAGE ★ ★ ★</span></div><center><div class="retro-welcome">HELLO, INTERNET!</div><h1>Welcome to <em>arc’s</em> corner of the web!</h1><p class="hero-copy">A solo developer’s personal homepage. I build command-line tools, graphical apps and systems experiments. Please explore, stay curious, and enjoy the hyperlinks.</p>'+actionLinks()+'<div class="retro-under-construction">🚧 ALWAYS UNDER CONSTRUCTION 🚧</div></center></section>';
  }
  if(theme==="oldweb"){
    return '<section class="hero oldweb-hero" id="top"><center><div class="oldweb-welcome">~*~ WELCOME TO MY PERSONAL WEB PAGE ~*~</div><h1>arc<span>2898</span></h1><p class="hero-copy">Hello visitor! I’m arc. This little corner of the web is where I keep my projects, experiments, notes and things I have been working on.</p><div class="oldweb-visitor">YOU ARE VISITOR № <b id="visitor-count">0002898</b></div>'+actionLinks()+'<p><blink>✦ BEST VIEWED WITH CURIOSITY ✦</blink></p></center></section>';
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
  if(theme==="retro" || theme==="oldweb") return '<section id="'+id+'" class="profile-section reveal"><fieldset class="retro-fieldset"><legend> '+num+' — '+title+' </legend>'+intro+body+'</fieldset></section>';
  if(theme==="future") return '<section id="'+id+'" class="profile-section reveal"><div class="hud-frame"><div class="hud-frame-label">MODULE '+num+' / '+title.toUpperCase()+'</div><div class="hud-corner tl"></div><div class="hud-corner tr"></div><div class="hud-corner bl"></div><div class="hud-corner br"></div>'+intro+body+'</div></section>';
  if(theme==="skeuo") return '<section id="'+id+'" class="profile-section reveal"><div class="metal-panel"><div class="metal-panel-top"><span>✣　MODULE '+num+'</span><span>● READY</span></div>'+intro+body+'</div></section>';
  if(theme==="minimal") return '<section id="'+id+'" class="profile-section reveal"><div class="minimal-section-number">'+num+'</div>'+intro+body+'</section>';
  if(theme==="neo") return '<section id="'+id+'" class="profile-section reveal"><div class="neo-section-surface">'+intro+body+'</div></section>';
  if(theme==="tinted") return '<section id="'+id+'" class="profile-section reveal"><div class="tinted-section-surface">'+intro+body+'</div></section>';
  if(theme==="glass") return '<section id="'+id+'" class="profile-section reveal"><div class="glass-section-pane">'+intro+body+'</div></section>';
  return '<section id="'+id+'" class="profile-section reveal"><div class="section-inner">'+intro+body+'</div></section>';
}
function aboutBody(){
  return '<div class="about-layout"><article class="surface about-bio"><img class="avatar" id="avatar" src="https://avatars.githubusercontent.com/u/329584786?v=4" alt="arc GitHub avatar"><div><h3 class="bio-title" id="profile-name">arc / independent developer</h3><p class="bio-text" id="profile-bio">A solo developer interested in CLI and GUI software, Android, Windows, Linux and low-level engineering.</p><div class="bio-focus"><span class="tag">Go</span><span class="tag">Rust</span><span class="tag">Dart</span><span class="tag">JavaScript</span><span class="tag">Systems</span><span class="tag">Cross-platform</span></div><div class="social-row"><a class="social-link" href="https://github.com/arc2898" target="_blank" rel="noreferrer">GitHub ↗</a><a class="social-link" id="profile-blog-link" href="https://github.com/arc2898" target="_blank" rel="noreferrer">Website ↗</a><a class="social-link" href="mailto:rc002898@gmail.com">Gmail ↗</a><a class="social-link" href="https://x.com/arc3338" target="_blank" rel="noreferrer">X · @arc3338 ↗</a><a class="social-link" href="https://tryhackme.com/p/shikarin1113" target="_blank" rel="noreferrer">TryHackMe ↗</a></div></div></article><div class="stats-grid"><article class="surface stat-tile"><strong id="stat-repos">—</strong><span>Public repositories</span></article><article class="surface stat-tile"><strong id="stat-followers">—</strong><span>Followers</span></article><article class="surface stat-tile"><strong id="stat-following">—</strong><span>Following</span></article><article class="surface stat-tile"><strong id="stat-stars">—</strong><span>Stars earned</span></article><article class="surface stat-tile"><strong id="stat-forks">—</strong><span>Repository forks</span></article><article class="surface stat-tile"><strong id="stat-gists">—</strong><span>Public gists</span></article></div></div><div class="profile-facts surface"><div><span>LOCATION</span><b id="profile-location">Not specified</b></div><div><span>COMPANY</span><b id="profile-company">Independent</b></div><div><span>MEMBER SINCE</span><b id="profile-created">—</b></div><div><span>PROFILE</span><b id="profile-type">Public GitHub profile</b></div></div>';
}
function projectsBody(theme){
  const groups = [
    {name:"Android & music",items:[
      {name:"FT-music",kind:"Android · Flutter + Go",desc:"An open-source music app with a Flutter client and a layered Go backend for music libraries, playlists, playback and authorized streaming integrations.",repo:"https://github.com/arc2898/Android/tree/main/FT-music",image:"https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/bloomeetunes_new_banner.png",gallery:["https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/playerview.png","https://raw.githubusercontent.com/arc2898/Android/main/FT-music/app/assets/docs/playlistview.png"],apk:"https://github.com/arc2898/Android/releases/download/apk/FT-music-debug.apk",release:"https://github.com/arc2898/Android/releases/tag/apk",source:"https://github.com/arc2898/Android/archive/refs/heads/main.zip"}
    ]},
    {name:"Desktop & cross-device",items:[
      {name:"AIOF — All-in-One File Manager",kind:"Windows · Linux · Electron",desc:"A local-first desktop workspace for files, previews, downloads, archives, media, system utilities and in-app editing.",repo:"https://github.com/arc2898/AIOF",image:"https://raw.githubusercontent.com/arc2898/AIOF/main/resources/branding/aiof-logo.png",gallery:["https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061548.png","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061618.png","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061633.png","https://raw.githubusercontent.com/arc2898/AIOF/main/screenshots/Screenshot%202026-11-10%20061646.png"]},
      {name:"WinIsland",kind:"Windows 11 · C# / WPF",desc:"A Dynamic Island-style desktop widget with clock, system-resource, media and to-do modules.",repo:"https://github.com/arc2898/WinIsland"},
      {name:"ShareXF",kind:"Windows · macOS · Linux · Android",desc:"A privacy-minded device connectivity suite for sharing files, screens, input, clipboard and device features across paired devices.",repo:"https://github.com/arc2898/sharexf"},
      {name:"Self-hosted dashboard",kind:"Node.js · Self-hosted",desc:"A private server dashboard for system monitoring, file management, media streaming, process controls and a browser terminal.",repo:"https://github.com/arc2898/selfhost-dashboard"}
    ]},
    {name:"Developer tools & systems",items:[
      {name:"Universal Package Manager",kind:"Go · CLI",desc:"One command-line interface for package installation, removal, search and updates across system and language package managers.",repo:"https://github.com/arc2898/Universal-Package-Manager"},
      {name:"rEFInd-GUI",kind:"Rust · Boot tooling",desc:"A CLI-first workspace for rEFInd boot entries, Linux system inspection, kernel discovery and boot-environment management.",repo:"https://github.com/arc2898/rEFInd-GUI"},
      {name:"arcnize",kind:"Linux · Shell tooling",desc:"A setup toolkit for GNOME extensions, Zsh and a customized Linux desktop workflow.",repo:"https://github.com/arc2898/arcnize"},
      {name:"Tview",kind:"Linux · Terminal app",desc:"A terminal-based video player and image viewer built for lightweight media browsing.",repo:"https://github.com/arc2898/Linux/tree/main/tview"},
      {name:"EVERLUMEN / NEUROGLASS",kind:"Linux · Hyprland / Quickshell",desc:"An experimental neon-glass desktop theme with a customization lab and distro-aware installer.",repo:"https://github.com/arc2898/Linux/tree/main/themes/everlumen"},
      {name:"Linux Brand Modifier",kind:"Linux · Customization",desc:"Utilities for adjusting Linux distribution branding and related desktop assets.",repo:"https://github.com/arc2898/Linux/tree/main/linux-brand-modifier"}
    ]}
  ];
  const card=(p,i)=>'<article class="surface project-card '+(p.apk?'project-featured':'')+'" style="--project-index:'+i+'">'+
    '<div class="project-cover">'+(p.image?'<img src="'+p.image+'" alt="'+esc(p.name)+' preview" loading="lazy">':'<span class="project-monogram">'+esc(p.name.split(/\\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase())+'</span>')+'<span class="project-kind">'+esc(p.kind)+'</span></div>'+
    '<div class="project-copy"><span class="project-number">PROJECT / '+String(i+1).padStart(2,"0")+'</span><h3>'+esc(p.name)+'</h3><p>'+esc(p.desc)+'</p>'+
    (p.gallery?'<div class="project-gallery">'+p.gallery.map((src,j)=>'<img src="'+src+'" alt="'+esc(p.name)+' screenshot '+(j+1)+'" loading="lazy">').join("")+'</div>':'')+
    '<div class="project-actions">'+(p.apk?'<a class="action primary project-download" href="'+p.apk+'" download>Download APK ↓</a><a class="action project-source" href="'+p.source+'" download>Download source ↓</a>':'')+'<a class="action project-repo" href="'+p.repo+'" target="_blank" rel="noreferrer">Open project ↗</a>'+(p.release?'<a class="project-release" href="'+p.release+'" target="_blank" rel="noreferrer">All releases ↗</a>':'')+'</div></div></article>';
  return '<div class="projects-groups">'+groups.map((g,gi)=>'<div class="project-group"><div class="project-group-heading"><span>COLLECTION / '+String(gi+1).padStart(2,"0")+'</span><h3>'+g.name+'</h3></div><div class="projects-grid">'+g.items.map((p,i)=>card(p,gi*10+i)).join("")+'</div></div>').join("")+'</div>';
}
function reposBody(){
  return '<div class="repo-overview"><div><strong id="repo-total-stars">—</strong><span>STARS</span></div><div><strong id="repo-total-forks">—</strong><span>FORKS</span></div><div><strong id="repo-total-watchers">—</strong><span>WATCHERS</span></div><div><strong id="repo-total-issues">—</strong><span>OPEN ISSUES</span></div><div><strong id="repo-language-count">—</strong><span>LANGUAGES</span></div></div><div class="repo-toolbar"><input class="repo-search" id="repo-search" placeholder="Find a repository…" aria-label="Search repositories"><select class="repo-sort" id="repo-sort" aria-label="Sort repositories"><option value="updated">Recently updated</option><option value="stars">Most stars</option><option value="forks">Most forks</option><option value="issues">Most open issues</option><option value="name">Name A–Z</option></select><select class="repo-filter" id="repo-language" aria-label="Filter by language"><option value="all">All languages</option></select></div><div class="repo-grid" id="repo-grid"><div class="data-empty">Establishing GitHub connection…</div></div><p class="hero-tag" id="repo-counter" style="margin-top:16px">PUBLIC REPOSITORIES / LOADING</p>';
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
function galleryBody(){
  return '<div class="gallery-grid" id="gallery-grid">'+SCREENSHOTS.map((s,i)=>'<article class="surface shot-card"><div class="shot-preview"><img src="'+s[2]+'" alt="'+esc(s[0])+'" loading="lazy"><span>FRAME '+String(i+1).padStart(2,"0")+'</span></div><b>'+s[0]+'</b><small>Project image / GitHub</small></article>').join("")+'</div>';
}
function footer(){
  return '<footer class="site-footer"><span>© '+new Date().getFullYear()+' ARC2898 / BUILT WITH CURIOSITY</span><span id="footer-status"><i class="tick-dot"></i> CONNECTING TO PUBLIC DATA</span><span class="footer-links"><a href="https://github.com/arc2898" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="#top">BACK TO TOP ↑</a></span></footer>';
}
function ticker(theme){
  const txt = "BUILDING TOOLS　✳　EXPLORING SYSTEMS　✳　OPEN SOURCE　✳　LOW LEVEL CURIOSITY　✳　CLI / GUI / OS　✳　";
  if(theme==="retro" || theme==="oldweb") return '<div class="ticker"><div class="marquee"><span>*** WELCOME *** TAKE A LOOK AROUND *** BEST VIEWED WITH CURIOSITY ***</span></div></div>';
  if(theme==="pixel") return '<div class="ticker"><div class="marquee"><span>▰▰▱▱　PLAYER 01　✦　QUEST: BUILD SOMETHING USEFUL　✦　SAVE POINT: GITHUB　　</span></div></div>';
  if(theme==="future") return '<div class="ticker"><div class="marquee"><span>SYS.STATUS: NOMINAL　/　SIGNAL: ACTIVE　/　DATA: PUBLIC　/　'+txt+'</span></div></div>';
  return '<div class="ticker"><div class="ticker-track">'+(txt+txt+txt)+'</div></div>';
}
function renderTheme(theme, restoreId){
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  $("#app").innerHTML = '<div class="site-shell '+theme+'-site">'+header(theme)+hero(theme)+ticker(theme)+'<main class="wrap content-flow">'+
    wrapSection(theme,"about","01","About","The person and interests behind the projects.",aboutBody())+
    wrapSection(theme,"projects","02","Projects","A project-by-project index with real screenshots, concise summaries and download links.",projectsBody(theme))+
    wrapSection(theme,"repos","03","Repositories","Public repositories and their live GitHub metadata. Private projects stay private.",reposBody())+
    wrapSection(theme,"stack","04","Tech stack","Languages discovered from public repository metadata; presence, not proficiency.",stackBody())+
    wrapSection(theme,"now","05","What is going on","Recent public GitHub events and the current areas of focus.",nowBody())+
    wrapSection(theme,"done","06","What was done","Selected engineering work and project milestones.",doneBody(theme))+
    wrapSection(theme,"updates","07","Updates","Weekly snapshots plus the latest visible changes.",updatesBody())+
    wrapSection(theme,"visuals","08","Project screenshots","Eight individual frames ready for screenshots, added one by one.",galleryBody())+
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
  nodes.forEach((node,i)=>{node.classList.toggle(i%2?"from-right":"from-left",currentTheme!=="retro"&&currentTheme!=="oldweb"&&currentTheme!=="pixel");observer.observe(node);});
}
function paintData(){
  if(!db.profile && !db.repos.length)return;
  const p=db.profile||{};
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set("profile-name",(p.name||"arc")+" / @arc2898");
  const avatar=$("#avatar");if(avatar&&p.avatar_url)avatar.src=p.avatar_url;
  const totalStars=db.repos.reduce((sum,r)=>sum+(r.stargazers_count||0),0);
  const totalForks=db.repos.reduce((sum,r)=>sum+(r.forks_count||0),0);
  const totalWatchers=db.repos.reduce((sum,r)=>sum+(r.subscribers_count||r.watchers_count||0),0);
  const totalIssues=db.repos.reduce((sum,r)=>sum+(r.open_issues_count||0),0);
  const languages=[...new Set(db.repos.map(r=>r.language).filter(Boolean))];
  set("stat-repos",fmt(p.public_repos??db.repos.length));set("stat-followers",fmt(p.followers));
  set("stat-following",fmt(p.following));set("stat-stars",fmt(totalStars));set("stat-forks",fmt(totalForks));set("stat-gists",fmt(p.public_gists));
  set("profile-bio",p.bio||"A solo developer interested in CLI and GUI software, Android, Windows, Linux and low-level engineering.");
  set("profile-location",p.location||"Not specified");set("profile-company",p.company||"Independent");
  set("profile-created",p.created_at?new Date(p.created_at).toLocaleDateString(undefined,{month:"short",year:"numeric"}):"—");
  set("profile-type",p.type||"Public GitHub profile");
  const blogLink=$("#profile-blog-link");if(blogLink){if(p.blog){blogLink.href=/^https?:\/\//i.test(p.blog)?p.blog:"https://"+p.blog;blogLink.hidden=false;}else blogLink.hidden=true;}
  const metric=(id,value)=>{const el=$("#"+id);if(el)el.textContent=fmt(value);};
  metric("repo-total-stars",totalStars);metric("repo-total-forks",totalForks);metric("repo-total-watchers",totalWatchers);metric("repo-total-issues",totalIssues);metric("repo-language-count",languages.length);
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
  repos.sort((a,b)=>sort==="stars"?(b.stargazers_count-a.stargazers_count):sort==="forks"?(b.forks_count-a.forks_count):sort==="issues"?(b.open_issues_count-a.open_issues_count):sort==="name"?a.name.localeCompare(b.name):new Date(b.pushed_at||b.updated_at)-new Date(a.pushed_at||a.updated_at));
  if(!repos.length){grid.innerHTML='<div class="data-empty">No matching repositories. Change the filters and try again.</div>';}
  else grid.innerHTML=repos.map((r,i)=>
    '<article class="surface repo-card reveal in-view" style="--card-index:'+i+'"><div class="repo-topline"><span class="repo-name">'+esc(r.name)+'</span><a class="repo-open" href="'+esc(r.html_url)+'" target="_blank" rel="noreferrer" aria-label="Open '+esc(r.name)+' on GitHub">↗</a></div><p class="repo-description">'+esc(r.description||"No description added yet.")+'</p><div class="repo-data"><span><i class="lang-dot"></i>'+esc(r.language||"Unspecified")+'</span><span>★ '+fmt(r.stargazers_count)+'</span><span>⑂ '+fmt(r.forks_count)+'</span><span>◉ '+fmt(r.watchers_count)+'</span><span>Issues '+fmt(r.open_issues_count)+'</span></div><div class="repo-extra"><span>LICENSE / '+esc(r.license?.spdx_id||"Not specified")+'</span><span>BRANCH / '+esc(r.default_branch||"—")+'</span><span>SIZE / '+fmt(Math.round((r.size||0)/1024*10)/10)+' MB</span></div>'+(r.topics?.length?'<div class="repo-topics">'+r.topics.slice(0,5).map(t=>'<span>'+esc(t)+'</span>').join("")+'</div>':"")+(r.homepage?'<a class="repo-homepage" href="'+esc(r.homepage)+'" target="_blank" rel="noreferrer">PROJECT WEBSITE ↗</a>':"")+'<div class="repo-updated">PUSHED '+since(r.pushed_at||r.updated_at)+' · UPDATED '+shortDate(r.updated_at)+'</div></article>'
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
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
    renderer.setSize(innerWidth,innerHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene();
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
    const knotGeometry=new THREE.TorusKnotGeometry(1.05,.27,220,32,2,5);
    const knotMaterial=new THREE.MeshPhysicalMaterial({color:0x55d8d3,metalness:.12,roughness:.06,transmission:.68,thickness:1.1,ior:1.32,clearcoat:1,clearcoatRoughness:.03,iridescence:1,iridescenceIOR:1.35,iridescenceThicknessRange:[100,650],transparent:true,opacity:.88});
    const knot=new THREE.Mesh(knotGeometry,knotMaterial);knot.position.set(2.15,.15,.2);knot.scale.setScalar(1.05);scene.add(knot);
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
