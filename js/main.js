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
});
