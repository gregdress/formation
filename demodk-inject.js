/**
 * DémoDK — Surcouche onboarding injectable pour app.dresskare.com
 *
 * UN SEUL FICHIER à injecter. Contient tout :
 * - CSS intégré
 * - Checklist flottante en bas à droite
 * - Product tours avec spotlight
 * - Tracking analytics
 * - Détection de page / route
 * - Persistance localStorage
 *
 * Installation :
 *   <script src="demodk-inject.js"></script>
 *   OU via console : document.head.appendChild(Object.assign(document.createElement('script'), {src: 'URL'}))
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // Empêcher double chargement
  // ═══════════════════════════════════════════════════════════════
  if (window.__DEMODK_LOADED__) return;
  window.__DEMODK_LOADED__ = true;

  // ═══════════════════════════════════════════════════════════════
  // CONFIG
  // ═══════════════════════════════════════════════════════════════
  var PRIMARY = '#E85D75';
  var STORAGE_KEY = 'demodk_onboarding';
  var DEBUG = true;

  // ═══════════════════════════════════════════════════════════════
  // CSS INJECTION
  // ═══════════════════════════════════════════════════════════════
  var css = document.createElement('style');
  css.id = 'demodk-css';
  css.textContent = `
    /* ─── Checklist Trigger ─── */
    #dk-trigger {
      position: fixed; bottom: 24px; right: 24px; z-index: 99970;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${PRIMARY}; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(232,93,117,0.45);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; transition: all 0.3s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #dk-trigger:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(232,93,117,0.55); }
    #dk-trigger .dk-badge {
      position: absolute; top: -5px; right: -5px;
      background: #fff; color: ${PRIMARY}; font-size: 11px; font-weight: 800;
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    #dk-trigger svg { width: 66px; height: 66px; position: absolute; top: -3px; left: -3px; transform: rotate(-90deg); }
    #dk-trigger .dk-ring-bg { fill: none; stroke: rgba(255,255,255,0.2); stroke-width: 3; }
    #dk-trigger .dk-ring-fg { fill: none; stroke: #fff; stroke-width: 3; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
    #dk-trigger .dk-icon { position: relative; z-index: 1; }

    /* ─── Checklist Panel ─── */
    #dk-panel {
      position: fixed; bottom: 96px; right: 24px; z-index: 99975;
      width: 370px; max-height: calc(100vh - 140px);
      background: #fff; border-radius: 16px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: none; flex-direction: column; overflow: hidden;
      animation: dkSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    #dk-panel.dk-open { display: flex; }
    @keyframes dkSlideUp { from { opacity:0; transform: translateY(20px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }

    #dk-panel-header {
      padding: 22px 22px 18px; background: ${PRIMARY}; color: #fff; position: relative;
    }
    #dk-panel-header h3 { font-size: 17px; font-weight: 700; margin: 0 0 3px; }
    #dk-panel-header p { font-size: 12px; opacity: 0.85; margin: 0; line-height: 1.4; }
    #dk-panel-close {
      position: absolute; top: 10px; right: 10px;
      background: rgba(255,255,255,0.15); border: none; color: #fff;
      width: 26px; height: 26px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 16px;
    }
    #dk-panel-close:hover { background: rgba(255,255,255,0.25); }

    .dk-progress-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
    .dk-progress-bar { flex: 1; background: rgba(255,255,255,0.25); border-radius: 99px; height: 5px; overflow: hidden; }
    .dk-progress-fill { height: 100%; background: #fff; border-radius: 99px; transition: width 0.5s ease; }
    .dk-progress-text { font-size: 12px; font-weight: 600; opacity: 0.9; white-space: nowrap; }

    #dk-items { padding: 6px 0; overflow-y: auto; flex: 1; }

    .dk-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 22px; cursor: pointer; transition: background 0.15s;
    }
    .dk-item:hover { background: #fafafc; }
    .dk-item.dk-locked { opacity: 0.4; cursor: not-allowed; }
    .dk-item-icon {
      width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; margin-top: 2px; border: 2px solid #ddd;
    }
    .dk-item-icon.dk-done { background: ${PRIMARY}; border-color: ${PRIMARY}; color: #fff; }
    .dk-item-icon.dk-lock { background: #f5f5f8; border-color: #e0e0e8; color: #bbb; }
    .dk-item-info { flex: 1; min-width: 0; }
    .dk-item-label { font-size: 13px; font-weight: 600; color: #1a1a2e; line-height: 1.3; }
    .dk-item.dk-completed .dk-item-label { color: #aaa; text-decoration: line-through; }
    .dk-item-desc { font-size: 11px; color: #999; margin-top: 2px; }
    .dk-item-cta { font-size: 11px; color: ${PRIMARY}; font-weight: 600; margin-top: 3px; }

    #dk-panel-footer {
      padding: 10px 22px; border-top: 1px solid #f0f0f4; text-align: center;
    }
    #dk-panel-footer a { font-size: 11px; color: #999; cursor: pointer; text-decoration: none; }
    #dk-panel-footer a:hover { color: ${PRIMARY}; }

    /* ─── Tour Spotlight ─── */
    .dk-spotlight {
      position: fixed; z-index: 99991;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.55);
      border-radius: 6px; transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      pointer-events: none;
    }

    /* ─── Tour Tooltip ─── */
    .dk-tip {
      position: fixed; z-index: 99995;
      background: #fff; border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 22px 22px 18px; max-width: 380px; min-width: 280px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: dkPopIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes dkPopIn { from { opacity:0; transform: scale(0.92) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }

    .dk-tip-badge { display: inline-block; background: ${PRIMARY}; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 99px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.4px; }
    .dk-tip-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; line-height: 1.3; }
    .dk-tip-body { font-size: 13px; line-height: 1.55; color: #5a5a78; margin-bottom: 16px; }
    .dk-tip-body strong { color: #1a1a2e; }
    .dk-tip-footer { display: flex; align-items: center; justify-content: space-between; }
    .dk-tip-dots { display: flex; gap: 4px; }
    .dk-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; }
    .dk-tip-dot.dk-active { background: ${PRIMARY}; width: 18px; border-radius: 3px; }
    .dk-tip-dot.dk-past { background: ${PRIMARY}; }
    .dk-tip-actions { display: flex; gap: 6px; }
    .dk-tip-close { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #ccc; font-size: 18px; cursor: pointer; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
    .dk-tip-close:hover { background: #f2f2f7; color: #888; }

    .dk-btn { border: none; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
    .dk-btn-pri { background: ${PRIMARY}; color: #fff; }
    .dk-btn-pri:hover { filter: brightness(1.08); }
    .dk-btn-sec { background: #f2f2f7; color: #555; }
    .dk-btn-sec:hover { background: #e8e8f0; }

    .dk-tip-arrow { position: absolute; width: 12px; height: 12px; background: #fff; transform: rotate(45deg); }
    .dk-tip-arrow.dk-arr-top { top: -6px; left: 50%; margin-left: -6px; box-shadow: -2px -2px 4px rgba(0,0,0,0.04); }
    .dk-tip-arrow.dk-arr-bottom { bottom: -6px; left: 50%; margin-left: -6px; box-shadow: 2px 2px 4px rgba(0,0,0,0.04); }
    .dk-tip-arrow.dk-arr-left { left: -6px; top: 50%; margin-top: -6px; }
    .dk-tip-arrow.dk-arr-right { right: -6px; top: 50%; margin-top: -6px; }

    /* ─── Welcome ─── */
    #dk-welcome-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      animation: dkFade 0.3s;
    }
    @keyframes dkFade { from { opacity: 0 } to { opacity: 1 } }
    #dk-welcome {
      background: #fff; border-radius: 18px; max-width: 480px; width: 92%;
      overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      animation: dkPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    #dk-welcome-hero { background: linear-gradient(135deg, ${PRIMARY}, #C44569); padding: 36px 32px 28px; color: #fff; text-align: center; }
    #dk-welcome-hero .emoji { font-size: 48px; margin-bottom: 12px; }
    #dk-welcome-hero h2 { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
    #dk-welcome-hero p { font-size: 14px; opacity: 0.9; margin: 0; line-height: 1.5; }
    #dk-welcome-body { padding: 24px 32px 28px; }
    #dk-welcome-body ul { list-style: none; padding: 0; margin: 0 0 20px; }
    #dk-welcome-body li { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13px; color: #444; border-bottom: 1px solid #f4f4f8; }
    #dk-welcome-body li:last-child { border: none; }
    #dk-welcome-body li .num { width: 26px; height: 26px; border-radius: 50%; background: #f2f2f7; color: ${PRIMARY}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
    #dk-welcome-cta { text-align: center; }
    #dk-welcome-cta .dk-btn { padding: 11px 28px; font-size: 14px; }
    #dk-welcome-skip { display: block; margin-top: 10px; font-size: 12px; color: #999; cursor: pointer; background: none; border: none; font-family: inherit; }
    #dk-welcome-skip:hover { color: #666; }
  `;
  document.head.appendChild(css);

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k) {
      if (k === 'className') el.className = attrs[k];
      else if (k === 'innerHTML') el.innerHTML = attrs[k];
      else if (k === 'textContent') el.textContent = attrs[k];
      else if (k === 'style') el.style.cssText = attrs[k];
      else if (k.slice(0,2) === 'on' && typeof attrs[k] === 'function') el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(function(c) {
      if (!c) return;
      if (typeof c === 'string') el.appendChild(document.createTextNode(c));
      else el.appendChild(c);
    });
    return el;
  }

  // Trouve un élément de la sidebar par son texte
  function findNav(text) {
    var items = document.querySelectorAll('.v-navigation-drawer__content .v-list-item');
    return Array.from(items).find(function(el) { return el.textContent.trim().indexOf(text) === 0; });
  }

  // Trouve un bouton par son texte
  function findBtn(text) {
    return Array.from(document.querySelectorAll('.v-btn, button')).find(function(el) {
      return el.textContent.trim().indexOf(text) !== -1;
    });
  }

  // Trouve un élément dans main par texte
  function findInMain(text) {
    var main = document.querySelector('.v-main__wrap') || document.querySelector('main');
    if (!main) return null;
    return Array.from(main.querySelectorAll('*')).find(function(el) {
      return el.children.length <= 3 && el.textContent.trim().indexOf(text) !== -1 && el.textContent.trim().length < text.length + 30;
    });
  }

  function getRoute() {
    return window.location.pathname;
  }

  function scrollToEl(el) {
    var r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STORAGE
  // ═══════════════════════════════════════════════════════════════
  function loadS() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) { return {}; } }
  function saveS(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
  function getS(k) { return loadS()[k]; }
  function setS(k, v) { var s = loadS(); s[k] = v; saveS(s); }

  // ═══════════════════════════════════════════════════════════════
  // TRACKING
  // ═══════════════════════════════════════════════════════════════
  function track(event, data) {
    var payload = { event: event, timestamp: new Date().toISOString(), source: 'demodk' };
    if (data) Object.keys(data).forEach(function(k) { payload[k] = data[k]; });
    if (DEBUG) console.log('%c[DémoDK]%c ' + event, 'background:#E85D75;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold;', 'color:#333;', data || '');
    if (window.dataLayer) window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('demodk:track', { detail: payload }));
  }

  // ═══════════════════════════════════════════════════════════════
  // BLOCS D'ONBOARDING — contenu + sélecteurs réels
  // ═══════════════════════════════════════════════════════════════
  var BLOCKS = [
    {
      id: 'import-inventory',
      label: 'Importer mon inventaire',
      desc: 'Ajoutez vos premiers articles',
      cta: 'Commencer',
      route: '/stock',
      trackEvent: 'inventory_import_started',
      steps: [
        {
          find: function() { return findBtn('Ajouter des articles'); },
          title: 'Ajoutez vos articles',
          body: 'C\'est le <strong>point de départ</strong> de toute votre activité. Cliquez ici pour importer vos articles ou en créer de nouveaux.',
          pos: 'bottom'
        },
        {
          find: function() { return findBtn('Synchroniser ton Vinted'); },
          title: 'Importez depuis Vinted',
          body: 'Vous avez déjà des articles sur Vinted ? <strong>Synchronisez en un clic</strong> pour les importer automatiquement.',
          pos: 'bottom'
        },
        {
          find: function() { return findBtn('Publier'); },
          title: 'Publiez vos articles',
          body: 'Une fois vos articles importés, vous pourrez les <strong>publier sur Vinted</strong> directement depuis DressKare.',
          pos: 'bottom'
        }
      ]
    },
    {
      id: 'install-extension',
      label: 'Installer l\'extension',
      desc: 'Accélérez votre workflow',
      cta: 'Installer',
      route: '/edit-profile/connectors',
      trackEvent: 'extension_cta_clicked',
      steps: [
        {
          find: function() { return findInMain('Extension installée') || findInMain('Extension'); },
          title: 'L\'extension DressKare',
          body: 'L\'extension Chrome vous permet d\'<strong>agir directement depuis Vinted</strong> : import en 1 clic, synchronisation automatique.',
          pos: 'bottom'
        }
      ]
    },
    {
      id: 'product-sheet',
      label: 'Comprendre la fiche produit',
      desc: 'Le cœur de vos publications',
      cta: 'Ouvrir un article',
      route: '/stock',
      trackEvent: 'product_sheet_opened',
      steps: [
        {
          find: function() { return document.querySelector('.product-card-light'); },
          title: 'Vos fiches produit',
          body: 'Cliquez sur un article pour ouvrir sa <strong>fiche complète</strong> : titre, description, photos, prix, attributs. C\'est le cœur de chaque publication.',
          pos: 'right'
        }
      ]
    },
    {
      id: 'customize-prompts',
      label: 'Personnaliser mes prompts IA',
      desc: 'Adaptez le ton de vos annonces',
      cta: 'Configurer',
      route: '/edit-profile/announcements',
      trackEvent: 'prompt_settings_opened',
      steps: [
        {
          find: function() { return findInMain('Configuration des noms des produits'); },
          title: 'Noms de vos produits',
          body: 'Personnalisez comment l\'IA <strong>génère les noms</strong> de vos articles. Définissez le format qui vous convient.',
          pos: 'bottom'
        },
        {
          find: function() { return findInMain('Configuration des descriptions'); },
          title: 'Descriptions IA',
          body: 'Gérez vos <strong>templates de descriptions</strong>. Vous pouvez créer plusieurs annonces et choisir laquelle utiliser.',
          pos: 'bottom'
        },
        {
          find: function() { return findBtn('Ajouter une annonce'); },
          title: 'Créez vos propres prompts',
          body: 'Cliquez ici pour <strong>ajouter un nouveau template</strong> d\'annonce avec votre propre prompt IA.',
          pos: 'left'
        }
      ]
    },
    {
      id: 'customize-mannequin',
      label: 'Personnaliser mon mannequin',
      desc: 'Améliorez vos visuels produit',
      cta: 'Personnaliser',
      route: '/edit-profile/mannequin-settings',
      trackEvent: 'mannequin_settings_opened',
      steps: [
        {
          find: function() { return findInMain('Configurations de mannequin'); },
          title: 'Vos mannequins IA',
          body: 'Configurez vos <strong>mannequins virtuels</strong> : genre, morphologie, posture, fond. Ces réglages s\'appliquent à la génération de photos IA.',
          pos: 'bottom'
        },
        {
          find: function() { return findBtn('Ajouter une configuration'); },
          title: 'Ajoutez une configuration',
          body: 'Créez <strong>plusieurs configurations</strong> selon vos besoins : homme, femme, différentes morphologies…',
          pos: 'left'
        }
      ]
    },
    {
      id: 'first-publish',
      label: 'Publier mon premier article',
      desc: 'Votre première action business',
      cta: 'Publier',
      route: '/stock',
      trackEvent: 'first_publish_started',
      steps: [
        {
          find: function() { return findBtn('Publier'); },
          title: 'Publiez vos articles',
          body: 'Sélectionnez des articles puis cliquez <strong>Publier</strong>. Vérifiez le contenu, les photos et le prix avant de lancer. C\'est le moment de passer à l\'action !',
          pos: 'bottom'
        }
      ]
    },
    {
      id: 'republication',
      label: 'Comprendre la republication',
      desc: 'Un levier de visibilité puissant',
      cta: 'Découvrir',
      route: '/repost',
      trackEvent: 'republish_settings_opened',
      steps: [
        {
          find: function() { return findBtn('Configurer la republication'); },
          title: 'La republication',
          body: 'Republier remet vos articles <strong>en haut des résultats</strong> sur Vinted. C\'est un levier majeur de visibilité. Configurez la fréquence et les règles ici.',
          pos: 'bottom'
        },
        {
          find: function() { return findBtn('Republier'); },
          title: 'Republiez manuellement',
          body: 'Vous pouvez aussi <strong>republier manuellement</strong> les articles sélectionnés. Utile pour booster un article spécifique.',
          pos: 'bottom'
        }
      ]
    },
    {
      id: 'automations',
      label: 'Configurer mes automatisations',
      desc: 'Passez en mode scalable',
      cta: 'Configurer',
      route: '/automation',
      trackEvent: 'automation_settings_opened',
      steps: [
        {
          find: function() { return findBtn('Nouvelle automatisation'); },
          title: 'Vos automatisations',
          body: 'Automatisez vos <strong>messages et réponses sur Vinted</strong>. Remerciements, acceptation d\'offres, messages sur favoris… tout est configurable.',
          pos: 'bottom'
        },
        {
          find: function() { return document.querySelector('.v-main .v-data-table, .v-main table'); },
          title: 'Activez et gérez',
          body: 'Chaque automatisation a un <strong>switch actif/inactif</strong>. Activez celles qui vous conviennent. Vous gardez le contrôle total.',
          pos: 'top'
        }
      ]
    },
    {
      id: 'auto-inventory',
      label: 'Comprendre le stock automatisé',
      desc: 'Synchronisation et mises à jour auto',
      cta: 'Consulter',
      route: '/stock',
      trackEvent: 'automated_inventory_page_viewed',
      steps: [
        {
          find: function() { return findBtn('Synchroniser ton Vinted'); },
          title: 'Stock synchronisé',
          body: 'Votre stock se <strong>met à jour automatiquement</strong>. Quand un article est vendu, son statut change. La synchronisation évite les doublons et erreurs.',
          pos: 'bottom'
        }
      ]
    },
    {
      id: 'orders',
      label: 'Suivre mes ventes',
      desc: 'Pilotez votre activité',
      cta: 'Voir',
      route: '/',
      trackEvent: 'orders_page_viewed',
      steps: [
        {
          find: function() { return findInMain('TOTAL DES VENTES PAYÉES') || findInMain('ARTICLES PAYÉS'); },
          title: 'Suivi de vos ventes',
          body: 'Sur le Dashboard, suivez votre <strong>chiffre d\'affaires, vos gains et vos articles vendus</strong>. DressKare centralise tout votre suivi opérationnel.',
          pos: 'bottom'
        },
        {
          find: function() { return findNav('Suivi de l\'activité'); },
          title: 'Suivi détaillé',
          body: 'Pour un <strong>suivi complet de votre activité</strong>, cliquez ici. Vous y trouverez l\'historique de toutes vos actions et ventes.',
          pos: 'right'
        }
      ]
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  var state = {
    completed: [],   // IDs des blocs complétés
    panelOpen: false,
    welcomeDone: false,
    tourActive: null, // bloc en cours de tour
    tourStep: 0,
    tourEls: []       // éléments DOM du tour actif
  };

  function loadUserState() {
    var s = loadS();
    state.completed = s.completed || [];
    state.welcomeDone = s.welcomeDone || false;
  }

  function saveUserState() {
    setS('completed', state.completed);
    setS('welcomeDone', state.welcomeDone);
  }

  function isCompleted(id) { return state.completed.indexOf(id) !== -1; }

  function completeBlock(id) {
    if (state.completed.indexOf(id) === -1) {
      state.completed.push(id);
      saveUserState();
      track('onboarding_step_completed', { block_id: id });
      renderTrigger();
      if (state.panelOpen) renderPanel();
      // Check all done
      if (state.completed.length === BLOCKS.length) {
        track('onboarding_completed', { total: BLOCKS.length });
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CHECKLIST TRIGGER (bouton en bas à droite)
  // ═══════════════════════════════════════════════════════════════
  function renderTrigger() {
    var existing = document.getElementById('dk-trigger');
    if (existing) existing.remove();

    var done = state.completed.length;
    var total = BLOCKS.length;
    var remaining = total - done;
    var pct = done / total;
    var circumference = 2 * Math.PI * 28;
    var offset = circumference * (1 - pct);

    var trigger = h('button', { id: 'dk-trigger', onClick: togglePanel }, [
      h('svg', { viewBox: '0 0 62 62' }),
      h('span', { className: 'dk-icon', innerHTML: '&#9776;' }),
      remaining > 0 ? h('span', { className: 'dk-badge', textContent: String(remaining) }) : null
    ]);

    // SVG rings
    var svg = trigger.querySelector('svg');
    svg.innerHTML = '<circle class="dk-ring-bg" cx="31" cy="31" r="28"/><circle class="dk-ring-fg" cx="31" cy="31" r="28" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '"/>';

    document.body.appendChild(trigger);
  }

  // ═══════════════════════════════════════════════════════════════
  // CHECKLIST PANEL
  // ═══════════════════════════════════════════════════════════════
  function togglePanel() {
    state.panelOpen = !state.panelOpen;
    if (state.panelOpen) {
      track('onboarding_checklist_opened');
      renderPanel();
    } else {
      closePanel();
    }
  }

  function closePanel() {
    state.panelOpen = false;
    var panel = document.getElementById('dk-panel');
    if (panel) panel.classList.remove('dk-open');
  }

  function renderPanel() {
    var existing = document.getElementById('dk-panel');
    if (existing) existing.remove();

    var done = state.completed.length;
    var total = BLOCKS.length;
    var pct = Math.round((done / total) * 100);

    var itemsEl = h('div', { id: 'dk-items' });
    BLOCKS.forEach(function(block) {
      var isDone = isCompleted(block.id);
      var cls = 'dk-item' + (isDone ? ' dk-completed' : '');
      var iconCls = 'dk-item-icon' + (isDone ? ' dk-done' : '');
      var iconHTML = isDone ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '';

      var info = h('div', { className: 'dk-item-info' }, [
        h('div', { className: 'dk-item-label', textContent: block.label }),
        h('div', { className: 'dk-item-desc', textContent: block.desc }),
      ]);

      if (!isDone) {
        info.appendChild(h('div', { className: 'dk-item-cta', textContent: block.cta + ' →' }));
      }

      var row = h('div', { className: cls, onClick: function() {
        if (isDone) return;
        track('onboarding_checklist_item_clicked', { item_id: block.id });
        closePanel();
        navigateAndTour(block);
      }}, [
        h('div', { className: iconCls, innerHTML: iconHTML }),
        info
      ]);

      itemsEl.appendChild(row);
    });

    var panel = h('div', { id: 'dk-panel', className: 'dk-open' }, [
      h('div', { id: 'dk-panel-header' }, [
        h('button', { id: 'dk-panel-close', innerHTML: '&times;', onClick: function() { closePanel(); } }),
        h('h3', { textContent: 'Votre mise en route' }),
        h('p', { textContent: 'Complétez ces étapes pour tirer le meilleur de DressKare' }),
        h('div', { className: 'dk-progress-row' }, [
          h('div', { className: 'dk-progress-bar' }, [
            h('div', { className: 'dk-progress-fill', style: 'width:' + pct + '%' })
          ]),
          h('div', { className: 'dk-progress-text', textContent: done + '/' + total })
        ])
      ]),
      itemsEl,
      h('div', { id: 'dk-panel-footer' }, [
        h('a', { textContent: 'Fermer', onClick: function() { closePanel(); } })
      ])
    ]);

    document.body.appendChild(panel);
  }

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION + TOUR
  // ═══════════════════════════════════════════════════════════════
  function navigateAndTour(block) {
    var currentRoute = getRoute();
    if (currentRoute !== block.route) {
      // Navigate via sidebar click or direct URL
      navigateToRoute(block.route);
      // Wait for page to render then start tour
      setTimeout(function() { startTour(block); }, 1200);
    } else {
      startTour(block);
    }
  }

  function navigateToRoute(route) {
    // Try sidebar navigation first (preserves Vue router state)
    var routeToNav = {
      '/': 'Dashboard',
      '/stock': 'Stock',
      '/repost': 'Republier',
      '/automation': 'Automatisation',
      '/edit-profile/connectors': 'Paramètres',
      '/edit-profile/announcements': 'Paramètres',
      '/edit-profile/mannequin-settings': 'Paramètres'
    };

    var navText = routeToNav[route];
    if (navText) {
      var navItem = findNav(navText);
      if (navItem) {
        navItem.click();
        // For sub-routes under Paramètres, click the sub-link after
        if (route.indexOf('/edit-profile/') === 0 && route !== '/edit-profile/') {
          setTimeout(function() {
            var subLink = document.querySelector('a[href="' + route + '"]');
            if (subLink) subLink.click();
          }, 600);
        }
        return;
      }
    }
    // Fallback: direct navigation
    window.location.href = route;
  }

  // ═══════════════════════════════════════════════════════════════
  // PRODUCT TOUR
  // ═══════════════════════════════════════════════════════════════
  function startTour(block) {
    clearTour();
    state.tourActive = block;
    state.tourStep = 0;
    track('onboarding_step_viewed', { block_id: block.id, step: 0 });
    if (block.trackEvent) track(block.trackEvent, { block_id: block.id });
    renderTourStep();
  }

  function renderTourStep() {
    clearTour();
    var block = state.tourActive;
    if (!block) return;
    var stepDef = block.steps[state.tourStep];
    if (!stepDef) { endTour(true); return; }

    var target = stepDef.find();
    if (!target) {
      // Skip missing step
      if (state.tourStep < block.steps.length - 1) {
        state.tourStep++;
        renderTourStep();
      } else {
        endTour(true);
      }
      return;
    }

    scrollToEl(target);

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        var rect = target.getBoundingClientRect();
        var pad = 8;

        // Spotlight
        var spot = h('div', { className: 'dk-spotlight', style: 'top:' + (rect.top - pad) + 'px;left:' + (rect.left - pad) + 'px;width:' + (rect.width + pad*2) + 'px;height:' + (rect.height + pad*2) + 'px;' });
        document.body.appendChild(spot);

        // Tooltip
        var total = block.steps.length;
        var idx = state.tourStep;
        var pos = stepDef.pos || autoPos(rect);

        // Dots
        var dots = h('div', { className: 'dk-tip-dots' });
        for (var i = 0; i < total; i++) {
          var dcls = 'dk-tip-dot' + (i === idx ? ' dk-active' : (i < idx ? ' dk-past' : ''));
          dots.appendChild(h('div', { className: dcls }));
        }

        // Actions
        var actions = h('div', { className: 'dk-tip-actions' });
        if (idx > 0) {
          actions.appendChild(h('button', { className: 'dk-btn dk-btn-sec', textContent: 'Précédent', onClick: function() { state.tourStep--; renderTourStep(); } }));
        }
        if (idx < total - 1) {
          actions.appendChild(h('button', { className: 'dk-btn dk-btn-pri', textContent: 'Suivant', onClick: function() {
            state.tourStep++;
            track('onboarding_step_viewed', { block_id: block.id, step: state.tourStep });
            renderTourStep();
          }}));
        } else {
          actions.appendChild(h('button', { className: 'dk-btn dk-btn-pri', textContent: 'Terminer ✓', onClick: function() { endTour(true); } }));
        }

        var arrowDir = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[pos];

        var tip = h('div', { className: 'dk-tip' }, [
          h('button', { className: 'dk-tip-close', innerHTML: '&times;', onClick: function() { endTour(false); } }),
          total > 1 ? h('div', { className: 'dk-tip-badge', textContent: 'Étape ' + (idx + 1) + '/' + total }) : null,
          h('div', { className: 'dk-tip-title', textContent: stepDef.title }),
          h('div', { className: 'dk-tip-body', innerHTML: stepDef.body }),
          h('div', { className: 'dk-tip-footer' }, [dots, actions]),
          h('div', { className: 'dk-tip-arrow dk-arr-' + arrowDir })
        ]);

        document.body.appendChild(tip);

        // Position tooltip
        requestAnimationFrame(function() {
          var tr = tip.getBoundingClientRect();
          var gap = 16;
          var top, left;
          switch (pos) {
            case 'bottom': top = rect.bottom + gap; left = rect.left + rect.width/2 - tr.width/2; break;
            case 'top': top = rect.top - tr.height - gap; left = rect.left + rect.width/2 - tr.width/2; break;
            case 'left': top = rect.top + rect.height/2 - tr.height/2; left = rect.left - tr.width - gap; break;
            case 'right': top = rect.top + rect.height/2 - tr.height/2; left = rect.right + gap; break;
          }
          left = Math.max(12, Math.min(left, window.innerWidth - tr.width - 12));
          top = Math.max(12, Math.min(top, window.innerHeight - tr.height - 12));
          tip.style.top = top + 'px';
          tip.style.left = left + 'px';
        });

        state.tourEls = [spot, tip];
        state._resizeHandler = function() { renderTourStep(); };
        window.addEventListener('resize', state._resizeHandler);
      });
    });
  }

  function autoPos(rect) {
    var b = window.innerHeight - rect.bottom;
    var t = rect.top;
    var r = window.innerWidth - rect.right;
    var l = rect.left;
    var max = Math.max(b, t, r, l);
    if (max === b) return 'bottom';
    if (max === t) return 'top';
    if (max === r) return 'right';
    return 'left';
  }

  function endTour(completed) {
    clearTour();
    var block = state.tourActive;
    if (block && completed) {
      completeBlock(block.id);
    } else if (block) {
      track('onboarding_step_skipped', { block_id: block.id, at_step: state.tourStep });
    }
    state.tourActive = null;
    state.tourStep = 0;
  }

  function clearTour() {
    state.tourEls.forEach(function(el) { el.remove(); });
    state.tourEls = [];
    if (state._resizeHandler) {
      window.removeEventListener('resize', state._resizeHandler);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WELCOME MODAL
  // ═══════════════════════════════════════════════════════════════
  function showWelcome() {
    if (state.welcomeDone) return;

    track('onboarding_started');

    var highlights = [
      'Importez votre inventaire en quelques clics',
      'Publiez sur Vinted en un clic',
      'Laissez l\'IA rédiger vos annonces',
      'Automatisez vos messages et republications',
      'Suivez vos ventes depuis un seul endroit'
    ];

    var ul = h('ul');
    highlights.forEach(function(txt, i) {
      ul.appendChild(h('li', {}, [
        h('span', { className: 'num', textContent: String(i + 1) }),
        h('span', { textContent: txt })
      ]));
    });

    var overlay = h('div', { id: 'dk-welcome-overlay' }, [
      h('div', { id: 'dk-welcome' }, [
        h('div', { id: 'dk-welcome-hero' }, [
          h('div', { className: 'emoji', textContent: '👋' }),
          h('h2', { textContent: 'Bienvenue sur DressKare !' }),
          h('p', { textContent: 'Votre solution tout-en-un pour vendre vos vêtements de seconde main et automatiser votre activité.' })
        ]),
        h('div', { id: 'dk-welcome-body' }, [
          ul,
          h('div', { id: 'dk-welcome-cta' }, [
            h('button', { className: 'dk-btn dk-btn-pri', textContent: 'Commencer la mise en route', onClick: function() {
              overlay.remove();
              state.welcomeDone = true;
              saveUserState();
            }}),
            h('button', { id: 'dk-welcome-skip', textContent: 'Je connais déjà, passer', onClick: function() {
              overlay.remove();
              state.welcomeDone = true;
              saveUserState();
              track('onboarding_step_skipped', { step: 'welcome' });
            }})
          ])
        ])
      ])
    ]);

    document.body.appendChild(overlay);
  }

  // ═══════════════════════════════════════════════════════════════
  // RESET (accessible via console)
  // ═══════════════════════════════════════════════════════════════
  window.DemoDK = {
    reset: function() {
      localStorage.removeItem(STORAGE_KEY);
      state.completed = [];
      state.welcomeDone = false;
      clearTour();
      document.querySelectorAll('#dk-trigger, #dk-panel, #dk-welcome-overlay').forEach(function(el) { el.remove(); });
      init();
      console.log('[DémoDK] Reset complet');
    },
    completeBlock: completeBlock,
    startTour: function(blockId) {
      var block = BLOCKS.find(function(b) { return b.id === blockId; });
      if (block) { navigateAndTour(block); }
    },
    state: state,
    track: track
  };

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════
  function init() {
    loadUserState();
    renderTrigger();
    if (!state.welcomeDone) {
      // Petit délai pour laisser l'app charger
      setTimeout(showWelcome, 1500);
    }
  }

  // Attendre que l'app soit chargée
  if (document.readyState === 'complete') {
    setTimeout(init, 500);
  } else {
    window.addEventListener('load', function() { setTimeout(init, 500); });
  }

})();
