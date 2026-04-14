/**
 * DémoDK v3 — Onboarding in-app pour app.dresskare.com
 * Sidebar gauche, #FFA944, 14 jours, relances, tours enrichis
 */
(function(){
"use strict";
if(window.__DEMODK_LOADED__)return;
window.__DEMODK_LOADED__=true;

var C="#FFA944",SK="demodk_v3",DAYS=14;

// ═══ STORAGE ═══
function ls(){try{return JSON.parse(localStorage.getItem(SK))||{}}catch(e){return{}}}
function ss(o){localStorage.setItem(SK,JSON.stringify(o))}
function gS(k){return ls()[k]}
function sS(k,v){var o=ls();o[k]=v;ss(o)}

// ═══ TRACKING ═══
function trk(e,d){if(window.dataLayer)window.dataLayer.push({event:e,source:"demodk"});console.log("[DemoDK]",e,d||"")}

// ═══ HELPERS ═══
function h(tag,a,c){var e=document.createElement(tag);if(a)Object.keys(a).forEach(function(k){if(k==="className")e.className=a[k];else if(k==="innerHTML")e.innerHTML=a[k];else if(k==="textContent")e.textContent=a[k];else if(k==="style")e.style.cssText=a[k];else if(k.slice(0,2)==="on"&&typeof a[k]==="function")e.addEventListener(k.slice(2).toLowerCase(),a[k]);else e.setAttribute(k,a[k])});if(c)(Array.isArray(c)?c:[c]).forEach(function(x){if(!x)return;typeof x==="string"?e.appendChild(document.createTextNode(x)):e.appendChild(x)});return e}
function fN(t){return Array.from(document.querySelectorAll(".v-navigation-drawer__content .v-list-item")).find(function(e){return e.textContent.trim().indexOf(t)===0})}
function fB(t){return Array.from(document.querySelectorAll(".v-btn,button")).find(function(e){return e.textContent.trim().indexOf(t)!==-1})}
function fM(t){var m=document.querySelector("main");if(!m)return null;return Array.from(m.querySelectorAll("*")).find(function(e){return e.children.length<=4&&e.textContent.trim().indexOf(t)!==-1&&e.textContent.trim().length<t.length+60})}
function fTab(t){return document.querySelector('a[href*="'+t+'"]')}
function scr(el){var r=el.getBoundingClientRect();if(r.top<0||r.bottom>window.innerHeight)el.scrollIntoView({behavior:"smooth",block:"center"})}
function aPos(r){var b=window.innerHeight-r.bottom,t=r.top,ri=window.innerWidth-r.right,l=r.left,mx=Math.max(b,t,ri,l);if(mx===b)return"bottom";if(mx===t)return"top";if(mx===ri)return"right";return"left"}

// Navigate via sidebar click, wait, then callback
function navTo(navText,cb){
  var item=fN(navText);
  if(item){item.click();setTimeout(cb||function(){},1200)}
  else if(cb)cb();
}
function navToUrl(url,cb){
  window.location.href=url;
  // cb will be called via tour restart on page load
}

// ═══ CSS ═══
var css=document.createElement("style");css.id="demodk-css";
css.textContent=[
// Guide button
"#dk-btn{position:relative;cursor:pointer;transition:all .2s;padding:12px 14px !important;margin:6px 8px !important;border-radius:10px !important;background:"+C+" !important;color:#fff !important;font-weight:600 !important;font-size:13px !important;display:flex !important;align-items:center !important;gap:8px !important;border:none !important;width:calc(100% - 16px) !important;text-align:left !important;box-shadow:0 2px 12px rgba(255,169,68,.35) !important}",
"#dk-btn:hover{filter:brightness(1.05);transform:translateY(-1px)}",
"#dk-btn .dk-cnt{background:rgba(255,255,255,.25);font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;margin-left:auto}",
"@keyframes dkPulse{0%,100%{box-shadow:0 2px 12px rgba(255,169,68,.35)}50%{box-shadow:0 2px 20px rgba(255,169,68,.7)}}",
"#dk-btn.dk-pulse{animation:dkPulse 2s ease infinite}",
// Panel
"#dk-panel{position:fixed;left:230px;bottom:50px;z-index:99975;width:400px;max-height:calc(100vh - 100px);background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:none;flex-direction:column;overflow:hidden;animation:dkU .3s ease}",
"#dk-panel.dk-open{display:flex}",
"@keyframes dkU{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}",
// Header
"#dk-hdr{padding:20px 22px 16px;background:"+C+";color:#fff;position:relative}",
"#dk-hdr h3{font-size:16px;font-weight:700;margin:0 0 2px}#dk-hdr p{font-size:12px;opacity:.9;margin:0}",
"#dk-cls{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.15);border:none;color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}#dk-cls:hover{background:rgba(255,255,255,.25)}",
".dk-prow{display:flex;align-items:center;gap:10px;margin-top:10px}.dk-pbar{flex:1;background:rgba(255,255,255,.25);border-radius:99px;height:5px;overflow:hidden}.dk-pfill{height:100%;background:#fff;border-radius:99px;transition:width .5s ease}.dk-ptxt{font-size:11px;font-weight:600;opacity:.9}",
// Items
"#dk-items{padding:4px 0;overflow-y:auto;flex:1}",
".dk-it{display:flex;align-items:flex-start;gap:11px;padding:12px 20px;cursor:pointer;transition:background .15s}.dk-it:hover{background:#fef9f3}",
".dk-it.dk-done{opacity:.6}.dk-it.dk-done .dk-lbl{text-decoration:line-through}",
".dk-it.dk-done:hover{opacity:.85}",
".dk-num{width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-top:1px;border:2px solid #e0e0e8;color:#999;background:#fafafa}",
".dk-num.dk-ok{background:"+C+";border-color:"+C+";color:#fff}",
".dk-inf{flex:1;min-width:0}.dk-lbl{font-size:13px;font-weight:600;color:#1a1a2e;line-height:1.3}",
".dk-dsc{font-size:11px;color:#999;margin-top:2px;line-height:1.3}",
".dk-redo{font-size:10px;color:"+C+";font-weight:600;margin-top:3px;opacity:0;transition:opacity .2s}",
".dk-it:hover .dk-redo{opacity:1}",
// Footer
"#dk-ft{padding:10px 0 12px;border-top:1px solid #f0f0f4;display:flex;flex-direction:column;gap:6px;align-items:center}",
".dk-fb{display:block;width:calc(100% - 40px);text-align:center;padding:9px 0;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:inherit}",
".dk-sub{background:"+C+";color:#fff}.dk-sub:hover{filter:brightness(1.05)}",
".dk-dem{background:#f5f5f8;color:#555}.dk-dem:hover{background:#eee}",
// Tour
".dk-spot{position:fixed;z-index:99991;box-shadow:0 0 0 9999px rgba(0,0,0,.55);border-radius:6px;transition:all .4s ease;pointer-events:none}",
".dk-tip{position:fixed;z-index:99995;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.18);padding:22px;max-width:400px;min-width:280px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:dkP .3s ease}",
"@keyframes dkP{from{opacity:0;transform:scale(.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}",
".dk-badge{display:inline-block;background:"+C+";color:#fff;font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;margin-bottom:8px;text-transform:uppercase}",
".dk-ttl{font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:6px}",
".dk-bdy{font-size:13px;line-height:1.55;color:#5a5a78;margin-bottom:16px}.dk-bdy strong{color:#1a1a2e}",
".dk-ftr{display:flex;align-items:center;justify-content:space-between}",
".dk-dots{display:flex;gap:4px}.dk-dot{width:6px;height:6px;border-radius:50%;background:#ddd}.dk-dot.dk-a{background:"+C+";width:18px;border-radius:3px}.dk-dot.dk-p{background:"+C+"}",
".dk-acts{display:flex;gap:6px}",
".dk-x{position:absolute;top:10px;right:10px;background:none;border:none;color:#ccc;font-size:18px;cursor:pointer;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:6px}.dk-x:hover{background:#f2f2f7;color:#888}",
".dk-b{border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}",
".dk-bp{background:"+C+";color:#fff}.dk-bp:hover{filter:brightness(1.08)}",
".dk-bs{background:#f2f2f7;color:#555}.dk-bs:hover{background:#e8e8f0}",
".dk-arr{position:absolute;width:12px;height:12px;background:#fff;transform:rotate(45deg)}",
".dk-arr.dk-at{top:-6px;left:50%;margin-left:-6px}.dk-arr.dk-ab{bottom:-6px;left:50%;margin-left:-6px}.dk-arr.dk-al{left:-6px;top:50%;margin-top:-6px}.dk-arr.dk-ar{right:-6px;top:50%;margin-top:-6px}",
// Popup / CTA relance
"#dk-cta{position:fixed;left:100px;bottom:20px;z-index:99980;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.15);padding:16px 20px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:dkU .4s ease;max-width:300px;border-left:4px solid "+C+";display:flex;flex-direction:column;gap:8px}",
"#dk-cta p{font-size:13px;color:#333;margin:0;line-height:1.4}",
"#dk-cta .dk-cta-btn{background:"+C+";color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;align-self:flex-start}",
"#dk-cta .dk-cta-btn:hover{filter:brightness(1.08)}",
"#dk-cta .dk-cta-x{position:absolute;top:6px;right:8px;background:none;border:none;color:#ccc;cursor:pointer;font-size:14px}"
].join("\n");
document.head.appendChild(css);

// ═══ STATE ═══
var st={completed:gS("completed")||[],panelOpen:false,tour:null,step:0,els:[]};
var firstSeen=gS("firstSeen");
if(!firstSeen){firstSeen=new Date().toISOString();sS("firstSeen",firstSeen)}
function isExpired(){return(Date.now()-new Date(firstSeen).getTime())/(864e5)>DAYS}
function isDone(id){return st.completed.indexOf(id)!==-1}
function complete(id){if(st.completed.indexOf(id)===-1){st.completed.push(id);sS("completed",st.completed);trk("onboarding_step_completed",{block_id:id});updateBtn();if(st.panelOpen)renderPanel()}}

// ═══ BLOCS ═══
var BL=[
  // 0 - Menu
  {id:"nav",num:"",label:"D\u00e9couvrir le menu",desc:"Familiarisez-vous avec l\u2019interface",route:null,
   steps:[
    {find:function(){return fN("Dashboard")},title:"Dashboard",body:"Votre <strong>page d\u2019accueil</strong> : statistiques, \u00e9tapes de d\u00e9marrage et derniers articles.",pos:"right"},
    {find:function(){return fN("Stock")},title:"Stock",body:"<strong>Tous vos articles</strong> sont ici. Importez, ajoutez, filtrez et g\u00e9rez votre inventaire.",pos:"right"},
    {find:function(){return fN("Republier")},title:"Republier",body:"Remettez vos articles <strong>en haut des r\u00e9sultats Vinted</strong> pour plus de visibilit\u00e9. Un levier puissant.",pos:"right"},
    {find:function(){return fN("Automatisation")},title:"Automatisation",body:"Messages automatiques, acceptation d\u2019offres, republication programm\u00e9e\u2026 <strong>Tout se configure ici.</strong>",pos:"right"},
    {find:function(){return fN("Contacts")},title:"Contacts",body:"G\u00e9rez vos <strong>d\u00e9posants et clients</strong> si vous faites du d\u00e9p\u00f4t-vente.",pos:"right"},
    {find:function(){return fN("Resell")},title:"Resell",body:"Acc\u00e9dez au march\u00e9 de <strong>lots et grossistes</strong> pour acheter du stock \u00e0 revendre.",pos:"right"},
    {find:function(){return fN("Suivi")},title:"Suivi de l\u2019activit\u00e9",body:"Retrouvez <strong>toutes vos commandes Vinted</strong>, vos exp\u00e9ditions et votre historique de ventes.",pos:"right"},
    {find:function(){return fN("Guide")},title:"Guide DressKare",body:"Des <strong>tutos et guides</strong> pour ma\u00eetriser chaque fonctionnalit\u00e9 de DressKare.",pos:"right"},
    {find:function(){return fN("Param")},title:"Param\u00e8tres",body:"Configurez votre <strong>profil, prompts IA, mannequin IA, connecteurs</strong> et tarifs.",pos:"right"}
  ]},

  // 1 - Import Vinted
  {id:"import",num:"1",label:"Importer votre dressing Vinted",desc:"Republier imm\u00e9diatement + sauvegarder",route:"/repost",
   steps:[
    {find:function(){return fM("Importer tes articles Vinted")||fM("Importer mon Vinted")},title:"Importez votre dressing Vinted",body:"Collez l\u2019URL de votre profil Vinted pour <strong>importer jusqu\u2019\u00e0 1\u202f000 articles</strong> (hors brouillons, masqu\u00e9s ou vendus). Ils seront sauvegard\u00e9s et pr\u00eats \u00e0 republier.",pos:"bottom"},
    {find:function(){return fB("Synchroniser ton Vinted")},title:"Synchronisez",body:"Cliquez ici pour <strong>lancer la synchronisation</strong>. Vos articles appara\u00eetront dans la liste ci-dessous.",pos:"bottom"},
    {find:function(){return fB("Configurer la republication")},title:"Configurez la republication",body:"Une fois import\u00e9s, configurez la <strong>republication automatique</strong> pour remettre vos articles en haut des r\u00e9sultats Vinted r\u00e9guli\u00e8rement.",pos:"bottom"},
    {find:function(){return fB("Republier")},title:"Republiez manuellement",body:"Vous pouvez aussi <strong>republier manuellement</strong> des articles s\u00e9lectionn\u00e9s quand vous le souhaitez.",pos:"bottom"}
  ]},

  // 2 - Extension
  {id:"ext",num:"2",label:"Installer l\u2019extension",desc:"Republication + suivi commandes",route:null,
   steps:[
    {find:function(){return fM("Extension install")||fM("Extension")},title:"L\u2019extension Chrome DressKare",body:"L\u2019extension connecte DressKare \u00e0 Vinted. Elle permet l\u2019<strong>import en 1 clic</strong>, la <strong>republication</strong> et le <strong>suivi des commandes</strong> directement depuis Vinted.",pos:"bottom"}
  ]},

  // 3 - Ajouter articles (tour riche multi-pages)
  {id:"articles",num:"3",label:"Ajouter des articles",desc:"Fiche produit \u00b7 Prompts IA \u00b7 Mannequin \u00b7 Publier",route:"/stock",
   steps:[
    {find:function(){return fB("Ajouter des articles")},title:"Ajoutez vos articles",body:"Cliquez ici pour <strong>ouvrir la fen\u00eatre d\u2019ajout</strong>. Vous pouvez ajouter des articles manuellement, par photo, ou via import.",pos:"bottom"},
    {find:function(){return fB("Publier")},title:"Publiez sur Vinted",body:"S\u00e9lectionnez vos articles puis cliquez <strong>Publier</strong> pour les mettre en ligne sur Vinted en un clic.",pos:"bottom"},
    {find:function(){return document.querySelector(".product-card-light")},title:"La fiche produit",body:"Cliquez sur un article pour voir sa <strong>fiche compl\u00e8te</strong> : photos, titre, description IA, prix, attributs et rendu mannequin.",pos:"right"},
    // These steps require navigation to settings - they show as info
    {find:function(){return fN("Param")},title:"Personnalisez vos prompts IA",body:"Dans <strong>Param\u00e8tres > Mes annonces</strong>, personnalisez comment l\u2019IA g\u00e9n\u00e8re vos titres et descriptions. Vous pouvez cr\u00e9er plusieurs templates.",pos:"right"},
    {find:function(){return fN("Param")},title:"Configurez le mannequin IA",body:"Dans <strong>Param\u00e8tres > Mannequin IA</strong>, configurez le genre, la morphologie, la posture et le fond pour vos photos mannequin.",pos:"right"}
  ]},

  // 4 - Republier
  {id:"repub",num:"4",label:"Republier vos articles",desc:"Boostez votre visibilit\u00e9 sur Vinted",route:"/repost",
   steps:[
    {find:function(){return fM("Republier")||document.querySelector("h1")},title:"La page Republier",body:"Ici vous g\u00e9rez la <strong>republication de vos articles</strong>. Republier remet vos annonces en haut des r\u00e9sultats Vinted.",pos:"bottom"},
    {find:function(){return fB("Configurer la republication")},title:"Configurez la republication",body:"D\u00e9finissez la <strong>fr\u00e9quence, les horaires et les r\u00e8gles</strong> de republication automatique. DressKare g\u00e8re tout pour vous.",pos:"bottom"},
    {find:function(){return fB("Republier")},title:"Republication manuelle",body:"S\u00e9lectionnez des articles et cliquez <strong>Republier</strong> pour une republication imm\u00e9diate.",pos:"bottom"},
    {find:function(){return fB("Synchroniser ton Vinted")},title:"Synchronisez r\u00e9guli\u00e8rement",body:"Gardez votre stock \u00e0 jour en <strong>synchronisant avec Vinted</strong>. Les articles vendus ou supprim\u00e9s sont retir\u00e9s automatiquement.",pos:"bottom"}
  ]},

  // 5 - Automatisations
  {id:"auto",num:"5",label:"Activer mes automatisations",desc:"Gagnez du temps au quotidien",route:"/automation",
   steps:[
    {find:function(){return fM("Automatisez vos messages")||document.querySelector("h1")},title:"Vos automatisations",body:"DressKare propose <strong>5 automatisations pr\u00eates \u00e0 l\u2019emploi</strong>. Il suffit de les activer avec le switch.",pos:"bottom"},
    {find:function(){return fM("Republication auto")},title:"Republication automatique",body:"<strong>Republie automatiquement</strong> vos articles selon la fr\u00e9quence que vous avez configur\u00e9e. Activez le switch pour d\u00e9marrer.",pos:"right"},
    {find:function(){return fM("Synchronisation des commandes")},title:"Synchro commandes",body:"<strong>Synchronise automatiquement</strong> vos commandes Vinted. Vous retrouvez tout dans le suivi d\u2019activit\u00e9.",pos:"right"},
    {find:function(){return fM("Remerciement apr")},title:"Remerciement apr\u00e8s vente",body:"Envoie un <strong>message de remerciement automatique</strong> \u00e0 chaque acheteur. Fid\u00e9lisez vos clients sans effort.",pos:"right"},
    {find:function(){return fM("Acceptation")},title:"Acceptation automatique",body:"<strong>Accepte ou refuse automatiquement</strong> les offres selon vos crit\u00e8res (ex: max -20%). Plus besoin de surveiller.",pos:"right"},
    {find:function(){return fM("Message sur favori")},title:"Message sur favori",body:"Envoie un <strong>message aux utilisateurs qui mettent en favori</strong> vos articles. Transformez l\u2019int\u00e9r\u00eat en vente.",pos:"right"},
    {find:function(){return fB("Nouvelle automatisation")},title:"Cr\u00e9ez les v\u00f4tres",body:"Vous pouvez aussi <strong>cr\u00e9er vos propres automatisations</strong> personnalis\u00e9es.",pos:"bottom"}
  ]},

  // 6 - Commandes
  {id:"orders",num:"6",label:"Suivre mes commandes",desc:"Pilotez votre activit\u00e9",route:null,
   steps:[
    {find:function(){return fN("Suivi")||fN("Mes commandes")},title:"Suivi de l\u2019activit\u00e9",body:"Cliquez ici pour acc\u00e9der \u00e0 <strong>toutes vos commandes Vinted</strong>, g\u00e9rer vos exp\u00e9ditions et suivre vos gains.",pos:"right"},
    {find:function(){return fN("Mes commandes")||fM("Mes commandes")},title:"Mes commandes",body:"Retrouvez le <strong>d\u00e9tail de chaque commande</strong> : article, acheteur, prix, statut d\u2019exp\u00e9dition.",pos:"right"}
  ]}
];

// ═══ GUIDE BUTTON ═══
function insertBtn(){
  if(document.getElementById("dk-btn"))return;
  var append=document.querySelector(".v-navigation-drawer__append");
  if(!append)return;
  var done=st.completed.length,total=BL.length,rem=total-done;
  var btn=h("button",{id:"dk-btn",className:rem===total?"dk-pulse":"",onClick:function(){togglePanel()}},[
    h("span",{innerHTML:"&#128640;",style:"font-size:16px"}),
    h("span",{textContent:"D\u00e9marrage",style:"flex:1"}),
    h("span",{className:"dk-cnt",textContent:rem>0?(rem+"/"+total):"\u2713"})
  ]);
  append.insertBefore(btn,append.firstChild);
}
function updateBtn(){
  var btn=document.getElementById("dk-btn");if(!btn)return;
  var done=st.completed.length,total=BL.length,rem=total-done;
  var cnt=btn.querySelector(".dk-cnt");
  if(cnt)cnt.textContent=rem>0?(rem+"/"+total):"\u2713";
  btn.classList.toggle("dk-pulse",rem===total);
}

// ═══ PANEL ═══
function togglePanel(){st.panelOpen=!st.panelOpen;st.panelOpen?(trk("checklist_opened"),renderPanel()):closePanel()}
function closePanel(){st.panelOpen=false;var p=document.getElementById("dk-panel");if(p)p.remove()}
function renderPanel(){
  var ex=document.getElementById("dk-panel");if(ex)ex.remove();
  var done=st.completed.length,total=BL.length,pct=Math.round(done/total*100);
  var items=h("div",{id:"dk-items"});
  BL.forEach(function(b){
    var dn=isDone(b.id);
    var cls="dk-it"+(dn?" dk-done":"");
    var numCls="dk-num"+(dn?" dk-ok":"");
    var numTxt=dn?"\u2713":(b.num||"\u2022");
    var info=h("div",{className:"dk-inf"},[
      h("div",{className:"dk-lbl",textContent:b.label}),
      h("div",{className:"dk-dsc",textContent:b.desc}),
      dn?h("div",{className:"dk-redo",textContent:"\u21bb Relancer le guide"}):null
    ]);
    items.appendChild(h("div",{className:cls,onClick:function(){
      trk("item_clicked",{id:b.id,redo:dn});
      closePanel();
      launchBlock(b);
    }},[h("div",{className:numCls,textContent:numTxt}),info]));
  });
  var panel=h("div",{id:"dk-panel",className:"dk-open"},[
    h("div",{id:"dk-hdr"},[
      h("button",{id:"dk-cls",innerHTML:"&times;",onClick:closePanel}),
      h("h3",{textContent:"D\u00e9marrage avec DressKare"}),
      h("p",{textContent:"Configurez votre compte pour tout automatiser"}),
      h("div",{className:"dk-prow"},[
        h("div",{className:"dk-pbar"},[h("div",{className:"dk-pfill",style:"width:"+pct+"%"})]),
        h("div",{className:"dk-ptxt",textContent:done+"/"+total})
      ])
    ]),
    items,
    h("div",{id:"dk-ft"},[
      h("button",{className:"dk-fb dk-sub",textContent:"Souscrire",onClick:function(){var s=fN("Souscrire");if(s)s.click();closePanel()}}),
      h("button",{className:"dk-fb dk-dem",textContent:"R\u00e9servez une d\u00e9mo",onClick:function(){var d=fN("R\u00e9serve");if(d)d.click();closePanel()}})
    ])
  ]);
  document.body.appendChild(panel);
}

// ═══ LAUNCH BLOCK (navigate if needed, then tour) ═══
function launchBlock(b){
  if(b.route && window.location.pathname!==b.route){
    // Navigate via sidebar
    var map={"/repost":"Republier","/automation":"Automatisation","/stock":"Stock","/":" Dashboard"};
    var navText=map[b.route];
    if(navText){
      navTo(navText.trim(),function(){startTour(b)});
    } else {
      window.location.href=b.route;
    }
  } else {
    startTour(b);
  }
}

// ═══ TOUR ═══
function startTour(b){clearTour();st.tour=b;st.step=0;trk("tour_started",{block:b.id});renderStep()}
function renderStep(){
  clearTour();var b=st.tour;if(!b)return;
  var sd=b.steps[st.step];
  if(!sd){endTour(true);return}
  var tgt=sd.find();
  if(!tgt){if(st.step<b.steps.length-1){st.step++;renderStep()}else endTour(true);return}
  scr(tgt);
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    var r=tgt.getBoundingClientRect(),pad=8;
    var spot=h("div",{className:"dk-spot",style:"top:"+(r.top-pad)+"px;left:"+(r.left-pad)+"px;width:"+(r.width+pad*2)+"px;height:"+(r.height+pad*2)+"px"});
    document.body.appendChild(spot);
    var tot=b.steps.length,idx=st.step,pos=sd.pos||aPos(r);
    var dots=h("div",{className:"dk-dots"});
    for(var i=0;i<tot;i++){dots.appendChild(h("div",{className:"dk-dot"+(i===idx?" dk-a":i<idx?" dk-p":"")}))}
    var acts=h("div",{className:"dk-acts"});
    if(idx>0)acts.appendChild(h("button",{className:"dk-b dk-bs",textContent:"Pr\u00e9c\u00e9dent",onClick:function(){st.step--;renderStep()}}));
    if(idx<tot-1)acts.appendChild(h("button",{className:"dk-b dk-bp",textContent:"Suivant",onClick:function(){st.step++;renderStep()}}));
    else acts.appendChild(h("button",{className:"dk-b dk-bp",textContent:"Termin\u00e9 \u2713",onClick:function(){endTour(true)}}));
    var ad={top:"ab",bottom:"at",left:"ar",right:"al"}[pos];
    var tip=h("div",{className:"dk-tip"},[
      h("button",{className:"dk-x",innerHTML:"&times;",onClick:function(){endTour(false)}}),
      tot>1?h("div",{className:"dk-badge",textContent:"\u00c9tape "+(idx+1)+"/"+tot}):null,
      h("div",{className:"dk-ttl",textContent:sd.title}),
      h("div",{className:"dk-bdy",innerHTML:sd.body}),
      h("div",{className:"dk-ftr"},[dots,acts]),
      h("div",{className:"dk-arr dk-"+ad})
    ]);
    document.body.appendChild(tip);
    requestAnimationFrame(function(){
      var tr=tip.getBoundingClientRect(),gap=16,tp,lf;
      switch(pos){case"bottom":tp=r.bottom+gap;lf=r.left+r.width/2-tr.width/2;break;case"top":tp=r.top-tr.height-gap;lf=r.left+r.width/2-tr.width/2;break;case"left":tp=r.top+r.height/2-tr.height/2;lf=r.left-tr.width-gap;break;case"right":tp=r.top+r.height/2-tr.height/2;lf=r.right+gap;break}
      lf=Math.max(12,Math.min(lf,window.innerWidth-tr.width-12));
      tp=Math.max(12,Math.min(tp,window.innerHeight-tr.height-12));
      tip.style.top=tp+"px";tip.style.left=lf+"px";
    });
    st.els=[spot,tip];
    st._rh=function(){renderStep()};window.addEventListener("resize",st._rh);
  })});
}
function endTour(ok){clearTour();var b=st.tour;if(b&&ok)complete(b.id);else if(b)trk("tour_skipped",{block:b.id});st.tour=null;st.step=0}
function clearTour(){st.els.forEach(function(e){e.remove()});st.els=[];if(st._rh)window.removeEventListener("resize",st._rh)}

