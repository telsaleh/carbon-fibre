document.addEventListener('DOMContentLoaded',function(){
  // insert current year
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // nav toggle for small screens
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      nav.classList.toggle('open');
      // sync overlay aria
      var overlay=document.querySelector('.nav-overlay');
      if(overlay) overlay.setAttribute('aria-hidden', !nav.classList.contains('open'));
    });
    // close when clicking overlay
    var overlay=document.querySelector('.nav-overlay');
    if(overlay){
      overlay.addEventListener('click',function(){ nav.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); });
    }
    // close when clicking any nav link (handles in-page anchors like #contact)
    var navLinks = document.querySelectorAll('.main-nav a');
    if(navLinks && navLinks.length){
      navLinks.forEach(function(link){
        link.addEventListener('click', function(){
          if(nav.classList.contains('open')){
            nav.classList.remove('open');
            if(overlay) overlay.setAttribute('aria-hidden','true');
          }
        });
      });
    }
    // close on escape
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ nav.classList.remove('open'); if(overlay) overlay.setAttribute('aria-hidden','true'); } });
  }

  // small animation: fade in tiles when visible
  var tiles=document.querySelectorAll('.tile, .card, .project');
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; io.unobserve(e.target);} });
  },{threshold:.08});
  tiles.forEach(function(t){ t.style.opacity=0; t.style.transform='translateY(8px)'; t.style.transition='opacity .6s ease, transform .6s ease'; io.observe(t); });

  // Smooth in-page scrolling with header offset
  (function(){
    var header = document.querySelector('.site-header');
    function getHeaderOffset(){
      if(!header) return 64;
      var v = getComputedStyle(header).getPropertyValue('--header-height') || '64px';
      return parseInt(v,10)||64;
    }

    function handleAnchorClick(e){
      var link = e.currentTarget;
      var hash = link.hash;
      if(!hash) return;
      // only handle same-page anchors
      if(location.pathname.replace(/\/$/,'') !== link.pathname.replace(/\/$/,'') ) return;
      var target = document.getElementById(hash.slice(1));
      if(!target) return;
      e.preventDefault();
      var headerOffset = getHeaderOffset();
      var rect = target.getBoundingClientRect();
      var top = window.pageYOffset + rect.top - headerOffset - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // update URL hash without jumping
      if(history.pushState) history.pushState(null, '', hash);
      else location.hash = hash;
    }

    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(a){ a.addEventListener('click', handleAnchorClick); });
  })();

  // Scroll progress indicator
  (function(){
    var header = document.querySelector('.site-header');
    var indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    var bar = document.createElement('div');
    bar.className = 'bar';
    indicator.appendChild(bar);
    document.body.appendChild(indicator);
    // position indicator under header using actual header height (fallback to CSS var)
    try{
      var headerH = header ? header.offsetHeight : null;
      if(headerH){
        indicator.style.top = headerH + 'px';
      } else {
        // try using CSS variable
        indicator.style.top = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '64px';
      }
    }catch(e){}

    // Page transition overlay (for navigating between pages)
    var pageOverlay = document.createElement('div');
    pageOverlay.className = 'page-transition';
    document.body.appendChild(pageOverlay);

    // handle nav links that navigate to other pages: slide overlay then navigate
    var navLinksForNavigation = document.querySelectorAll('.main-nav a');
    navLinksForNavigation.forEach(function(link){
      var href = link.getAttribute('href');
      if(!href) return;
      // skip same-page anchors
      if(href.charAt(0) === '#') return;
      link.addEventListener('click', function(e){
        // allow modifier clicks to behave normally
        if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        // close nav on mobile
        if(nav && nav.classList.contains('open')){ nav.classList.remove('open'); }

        // decide direction: navigating to home should come from right->left, others left->right
        var targetUrl = new URL(link.href, location.href);
        var targetPath = targetUrl.pathname.replace(/\/$/,'');
        var curRoot = location.pathname.replace(/\/$/,'');
        var isHome = (targetPath === '' || targetPath === '/index.html' || targetPath === '/index.htm' || targetPath === '/');

        // prepare overlay start position
        var enterFromRight = false;
        if(isHome){
          // for home, enter from right
          pageOverlay.style.transform = 'translateX(100%)';
          enterFromRight = true;
        } else {
          // for other pages, enter from left
          pageOverlay.style.transform = 'translateX(-100%)';
        }

        // force layout then animate into view
        pageOverlay.classList.add('show');
        // next frame set to 0 to animate
        requestAnimationFrame(function(){
          pageOverlay.style.transform = 'translateX(0)';
        });

        // navigate after animation completes
        var duration = 340; // ms (slightly longer than CSS)
        setTimeout(function(){ window.location.href = link.href; }, duration);
      });
    });

    var raf = null, last = 0, idleTimer = null;
    function getProgress(){
      var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var max = h - vh;
      if(max <= 0) return 0;
      return Math.min(100, Math.max(0, (window.pageYOffset / max) * 100));
    }

    function update(){
      var p = getProgress();
      bar.style.width = p + '%';
      // show while scrolling
      indicator.classList.add('visible');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(function(){ indicator.classList.remove('visible'); }, 700);
      raf = null;
    }

    window.addEventListener('scroll', function(){ if(raf) return; raf = requestAnimationFrame(update); });
    // initial state
    update();
  })();
});
