/**
 * DemoDK v5 — Onboarding in-app pour app.dresskare.com
 * Bouton header, tours interactifs, actions reelles (ouverture modals, clic produits, navigation)
 * Ordre: Navigation > Import > Extension > Republier > Ajouter articles > Automatisations > Commandes
 */
(function(){
"use strict";
if(window.__DEMODK_LOADED__)return;
window.__DEMODK_LOADED__=true;

var C="#FFA944",SK="demodk_v5",DAYS=14;

// === STORAGE ===
function ls(){try{return JSON.parse(localStorage.getItem(SK))||{}}catch(e){return{}}}
function ss(o){localStorage.setItem(SK,JSON.stringify(o))}
function gS(k){return ls()[k]}
function sS(k,v){var o=ls();o[k]=v;ss(o)}

// === TRACKING ===
function trk(e,d){if(window.dataLayer)window.dataLayer.push({event:e,source:"demodk"});console.log("[DemoDK]",e,d||"")}

// === HELPERS ===
function h(tag,a,c){var e=document.createElement(tag);if(a)Object.keys(a).forEach(function(k){if(k==="className")e.className=a[k];else if(k==="innerHTML")e.innerHTML=a[k];else if(k==="textContent")e.textContent=a[k];else if(k==="style")e.style.cssText=a[k];else if(k.slice(0,2)==="on"&&typeof a[k]==="function")e.addEventListener(k.slice(2).toLowerCase(),a[k]);else e.setAttribute(k,a[k])});if(c)(Array.isArray(c)?c:[c]).forEach(function(x){if(!x)return;typeof x==="string"?e.appendChild(document.createTextNode(x)):e.appendChild(x)});return e}
function fN(t){return Array.from(document.querySelectorAll(".v-navigation-drawer__content .v-list-item")).find(function(e){return e.textContent.trim().indexOf(t)===0})}
function fB(t){return Array.from(document.querySelectorAll(".v-btn,button")).find(function(e){return e.textContent.trim().indexOf(t)!==-1})}
function fM(t){var m=document.querySelector("main");if(!m)return null;return Array.from(m.querySelectorAll("*")).find(function(e){return e.children.length<=4&&e.textContent.trim().indexOf(t)!==-1&&e.textContent.trim().length<t.length+60})}
function scr(el){var r=el.getBoundingClientRect();if(r.top<0||r.bottom>window.innerHeight)el.scrollIntoView({behavior:"smooth",block:"center"})}
function aPos(r){var b=window.innerHeight-r.bottom,t=r.top,ri=window.innerWidth-r.right,l=r.left,mx=Math.max(b,t,ri,l);if(mx===b)return"bottom";if(mx===t)return"top";if(mx===ri)return"right";return"left"}

function navTo(navText,cb){
  var item=fN(navText);
  if(item){item.click();setTimeout(cb||function(){},1500)}
  else if(cb)cb();
}

// === CSS ===
var css=document.createElement("style");css.id="demodk-css";
css.textContent=[
"#dk-btn{cursor:pointer;transition:all .2s;padding:8px 16px !important;border-radius:8px !important;background:"+C+" !important;color:#fff !important;font-weight:600 !important;font-size:13px !important;display:inline-flex !important;align-items:center !important;gap:8px !important;border:none !important;box-shadow:0 2px 10px rgba(255,169,68,.3) !important;white-space:nowrap !important;height:36px !important;vertical-align:middle !important;margin-left:8px !important}",
"#dk-btn:hover{filter:brightness(1.05);transform:translateY(-1px)}",
"#dk-btn .dk-cnt{background:rgba(255,255,255,.25);font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px}",
"@keyframes dkPulse{0%,100%{box-shadow:0 2px 10px rgba(255,169,68,.3)}50%{box-shadow:0 2px 22px rgba(255,169,68,.7)}}",
"#dk-btn.dk-pulse{animation:dkPulse 2s ease infinite}",
"#dk-bubble{position:fixed;z-index:99970;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.15);padding:12px 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:dkBubble .4s ease;max-width:260px;border-left:4px solid "+C+";display:flex;align-items:center;gap:10px}",
"@keyframes dkBubble{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}",
"#dk-bubble p{font-size:12px;color:#333;margin:0;line-height:1.4;flex:1}",
"#dk-bubble .dk-bubble-x{background:none;border:none;color:#ccc;cursor:pointer;font-size:14px;padding:2px;flex-shrink:0}",
"#dk-bubble .dk-bubble-x:hover{color:#888}",
"#dk-panel{position:fixed;z-index:99975;width:400px;max-height:calc(100vh - 100px);background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:none;flex-direction:column;overflow:hidden;animation:dkU .3s ease}",
"#dk-panel.dk-open{display:flex}",
"@keyframes dkU{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}",
"#dk-hdr{padding:20px 22px 16px;background:"+C+";color:#fff;position:relative}",
"#dk-hdr h3{font-size:16px;font-weight:700;margin:0 0 2px}#dk-hdr p{font-size:12px;opacity:.9;margin:0}",
"#dk-cls{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.15);border:none;color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px}#dk-cls:hover{background:rgba(255,255,255,.25)}",
".dk-prow{display:flex;align-items:center;gap:10px;margin-top:10px}.dk-pbar{flex:1;background:rgba(255,255,255,.25);border-radius:99px;height:5px;overflow:hidden}.dk-pfill{height:100%;background:#fff;border-radius:99px;transition:width .5s ease}.dk-ptxt{font-size:11px;font-weight:600;opacity:.9}",
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
"#dk-ft{padding:10px 0 12px;border-top:1px solid #f0f0f4;display:flex;flex-direction:column;gap:6px;align-items:center}",
".dk-fb{display:block;width:calc(100% - 40px);text-align:center;padding:9px 0;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:inherit}",
".dk-sub{background:"+C+";color:#fff}.dk-sub:hover{filter:brightness(1.05)}",
".dk-dem{background:#f5f5f8;color:#555}.dk-dem:hover{background:#eee}",
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
"#dk-cta{position:fixed;left:100px;bottom:20px;z-index:99980;background:#fff;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.15);padding:16px 20px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;animation:dkU .4s ease;max-width:300px;border-left:4px solid "+C+";display:flex;flex-direction:column;gap:8px}",
"#dk-cta p{font-size:13px;color:#333;margin:0;line-height:1.4}",
"#dk-cta .dk-cta-btn{background:"+C+";color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;align-self:flex-start}",
"#dk-cta .dk-cta-btn:hover{filter:brightness(1.08)}",
"#dk-cta .dk-cta-x{position:absolute;top:6px;right:8px;background:none;border:none;color:#ccc;cursor:pointer;font-size:14px}"
].join("\n");
document.head.appendChild(css);

// === STATE ===
var st={completed:gS("completed")||[],panelOpen:false,tour:null,step:0,els:[]};
var firstSeen=gS("firstSeen");
if(!firstSeen){firstSeen=new Date().toISOString();sS("firstSeen",firstSeen)}
function isExpired(){return(Date.now()-new Date(firstSeen).getTime())/(864e5)>DAYS}
function isDone(id){return st.completed.indexOf(id)!==-1}
function complete(id){if(st.completed.indexOf(id)===-1){st.completed.push(id);sS("completed",st.completed);trk("onboarding_step_completed",{block_id:id});updateBtn();if(st.panelOpen)renderPanel()}}

// === BLOCS ===
var BL=[
  // 0 - Decouvrir le menu
  {id:"nav",num:"",label:"D\u00e9couvrir le menu",desc:"Familiarisez-vous avec l\u2019interface",route:null,
   steps:[
    {find:function(){return fN("Dashboard")},title:"Dashboard",body:"Votre <strong>page d\u2019accueil</strong> : statistiques, \u00e9tapes de d\u00e9marrage et derniers articles.",pos:"right"},
    {find:function(){return fN("Stock")},title:"Stock",body:"<strong>Tous vos articles</strong> sont ici. Importez, ajoutez, filtrez et g\u00e9rez votre inventaire.",pos:"right"},
    {find:function(){return fN("Republier")},title:"Republier",body:"Remettez vos articles <strong>en haut des r\u00e9sultats Vinted</strong> pour plus de visibilit\u00e9. Un levier puissant.",pos:"right"},
    {find:function(){return fN("Automatisation")},title:"Automatisation",body:"Messages automatiques, acceptation d\u2019offres, republication programm\u00e9e\u2026 <strong>Tout se configure ici.</strong>",pos:"right"},
    {find:function(){return fN("Contacts")},title:"Contacts / Fournisseurs",body:"G\u00e9rez vos <strong>fournisseurs de v\u00eatements</strong>. Cr\u00e9ez vos contacts, ajoutez des <strong>lots</strong> et g\u00e9rez vos <strong>d\u00e9p\u00f4ts</strong> de marchandise.",pos:"right"},
    {find:function(){return fN("D\u00e9p\u00f4ts")},title:"D\u00e9p\u00f4ts / Lots",body:"Suivez vos <strong>d\u00e9p\u00f4ts de v\u00eatements</strong> re\u00e7us de vos fournisseurs et les lots associ\u00e9s.",pos:"right"},
    {find:function(){return fN("Resell")},title:"Resell",body:"Le <strong>bot d\u2019achat/revente</strong> int\u00e9gr\u00e9 \u00e0 DressKare. Automatisez vos achats pour la revente.",pos:"right"},
    {find:function(){return fN("Suivi")},title:"Suivi de l\u2019activit\u00e9",body:"Retrouvez <strong>toutes vos commandes Vinted</strong>, vos exp\u00e9ditions et votre historique de ventes.",pos:"right"},
    {find:function(){return fN("Param")},title:"Param\u00e8tres",body:"Configurez votre <strong>profil, prompts IA, mannequin IA, connecteurs</strong> et tarifs.",pos:"right"}
  ]},

  // 1 - Importer votre dressing Vinted
  {id:"import",num:"1",label:"Importer votre dressing Vinted",desc:"Sauvegardez et republiez vos articles",route:"_smart",
   steps:function(){
    // Case 1: no articles yet -> go to /repost for import
    var hasArticles=document.querySelectorAll(".product-card-light").length>0;
    if(!hasArticles){
      return [
        {find:function(){return fM("Importer tes articles Vinted")||fM("Importer mon Vinted")||fM("Importer")||fB("Synchroniser")},title:"Importez votre dressing Vinted",body:"Collez l\u2019URL de votre profil Vinted pour <strong>importer jusqu\u2019\u00e0 1\u202f000 articles</strong> (hors brouillons, masqu\u00e9s ou vendus). Ils seront sauvegard\u00e9s et pr\u00eats \u00e0 republier.<br><br><strong>Astuce :</strong> vous pouvez connecter <strong>plusieurs comptes Vinted</strong> pour tout g\u00e9rer au m\u00eame endroit.",pos:"bottom"},
        {find:function(){return fB("Synchroniser ton Vinted")||fB("Synchroniser")},title:"Lancez la synchronisation",body:"Cliquez ici pour <strong>lancer l\u2019import</strong>. Vos articles appara\u00eetront dans la liste. L\u2019import peut prendre quelques minutes.",pos:"bottom"}
      ];
    }
    // Case 2: articles exist -> point to Parametres > Mes infos for multi-account
    return [
      {find:function(){return fN("Param")},title:"Vos articles sont d\u00e9j\u00e0 import\u00e9s !",body:"Vous avez d\u00e9j\u00e0 des articles en stock. Pour ajouter d\u2019autres comptes Vinted, rendez-vous dans <strong>Param\u00e8tres > Mes infos</strong>.",pos:"right"},
      {find:function(){return fN("Param")},title:"Multi-compte Vinted",body:"Dans <strong>Param\u00e8tres > Mes infos</strong>, vous pouvez <strong>ajouter plusieurs profils Vinted</strong> et les importer. Id\u00e9al pour g\u00e9rer plusieurs comptes depuis un seul endroit.",pos:"right"}
    ];
   }},

  // 2 - Extension Chrome
  {id:"ext",num:"2",label:"Installer l\u2019extension Chrome",desc:"Import en 1 clic + republication + suivi",route:null,
   steps:[
    {find:function(){return document.querySelector(".extension-indicator")||document.querySelector("span[class*=extension-indicator]")},title:"L\u2019extension Chrome DressKare",body:"L\u2019extension connecte DressKare \u00e0 Vinted. Elle permet l\u2019<strong>import en 1 clic</strong>, la <strong>republication</strong> et le <strong>suivi des commandes</strong> directement depuis Vinted.<br><br><strong>Aucun risque de ban</strong> : l\u2019extension respecte les conditions d\u2019utilisation de Vinted. Des milliers de vendeurs l\u2019utilisent quotidiennement.<br><br><em>Pensez \u00e0 toujours garder <strong>un onglet Vinted ouvert</strong> pour que l\u2019extension fonctionne.</em>",pos:"bottom"}
  ]},

  // 3 - Republier vos articles
  {id:"repub",num:"3",label:"Republier vos articles",desc:"Boostez votre visibilit\u00e9 en masse",route:"/repost",
   steps:[
    {find:function(){return fM("articles")||document.querySelector("h1")},title:"La page Republier",body:"Ici vous g\u00e9rez la <strong>republication de vos articles en masse</strong>. Republier remet vos annonces en haut des r\u00e9sultats Vinted automatiquement, ce qui augmente leur visibilit\u00e9.",pos:"bottom"},
    {find:function(){return fB("Configurer la republication")},title:"Les r\u00e8gles de republication",body:"Les r\u00e8gles sont <strong>d\u00e9j\u00e0 optimis\u00e9es par d\u00e9faut</strong> mais vous pouvez les personnaliser :<br><br>\u2022 <strong>Renommage des images</strong> (obligatoire) : Vinted d\u00e9tecte les doublons par image, le renommage contourne ce filtre<br>\u2022 <strong>Modification des photos</strong> : l\u00e9ger zoom/recadrage pour rendre chaque republication unique<br>\u2022 <strong>R\u00e9g\u00e9n\u00e9ration IA</strong> : r\u00e9\u00e9crit automatiquement les descriptions pour plus de fra\u00eecheur<br>\u2022 <strong>Temps d\u2019espacement</strong> : d\u00e9lais entre chaque op\u00e9ration pour rester discret",pos:"bottom",action:function(){var b=fB("Configurer la republication");if(b)b.click()}},
    {find:function(){return fB("Republier")||fB("Tout republier")},title:"Republier en masse",body:"S\u00e9lectionnez vos articles et cliquez <strong>Republier</strong> pour les remettre en haut des r\u00e9sultats <strong>en masse</strong>. Plus besoin de le faire un par un !",pos:"bottom"}
  ]},

  // 4 - Ajouter des articles
  {id:"articles",num:"4",label:"Ajouter des articles",desc:"Fiche produit \u00b7 Prompts IA \u00b7 Mannequin \u00b7 Publier",route:"/stock",
   steps:[
    {find:function(){return fB("Ajouter des articles")},title:"Ajoutez vos articles",body:"Cliquez ici pour <strong>ouvrir la fen\u00eatre d\u2019ajout</strong>. Vous pouvez ajouter des articles manuellement, par photo, ou via import depuis Vinted.",pos:"bottom",action:function(){
      // Open the modal
      var btn=fB("Ajouter des articles");
      if(btn)btn.click();
    }},
    {find:function(){
      // Wait for the modal to appear
      return document.querySelector(".v-dialog--active")||fM("Choisissez votre mode");
    },title:"Les modes d\u2019ajout",body:"Choisissez comment ajouter vos articles :<br><br>\u2022 <strong>Ajouter un article</strong> : ajout manuel avec photos<br>\u2022 <strong>Ajouter en masse</strong> : import de plusieurs articles d\u2019un coup<br>\u2022 <strong>Importer tes articles</strong> : depuis un fichier CSV<br>\u2022 <strong>Importer ton dressing Vinted</strong> : synchronisation directe",pos:"bottom"},
    {find:function(){
      // Close dialog and point to a product card
      var dialog=document.querySelector(".v-dialog--active .v-card__actions button, .v-dialog--active .mdi-close");
      if(dialog)dialog.click();
      var card=document.querySelector(".product-card-light");
      return card;
    },title:"La fiche produit",body:"Cliquez sur un article pour voir sa <strong>fiche compl\u00e8te</strong> : photos, titre, description g\u00e9n\u00e9r\u00e9e par l\u2019IA, prix, attributs et rendu mannequin IA.",pos:"right",action:function(){
      var card=document.querySelector(".product-card-light");
      if(card)card.click();
    }},
    {find:function(){return fB("Publier")},title:"Publiez sur Vinted",body:"S\u00e9lectionnez vos articles puis cliquez <strong>Publier</strong> pour les mettre en ligne sur Vinted en un clic.",pos:"bottom"},
    {find:function(){return fN("Param")},title:"Personnalisez vos prompts IA",body:"Dans <strong>Param\u00e8tres > Mes annonces</strong>, personnalisez comment l\u2019IA g\u00e9n\u00e8re vos titres et descriptions. Vous pouvez cr\u00e9er plusieurs templates.",pos:"right"},
    {find:function(){return fN("Param")},title:"Configurez le mannequin IA",body:"Dans <strong>Param\u00e8tres > Mannequin IA</strong>, configurez le genre, la morphologie, la posture et le fond pour vos photos mannequin.",pos:"right"}
  ]},

  // 5 - Automatisations
  {id:"auto",num:"5",label:"Activer mes automatisations",desc:"Gagnez du temps au quotidien",route:"/automation",
   steps:[
    {find:function(){return fM("Automatisez vos messages")||fM("Automatisation")||document.querySelector("h1")},title:"Vos automatisations",body:"DressKare propose <strong>5 automatisations pr\u00eates \u00e0 l\u2019emploi</strong>. Il suffit de les activer avec le switch.",pos:"bottom"},
    {find:function(){return fM("Republication auto")},title:"Republication automatique",body:"<strong>Republie automatiquement</strong> vos articles selon les r\u00e8gles que vous avez configur\u00e9es. Activez le switch pour d\u00e9marrer.",pos:"right"},
    {find:function(){return fM("Synchronisation des commandes")},title:"Synchro commandes",body:"<strong>Synchronise automatiquement</strong> vos commandes Vinted. Vous retrouvez tout dans le suivi d\u2019activit\u00e9.",pos:"right"},
    {find:function(){return fM("Remerciement apr")},title:"Remerciement apr\u00e8s vente",body:"Envoie un <strong>message de remerciement automatique</strong> \u00e0 chaque acheteur. Fid\u00e9lisez vos clients sans effort.",pos:"right"},
    {find:function(){return fM("Acceptation")},title:"Acceptation automatique",body:"<strong>Accepte ou refuse automatiquement</strong> les offres selon vos crit\u00e8res (ex: max -20%). Plus besoin de surveiller.",pos:"right"},
    {find:function(){return fM("Message sur favori")},title:"Message sur favori",body:"Envoie un <strong>message aux utilisateurs qui mettent en favori</strong> vos articles. Transformez l\u2019int\u00e9r\u00eat en vente.",pos:"right"},
    {find:function(){return fB("Nouvelle automatisation")},title:"Cr\u00e9ez les v\u00f4tres",body:"Vous pouvez aussi <strong>cr\u00e9er vos propres automatisations</strong> personnalis\u00e9es.",pos:"bottom"}
  ]},

  // 6 - Commandes
  {id:"orders",num:"6",label:"Suivre mes commandes",desc:"Pilotez votre activit\u00e9",route:"_orders",
   steps:[
    {find:function(){return fN("Mes commandes")||fM("Rechercher commande")},title:"Mes commandes",body:"Voici la page <strong>Mes commandes</strong>. Vous retrouvez ici toutes vos ventes Vinted avec le d\u00e9tail de chaque commande.",pos:"bottom"},
    {find:function(){return fB("Importer commandes")},title:"Importer les commandes",body:"Cliquez ici pour <strong>importer vos commandes depuis Vinted</strong>. Elles seront synchronis\u00e9es automatiquement.",pos:"bottom"},
    {find:function(){return fB("Exporter")},title:"Exporter",body:"<strong>Exportez vos commandes</strong> en fichier pour votre comptabilit\u00e9 ou suivi externe.",pos:"bottom"},
    {find:function(){return fB("Imprimer bordereaux")},title:"Imprimer les bordereaux",body:"G\u00e9n\u00e9rez et imprimez vos <strong>bordereaux d\u2019exp\u00e9dition</strong> directement depuis DressKare. Tout est centralis\u00e9.",pos:"bottom"},
    {find:function(){return fN("Factures")||fM("Factures")},title:"Factures",body:"Acc\u00e9dez \u00e0 vos <strong>factures</strong> pour le suivi financier de votre activit\u00e9.",pos:"right"}
  ]}
];

// === GUIDE BUTTON ===
function insertBtn(){
  if(document.getElementById("dk-btn"))return;
  var ajouterBtn=fB("Ajouter des articles")||fB("Ajouter mes articles");
  var parent=null;
  if(ajouterBtn) parent=ajouterBtn.parentElement;
  if(!parent) parent=document.querySelector(".v-toolbar__items")||document.querySelector("header .v-toolbar__content");
  if(!parent)return;
  var done=st.completed.length,total=BL.length,rem=total-done;
  var btn=h("button",{id:"dk-btn",className:rem===total?"dk-pulse":"",onClick:function(){togglePanel()}},[
    h("span",{innerHTML:"&#128640;",style:"font-size:14px"}),
    h("span",{textContent:"D\u00e9marrage",style:"font-size:13px"}),
    h("span",{className:"dk-cnt",textContent:rem>0?(rem+"/"+total):"\u2713"})
  ]);
  if(ajouterBtn&&ajouterBtn.nextSibling) parent.insertBefore(btn,ajouterBtn.nextSibling);
  else parent.appendChild(btn);
}
function updateBtn(){
  var btn=document.getElementById("dk-btn");if(!btn)return;
  var done=st.completed.length,total=BL.length,rem=total-done;
  var cnt=btn.querySelector(".dk-cnt");
  if(cnt)cnt.textContent=rem>0?(rem+"/"+total):"\u2713";
  btn.classList.toggle("dk-pulse",rem===total);
}

// === INCITATION BUBBLE ===
function showBubble(){
  if(document.getElementById("dk-bubble"))return;
  var btn=document.getElementById("dk-btn");
  if(!btn)return;
  if(gS("bubbleDismissed"))return;
  if(st.completed.length===BL.length)return;
  var bubble=h("div",{id:"dk-bubble"},[
    h("p",{innerHTML:"<strong>\uD83D\uDC4B Configurez votre compte !</strong><br>Cliquez ici pour suivre le guide de d\u00e9marrage."}),
    h("button",{className:"dk-bubble-x",innerHTML:"&times;",onClick:function(){bubble.remove();sS("bubbleDismissed",true)}})
  ]);
  document.body.appendChild(bubble);
  requestAnimationFrame(function(){
    var r=btn.getBoundingClientRect();
    bubble.style.top=(r.bottom+10)+"px";
    bubble.style.left=Math.max(12,r.left+r.width/2-130)+"px";
  });
  setTimeout(function(){var b=document.getElementById("dk-bubble");if(b)b.remove()},8000);
}

// === PANEL ===
function togglePanel(){
  st.panelOpen=!st.panelOpen;
  var bubble=document.getElementById("dk-bubble");if(bubble)bubble.remove();
  st.panelOpen?(trk("checklist_opened"),renderPanel()):closePanel();
}
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
  var btn=document.getElementById("dk-btn");
  var panelTop="70px",panelLeft="200px";
  if(btn){
    var r=btn.getBoundingClientRect();
    panelTop=(r.bottom+10)+"px";
    panelLeft=Math.max(12,Math.min(r.left,window.innerWidth-420))+"px";
  }
  var panel=h("div",{id:"dk-panel",className:"dk-open",style:"top:"+panelTop+";left:"+panelLeft},[
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

// === LAUNCH BLOCK ===
function launchBlock(b){
  var route=b.route;

  // Smart routing for import
  if(route==="_smart"){
    var hasArticles=document.querySelectorAll(".product-card-light").length>0;
    if(!hasArticles && window.location.pathname!=="/repost"){
      navTo("Republier",function(){startTour(b)});
      return;
    }
    startTour(b);
    return;
  }

  // Orders: navigate to Suivi > Mes commandes
  if(route==="_orders"){
    navTo("Suivi",function(){
      setTimeout(function(){
        var sub=fN("Mes commandes");
        if(sub)sub.click();
        setTimeout(function(){startTour(b)},1200);
      },800);
    });
    return;
  }

  if(route && window.location.pathname!==route){
    var map={"/repost":"Republier","/automation":"Automatisation","/stock":"Stock","/":" Dashboard"};
    var navText=map[route];
    if(navText){
      navTo(navText.trim(),function(){startTour(b)});
    } else {
      window.location.href=route;
    }
  } else {
    startTour(b);
  }
}

// === TOUR ===
function startTour(b){
  clearTour();st.tour=b;st.step=0;trk("tour_started",{block:b.id});
  // Resolve dynamic steps
  st._steps=typeof b.steps==="function"?b.steps():b.steps;
  renderStep();
}
function renderStep(){
  clearTour();var b=st.tour;if(!b)return;
  var steps=st._steps||b.steps;
  if(typeof steps==="function")steps=steps();
  var sd=steps[st.step];
  if(!sd){endTour(true);return}
  var tgt=sd.find();
  if(!tgt){
    // Skip missing steps but don't auto-complete
    if(st.step<steps.length-1){st.step++;renderStep()}
    else endTour(true);
    return;
  }
  scr(tgt);
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    var r=tgt.getBoundingClientRect(),pad=8;
    var spot=h("div",{className:"dk-spot",style:"top:"+(r.top-pad)+"px;left:"+(r.left-pad)+"px;width:"+(r.width+pad*2)+"px;height:"+(r.height+pad*2)+"px"});
    document.body.appendChild(spot);
    var tot=steps.length,idx=st.step,pos=sd.pos||aPos(r);
    var dots=h("div",{className:"dk-dots"});
    for(var i=0;i<tot;i++){dots.appendChild(h("div",{className:"dk-dot"+(i===idx?" dk-a":i<idx?" dk-p":"")}))}
    var acts=h("div",{className:"dk-acts"});
    if(idx>0)acts.appendChild(h("button",{className:"dk-b dk-bs",textContent:"Pr\u00e9c\u00e9dent",onClick:function(){st.step--;renderStep()}}));
    if(idx<tot-1)acts.appendChild(h("button",{className:"dk-b dk-bp",textContent:"Suivant",onClick:function(){
      // Execute action if defined on current step
      if(sd.action)sd.action();
      st.step++;
      // Delay renderStep if action was executed (wait for DOM to update)
      if(sd.action)setTimeout(renderStep,800);
      else renderStep();
    }}));
    else acts.appendChild(h("button",{className:"dk-b dk-bp",textContent:"Termin\u00e9 \u2713",onClick:function(){endTour(true)}}));
    var ad={top:"ab",bottom:"at",left:"ar",right:"al"}[pos];
    var bodyHtml=typeof sd.body==="function"?sd.body():sd.body;
    var tip=h("div",{className:"dk-tip"},[
      h("button",{className:"dk-x",innerHTML:"&times;",onClick:function(){endTour(false)}}),
      tot>1?h("div",{className:"dk-badge",textContent:"\u00c9tape "+(idx+1)+"/"+tot}):null,
      h("div",{className:"dk-ttl",textContent:sd.title}),
      h("div",{className:"dk-bdy",innerHTML:bodyHtml}),
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
function endTour(ok){clearTour();var b=st.tour;if(b&&ok)complete(b.id);else if(b)trk("tour_skipped",{block:b.id});st.tour=null;st.step=0;st._steps=null}
function clearTour(){st.els.forEach(function(e){e.remove()});st.els=[];if(st._rh)window.removeEventListener("resize",st._rh)}

// === CTA / RELANCE ===
function showCTA(){
  if(document.getElementById("dk-cta"))return;
  var dismissed=gS("ctaDismissed")||0;
  var lastDismiss=gS("ctaLastDismiss")||0;
  var hoursSince=(Date.now()-lastDismiss)/(36e5);
  if(dismissed>=5)return;
  if(dismissed>0 && hoursSince<24)return;
  if(st.completed.length===BL.length)return;
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

// === PUBLIC API ===
window.DemoDK={
  reset:function(){localStorage.removeItem(SK);st.completed=[];clearTour();document.querySelectorAll("#dk-btn,#dk-panel,#dk-cta,#dk-bubble,#demodk-css,.dk-tip,.dk-spot").forEach(function(e){e.remove()});window.__DEMODK_LOADED__=false;console.log("[DemoDK] Reset")},
  complete:complete,
  startTour:function(id){var b=BL.find(function(x){return x.id===id});if(b)launchBlock(b)},
  openPanel:function(){if(!st.panelOpen)togglePanel()},
  showCTA:showCTA
};

// === INIT ===
function init(){
  if(isExpired())return;
  var attempts=0;
  var check=setInterval(function(){
    attempts++;
    var ajouterBtn=fB("Ajouter des articles")||fB("Ajouter mes articles");
    var toolbar=document.querySelector(".v-toolbar__items")||document.querySelector("header .v-toolbar__content");
    if(ajouterBtn||toolbar){
      clearInterval(check);
      insertBtn();
      trk("onboarding_loaded");
      setTimeout(showBubble,2000);
      setTimeout(showCTA,5000);
    }
    if(attempts>30)clearInterval(check);
  },500);
}
setTimeout(init,800);
})();
