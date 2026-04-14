/**
 * DémoDK v2 — Onboarding in-app pour app.dresskare.com
 * Surcouche injectable, zéro dépendance
 * Position : sidebar gauche, au-dessus de Paramètres
 * Couleur : #FFA944
 * Durée : 14 jours après création de compte
 */
(function(){
"use strict";
if(window.__DEMODK_LOADED__)return;
window.__DEMODK_LOADED__=true;

var C="#FFA944"; // couleur principale
var SK="demodk_v2";
var DAYS_VISIBLE=14;

// ════════════════════════════════════════
// STORAGE
// ════════════════════════════════════════
function ls(){try{return JSON.parse(localStorage.getItem(SK))||{}}catch(e){return{}}}
function ss(o){localStorage.setItem(SK,JSON.stringify(o))}
function gS(k){return ls()[k]}
function sS(k,v){var o=ls();o[k]=v;ss(o)}

// ════════════════════════════════════════
// TRACKING
// ════════════════════════════════════════
function trk(e,d){
  if(window.dataLayer)window.dataLayer.push({event:e,source:"demodk"});
  console.log("[DémoDK]",e,d||"");
}

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════
function h(tag,a,c){
  var e=document.createElement(tag);
  if(a)Object.keys(a).forEach(function(k){
    if(k==="className")e.className=a[k];
    else if(k==="innerHTML")e.innerHTML=a[k];
    else if(k==="textContent")e.textContent=a[k];
    else if(k==="style")e.style.cssText=a[k];
    else if(k.slice(0,2)==="on"&&typeof a[k]==="function")e.addEventListener(k.slice(2).toLowerCase(),a[k]);
    else e.setAttribute(k,a[k]);
  });
  if(c)(Array.isArray(c)?c:[c]).forEach(function(x){
    if(!x)return;
    typeof x==="string"?e.appendChild(document.createTextNode(x)):e.appendChild(x);
  });
  return e;
}
function fN(t){return Array.from(document.querySelectorAll(".v-navigation-drawer__content .v-list-item")).find(function(e){return e.textContent.trim().indexOf(t)===0})}
function fB(t){return Array.from(document.querySelectorAll(".v-btn,button")).find(function(e){return e.textContent.trim().indexOf(t)!==-1})}
function fM(t){var m=document.querySelector("main");if(!m)return null;return Array.from(m.querySelectorAll("*")).find(function(e){return e.children.length<=3&&e.textContent.trim().indexOf(t)!==-1&&e.textContent.trim().length<t.length+40})}
function scr(el){var r=el.getBoundingClientRect();if(r.top<0||r.bottom>window.innerHeight)el.scrollIntoView({behavior:"smooth",block:"center"})}
function aPos(r){var b=window.innerHeight-r.bottom,t=r.top,ri=window.innerWidth-r.right,l=r.left,mx=Math.max(b,t,ri,l);if(mx===b)return"bottom";if(mx===t)return"top";if(mx===ri)return"right";return"left"}

// ════════════════════════════════════════
// CSS
// ════════════════════════════════════════
var css=document.createElement("style");css.id="demodk-css";
css.textContent="#dk-guide-btn{position:relative;cursor:pointer;transition:all .2s;padding:10px 14px !important;margin:4px 8px !important;border-radius:10px !important;background:"+C+" !important;color:#fff !important;font-weight:600 !important;font-size:13px !important;display:flex !important;align-items:center !important;gap:8px !important;border:none !important;width:calc(100% - 16px) !important;text-align:left !important;box-shadow:0 2px 8px rgba(255,169,68,.3) !important}#dk-guide-btn:hover{filter:brightness(1.05);transform:translateY(-1px)}#dk-guide-btn .dk-guide-count{background:rgba(255,255,255,.25);font-size:10px;font-weight:700;padding:1px 7px;border-radius:99px;margin-left:auto}#dk-panel{position:fixed;left:230px;bottom:60px;z-index:99975;width:380px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:none;flex-direction:column;overflow:hidden;animation:dkU .3s ease}#dk-panel.dk-open{display:flex}@keyframes dkU{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}#dk-panel-header{padding:20px 22px 16px;background:"+C+";color:#fff;position:relative}#dk-panel-header h3{font-size:16px;font-weight:700;margin:0 0 2px}#dk-panel-header p{font-size:12px;opacity:.9;margin:0;line-height:1.4}#dk-panel-close{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.15);border:none;color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}#dk-panel-close:hover{background:rgba(255,255,255,.25)}.dk-pbar-row{display:flex;align-items:center;gap:10px;margin-top:10px}.dk-pbar{flex:1;background:rgba(255,255,255,.25);border-radius:99px;height:5px;overflow:hidden}.dk-pfill{height:100%;background:#fff;border-radius:99px;transition:width .5s ease}.dk-ptxt{font-size:11px;font-weight:600;opacity:.9}#dk-items{padding:4px 0;overflow-y:auto;flex:1}.dk-item{display:flex;align-items:flex-start;gap:11px;padding:11px 20px;cursor:pointer;transition:background .15s;border-left:3px solid transparent}.dk-item:hover{background:#fef9f3}.dk-item.dk-completed{opacity:.55}.dk-item.dk-completed .dk-item-label{text-decoration:line-through}.dk-item-num{width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-top:1px;border:2px solid #e0e0e8;color:#999;background:#fafafa}.dk-item-num.dk-done{background:"+C+";border-color:"+C+";color:#fff}.dk-item-info{flex:1;min-width:0}.dk-item-label{font-size:13px;font-weight:600;color:#1a1a2e;line-height:1.3}.dk-item-desc{font-size:11px;color:#999;margin-top:2px;line-height:1.3}.dk-item-sub{font-size:10px;color:#bbb;margin-top:3px;font-style:italic}#dk-panel-footer{padding:10px 0 12px;border-top:1px solid #f0f0f4;display:flex;flex-direction:column;gap:6px;align-items:center}#dk-panel-footer .dk-footer-btn{display:block;width:calc(100% - 40px);text-align:center;padding:9px 0;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:inherit}#dk-panel-footer .dk-btn-subscribe{background:"+C+";color:#fff}#dk-panel-footer .dk-btn-subscribe:hover{filter:brightness(1.05)}#dk-panel-footer .dk-btn-demo{background:#f5f5f8;color:#555}#dk-panel-footer .dk-btn-demo:hover{background:#eee}.dk-spotlight{position:fixed;z-index:99991;box-shadow:0 0 0 9999px rgba(0,0,0,.55);border-radius:6px;transition:all .4s ease;pointer-events:none}.dk-tip{position:fixed;z-index:99995;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.18);padding:22px;max-width:380px;min-width:280px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:dkP .3s ease}@keyframes dkP{from{opacity:0;transform:scale(.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}.dk-tip-badge{display:inline-block;background:"+C+";color:#fff;font-size:10px;font-weight:700;padding:2px 9px;border-radius:99px;margin-bottom:8px;text-transform:uppercase}.dk-tip-title{font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:6px}.dk-tip-body{font-size:13px;line-height:1.55;color:#5a5a78;margin-bottom:16px}.dk-tip-body strong{color:#1a1a2e}.dk-tip-footer{display:flex;align-items:center;justify-content:space-between}.dk-tip-dots{display:flex;gap:4px}.dk-tip-dot{width:6px;height:6px;border-radius:50%;background:#ddd}.dk-tip-dot.dk-active{background:"+C+";width:18px;border-radius:3px}.dk-tip-dot.dk-past{background:"+C+"}.dk-tip-actions{display:flex;gap:6px}.dk-tip-close{position:absolute;top:10px;right:10px;background:none;border:none;color:#ccc;font-size:18px;cursor:pointer;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:6px}.dk-tip-close:hover{background:#f2f2f7;color:#888}.dk-btn{border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}.dk-btn-pri{background:"+C+";color:#fff}.dk-btn-pri:hover{filter:brightness(1.08)}.dk-btn-sec{background:#f2f2f7;color:#555}.dk-btn-sec:hover{background:#e8e8f0}.dk-tip-arrow{position:absolute;width:12px;height:12px;background:#fff;transform:rotate(45deg)}.dk-tip-arrow.dk-arr-top{top:-6px;left:50%;margin-left:-6px}.dk-tip-arrow.dk-arr-bottom{bottom:-6px;left:50%;margin-left:-6px}.dk-tip-arrow.dk-arr-left{left:-6px;top:50%;margin-top:-6px}.dk-tip-arrow.dk-arr-right{right:-6px;top:50%;margin-top:-6px}#dk-popup{position:fixed;left:240px;bottom:90px;z-index:99980;background:#fff;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.15);padding:14px 18px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:dkU .3s ease;max-width:260px;border-left:4px solid "+C+"}#dk-popup p{font-size:13px;color:#333;margin:0;line-height:1.4;font-weight:500}#dk-popup .dk-popup-close{position:absolute;top:6px;right:8px;background:none;border:none;color:#ccc;cursor:pointer;font-size:14px}";
document.head.appendChild(css);

// ════════════════════════════════════════
// STATE
// ════════════════════════════════════════
var st={
  completed:gS("completed")||[],
  panelOpen:false,
  tour:null,step:0,els:[],
  firstSeen:gS("firstSeen")||null
};
// Record first seen date
if(!st.firstSeen){
  st.firstSeen=new Date().toISOString();
  sS("firstSeen",st.firstSeen);
}
// Check 14-day window
function isExpired(){
  if(!st.firstSeen)return false;
  var diff=(Date.now()-new Date(st.firstSeen).getTime())/(1000*60*60*24);
  return diff>DAYS_VISIBLE;
}
function isDone(id){return st.completed.indexOf(id)!==-1}
function complete(id){
  if(st.completed.indexOf(id)===-1){
    st.completed.push(id);
    sS("completed",st.completed);
    trk("onboarding_step_completed",{block_id:id});
    updateGuideBtn();
    if(st.panelOpen)renderPanel();
    if(st.completed.length===BL.length)trk("onboarding_completed");
  }
}

// ════════════════════════════════════════
// BLOCS D'ONBOARDING (ordre mis à jour)
// ════════════════════════════════════════
var BL=[
  // 0 - Découvrir la navigation
  {id:"navigation",num:"",label:"D\u00e9couvrir le menu",desc:"Familiarisez-vous avec l\u2019interface",
   steps:[
    {find:function(){return fN("Dashboard")},title:"Le Dashboard",body:"C\u2019est votre <strong>page d\u2019accueil</strong>. Vous y retrouvez vos statistiques, vos derni\u00e8res actions et les \u00e9tapes de d\u00e9marrage.",pos:"right"},
    {find:function(){return fN("Stock")},title:"Votre Stock",body:"Tous vos articles sont ici. C\u2019est le <strong>c\u0153ur de votre inventaire</strong> : import, ajout, gestion.",pos:"right"},
    {find:function(){return fN("Republier")},title:"Republier",body:"Remettez vos articles <strong>en haut des r\u00e9sultats Vinted</strong> en un clic. Un levier de visibilit\u00e9 puissant.",pos:"right"},
    {find:function(){return fN("Automatisation")},title:"Automatisation",body:"Configurez vos <strong>messages automatiques</strong>, acceptation d\u2019offres, et republications programm\u00e9es.",pos:"right"},
    {find:function(){return fN("Suivi de l\u2019activit")},title:"Suivi de l\u2019activit\u00e9",body:"Retrouvez <strong>toutes vos commandes Vinted</strong>, vos exp\u00e9ditions et votre historique.",pos:"right"}
  ]},

  // 1 - Importer dressing Vinted
  {id:"import-vinted",num:"1",label:"Importer votre dressing Vinted",desc:"Sauvegardez vos articles",
   steps:[
    {find:function(){return fB("Importer mon Vinted")||fB("Synchroniser ton Vinted")},title:"Importez votre dressing",body:"Synchronisez votre compte Vinted pour <strong>importer et sauvegarder tous vos articles</strong>. C\u2019est le point de d\u00e9part.",pos:"bottom"},
    {find:function(){return fN("Stock")},title:"Retrouvez vos articles",body:"Apr\u00e8s l\u2019import, tous vos articles apparaissent dans <strong>Stock</strong>. Ils sont sauvegard\u00e9s et pr\u00eats \u00e0 \u00eatre g\u00e9r\u00e9s.",pos:"right"}
  ]},

  // 2 - Installer l'extension
  {id:"install-extension",num:"2",label:"Installer l\u2019extension",desc:"Connecter DressKare \u00e0 Vinted",
   steps:[
    {find:function(){return fM("Extension install")||fM("Extension")},title:"L\u2019extension Chrome",body:"L\u2019extension connecte DressKare \u00e0 Vinted. Elle permet l\u2019<strong>import en 1 clic</strong>, la synchronisation et la publication.",pos:"bottom"}
  ]},

  // 3 - Ajouter des articles
  {id:"add-articles",num:"3",label:"Ajouter des articles",desc:"Fiche produit \u00b7 Mannequin \u00b7 Publier",
   steps:[
    {find:function(){return fB("Ajouter des articles")||fB("Ajouter un article")},title:"Ajoutez vos articles",body:"Cr\u00e9ez vos fiches produit. L\u2019IA g\u00e9n\u00e8re <strong>titres, descriptions et suggestions de prix</strong> automatiquement.",pos:"bottom"},
    {find:function(){return document.querySelector(".product-card-light")},title:"La fiche produit",body:"Chaque article a sa fiche compl\u00e8te : <strong>photos, titre, description, prix, attributs</strong>. C\u2019est le c\u0153ur de vos publications.",pos:"right"},
    {find:function(){return fB("Publier")},title:"Publiez !",body:"Quand votre fiche est pr\u00eate, cliquez <strong>Publier</strong> pour la mettre en ligne sur Vinted.",pos:"bottom"}
  ]},

  // 4 - Republier
  {id:"republication",num:"4",label:"Republier vos articles",desc:"Boostez votre visibilit\u00e9",
   steps:[
    {find:function(){return fN("Republier")},title:"La republication",body:"Republier remet vos articles <strong>en haut des r\u00e9sultats</strong> sur Vinted. Allez dans cette section.",pos:"right"},
    {find:function(){return fB("Configurer la republication")||fB("Republier")},title:"Configurez ou republiez",body:"Republiez manuellement ou <strong>configurez la republication automatique</strong> pour gagner du temps.",pos:"bottom"}
  ]},

  // 5 - Activer les automatisations
  {id:"automations",num:"5",label:"Activer mes automatisations",desc:"Gagnez du temps au quotidien",
   steps:[
    {find:function(){return fB("Activer les automatisations")||fN("Automatisation")},title:"Vos automatisations",body:"Messages de remerciement, acceptation d\u2019offres, republication\u2026 <strong>Activez-les en un clic</strong>, elles sont pr\u00eates \u00e0 l\u2019emploi.",pos:"bottom"},
    {find:function(){return fB("Nouvelle automatisation")},title:"Personnalisez",body:"Cr\u00e9ez vos propres automatisations ou <strong>activez celles pr\u00e9configur\u00e9es</strong>. Vous gardez le contr\u00f4le.",pos:"bottom"}
  ]},

  // 6 - Suivre mes commandes
  {id:"orders",num:"6",label:"Suivre mes commandes",desc:"Pilotez votre activit\u00e9",
   steps:[
    {find:function(){return fN("Suivi de l\u2019activit")||fB("Suivre mes commandes")},title:"Suivi des commandes",body:"Retrouvez <strong>toutes vos commandes Vinted</strong>, g\u00e9rez vos exp\u00e9ditions et suivez vos gains depuis un seul endroit.",pos:"right"}
  ]}
];

// ════════════════════════════════════════
// GUIDE BUTTON (dans la sidebar, au-dessus de Paramètres)
// ════════════════════════════════════════
function insertGuideBtn(){
  if(document.getElementById("dk-guide-btn"))return;
  // Trouver le lien Paramètres dans la sidebar
  var paramItem=document.querySelector(".v-navigation-drawer__append");
  if(!paramItem)return;

  var done=st.completed.length;
  var total=BL.length;
  var remaining=total-done;

  var btn=h("button",{id:"dk-guide-btn",onClick:function(){togglePanel()}}, [
    h("span",{innerHTML:"&#128640;",style:"font-size:16px"}),
    h("span",{textContent:"D\u00e9marrage",style:"flex:1"}),
    remaining>0 ? h("span",{className:"dk-guide-count",textContent:remaining+"/"+total}) : h("span",{className:"dk-guide-count",textContent:"\u2713"})
  ]);

  // Insérer au début de la zone append (avant Paramètres)
  paramItem.insertBefore(btn,paramItem.firstChild);

  // Popup d'intro (première fois)
  if(!gS("popupShown")){
    sS("popupShown",true);
    setTimeout(function(){
      var popup=h("div",{id:"dk-popup"},[
        h("button",{className:"dk-popup-close",innerHTML:"&times;",onClick:function(){popup.remove()}}),
        h("p",{innerHTML:"\uD83D\uDC4B <strong>Votre guide pour d\u00e9marrer avec DressKare</strong><br><span style='font-size:12px;color:#666;font-weight:400'>Cliquez ici pour suivre les \u00e9tapes et tout configurer.</span>"})
      ]);
      document.body.appendChild(popup);
      setTimeout(function(){if(popup.parentNode)popup.remove()},8000);
    },2000);
  }
}

function updateGuideBtn(){
  var btn=document.getElementById("dk-guide-btn");
  if(!btn)return;
  var done=st.completed.length,total=BL.length,remaining=total-done;
  var count=btn.querySelector(".dk-guide-count");
  if(count)count.textContent=remaining>0?(remaining+"/"+total):"\u2713";
}

// ════════════════════════════════════════
// PANEL
// ════════════════════════════════════════
function togglePanel(){
  st.panelOpen=!st.panelOpen;
  if(st.panelOpen){trk("onboarding_checklist_opened");renderPanel()}
  else closePanel();
}
function closePanel(){
  st.panelOpen=false;
  var p=document.getElementById("dk-panel");
  if(p)p.remove();
}
function renderPanel(){
  var ex=document.getElementById("dk-panel");if(ex)ex.remove();
  var done=st.completed.length,total=BL.length,pct=Math.round(done/total*100);

  var items=h("div",{id:"dk-items"});
  BL.forEach(function(b,i){
    var dn=isDone(b.id);
    var cls="dk-item"+(dn?" dk-completed":"");
    var numCls="dk-item-num"+(dn?" dk-done":"");
    var numTxt=dn?"\u2713":(b.num||"\u2022");

    var info=h("div",{className:"dk-item-info"},[
      h("div",{className:"dk-item-label",textContent:b.label}),
      h("div",{className:"dk-item-desc",textContent:b.desc})
    ]);

    items.appendChild(h("div",{className:cls,onClick:function(){
      if(dn)return;
      trk("checklist_item_clicked",{id:b.id});
      closePanel();
      startTour(b);
    }},[
      h("div",{className:numCls,textContent:numTxt}),
      info
    ]));
  });

  var footer=h("div",{id:"dk-panel-footer"},[
    h("button",{className:"dk-footer-btn dk-btn-subscribe",textContent:"Souscrire",onClick:function(){
      var subBtn=fN("Souscrire")||document.querySelector('[class*="subscribe"]');
      if(subBtn)subBtn.click();
      else window.open("/subscription","_self");
      closePanel();
    }}),
    h("button",{className:"dk-footer-btn dk-btn-demo",textContent:"R\u00e9servez une d\u00e9mo",onClick:function(){
      var demoBtn=fN("R\u00e9serve")||document.querySelector('a[href*="demo"]');
      if(demoBtn)demoBtn.click();
      closePanel();
    }})
  ]);

  var panel=h("div",{id:"dk-panel",className:"dk-open"},[
    h("div",{id:"dk-panel-header"},[
      h("button",{id:"dk-panel-close",innerHTML:"&times;",onClick:closePanel}),
      h("h3",{textContent:"D\u00e9marrage avec DressKare"}),
      h("p",{textContent:"Configurez votre compte pour tout automatiser"}),
      h("div",{className:"dk-pbar-row"},[
        h("div",{className:"dk-pbar"},[h("div",{className:"dk-pfill",style:"width:"+pct+"%"})]),
        h("div",{className:"dk-ptxt",textContent:done+"/"+total})
      ])
    ]),
    items,
    footer
  ]);
  document.body.appendChild(panel);
}

// ════════════════════════════════════════
// TOUR
// ════════════════════════════════════════
function startTour(b){clearTour();st.tour=b;st.step=0;trk("step_viewed",{block:b.id,step:0});renderStep()}
function renderStep(){
  clearTour();
  var b=st.tour;if(!b)return;
  var sd=b.steps[st.step];
  if(!sd){endTour(true);return}
  var tgt=sd.find();
  if(!tgt){if(st.step<b.steps.length-1){st.step++;renderStep()}else endTour(true);return}
  scr(tgt);
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    var r=tgt.getBoundingClientRect(),pad=8;
    var spot=h("div",{className:"dk-spotlight",style:"top:"+(r.top-pad)+"px;left:"+(r.left-pad)+"px;width:"+(r.width+pad*2)+"px;height:"+(r.height+pad*2)+"px"});
    document.body.appendChild(spot);
    var tot=b.steps.length,idx=st.step,pos=sd.pos||aPos(r);
    var dots=h("div",{className:"dk-tip-dots"});
    for(var i=0;i<tot;i++){dots.appendChild(h("div",{className:"dk-tip-dot"+(i===idx?" dk-active":i<idx?" dk-past":"")}))}
    var acts=h("div",{className:"dk-tip-actions"});
    if(idx>0)acts.appendChild(h("button",{className:"dk-btn dk-btn-sec",textContent:"Pr\u00e9c\u00e9dent",onClick:function(){st.step--;renderStep()}}));
    if(idx<tot-1)acts.appendChild(h("button",{className:"dk-btn dk-btn-pri",textContent:"Suivant",onClick:function(){st.step++;trk("step_viewed",{block:b.id,step:st.step});renderStep()}}));
    else acts.appendChild(h("button",{className:"dk-btn dk-btn-pri",textContent:"Termin\u00e9 \u2713",onClick:function(){endTour(true)}}));
    var ad={top:"bottom",bottom:"top",left:"right",right:"left"}[pos];
    var tip=h("div",{className:"dk-tip"},[
      h("button",{className:"dk-tip-close",innerHTML:"&times;",onClick:function(){endTour(false)}}),
      tot>1?h("div",{className:"dk-tip-badge",textContent:"\u00c9tape "+(idx+1)+"/"+tot}):null,
      h("div",{className:"dk-tip-title",textContent:sd.title}),
      h("div",{className:"dk-tip-body",innerHTML:sd.body}),
      h("div",{className:"dk-tip-footer"},[dots,acts]),
      h("div",{className:"dk-tip-arrow dk-arr-"+ad})
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
    st._rh=function(){renderStep()};
    window.addEventListener("resize",st._rh);
  })});
}
function endTour(ok){clearTour();var b=st.tour;if(b&&ok)complete(b.id);else if(b)trk("step_skipped",{block:b.id});st.tour=null;st.step=0}
function clearTour(){st.els.forEach(function(e){e.remove()});st.els=[];if(st._rh)window.removeEventListener("resize",st._rh)}

// ════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════
window.DemoDK={
  reset:function(){localStorage.removeItem(SK);st.completed=[];st.firstSeen=null;clearTour();document.querySelectorAll("#dk-guide-btn,#dk-panel,#dk-popup,#demodk-css").forEach(function(e){e.remove()});window.__DEMODK_LOADED__=false;console.log("[D\u00e9moDK] Reset")},
  complete:complete,
  startTour:function(id){var b=BL.find(function(x){return x.id===id});if(b)startTour(b)},
  openPanel:function(){if(!st.panelOpen)togglePanel()}
};

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
function init(){
  if(isExpired())return; // Ne plus afficher après 14 jours
  // Attendre que la sidebar soit chargée
  var attempts=0;
  var check=setInterval(function(){
    attempts++;
    var sidebar=document.querySelector(".v-navigation-drawer__append");
    if(sidebar){
      clearInterval(check);
      insertGuideBtn();
      trk("onboarding_loaded");
    }
    if(attempts>30)clearInterval(check);
  },500);
}

setTimeout(init,1000);

})();