// ═══ CTA / RELANCE ═══
function showCTA(){
  if(document.getElementById("dk-cta"))return;
  var dismissed=gS("ctaDismissed")||0;
  var lastDismiss=gS("ctaLastDismiss")||0;
  var hoursSince=(Date.now()-lastDismiss)/(36e5);

  // Show CTA if: first time, or every 24h, max 5 times
  if(dismissed>=5)return;
  if(dismissed>0 && hoursSince<24)return;
  if(st.completed.length===BL.length)return; // all done

  var msgs=[
    {title:"\uD83D\uDC4B Bienvenue !",text:"Suivez le guide pour <strong>configurer DressKare</strong> et commencer \u00e0 vendre en quelques minutes.",btn:"Commencer"},
    {title:"\uD83D\uDE80 Continuez votre configuration",text:"Vous avez encore <strong>"+(BL.length-st.completed.length)+" \u00e9tapes</strong> \u00e0 compl\u00e9ter pour tirer le meilleur de DressKare.",btn:"Reprendre"},
    {title:"\u26A1 Activez vos automatisations",text:"Ne perdez plus de temps : <strong>automatisez</strong> vos messages, republications et acceptation d\u2019offres.",btn:"Voir comment"},
    {title:"\uD83C\uDFAF Presque configur\u00e9 !",text:"Plus que <strong>"+(BL.length-st.completed.length)+" \u00e9tapes</strong>. Finalisez pour profiter de toutes les fonctionnalit\u00e9s.",btn:"Continuer"},
    {title:"\uD83D\uDCA1 Besoin d\u2019aide ?",text:"<strong>R\u00e9servez une d\u00e9mo</strong> avec notre \u00e9quipe ou suivez le guide pas \u00e0 pas.",btn:"Ouvrir le guide"}
  ];
  var msg=msgs[Math.min(dismissed,msgs.length-1)];

  var cta=h("div",{id:"dk-cta"},[
    h("button",{className:"dk-cta-x",innerHTML:"&times;",onClick:function(){cta.remove();sS("ctaDismissed",(dismissed||0)+1);sS("ctaLastDismiss",Date.now())}}),
    h("p",{innerHTML:"<strong>"+msg.title+"</strong><br><span style='font-weight:400'>"+msg.text+"</span>"}),
    h("button",{className:"dk-cta-btn",textContent:msg.btn,onClick:function(){cta.remove();sS("ctaDismissed",(dismissed||0)+1);sS("ctaLastDismiss",Date.now());togglePanel()}})
  ]);
  document.body.appendChild(cta);
}

// ═══ PUBLIC API ═══
window.DemoDK={
  reset:function(){localStorage.removeItem(SK);st.completed=[];clearTour();document.querySelectorAll("#dk-btn,#dk-panel,#dk-cta,#demodk-css").forEach(function(e){e.remove()});window.__DEMODK_LOADED__=false;console.log("[DemoDK] Reset")},
  complete:complete,
  startTour:function(id){var b=BL.find(function(x){return x.id===id});if(b)launchBlock(b)},
  openPanel:function(){if(!st.panelOpen)togglePanel()},
  showCTA:showCTA
};

// ═══ INIT ═══
function init(){
  if(isExpired())return;
  var attempts=0;
  var check=setInterval(function(){
    attempts++;
    if(document.querySelector(".v-navigation-drawer__append")){
      clearInterval(check);
      insertBtn();
      trk("onboarding_loaded");
      // CTA relance après 3s
      setTimeout(showCTA,3000);
    }
    if(attempts>30)clearInterval(check);
  },500);
}
setTimeout(init,800);
})();
