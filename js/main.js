document.addEventListener('DOMContentLoaded',function(){
  // insert current year
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // nav toggle for small screens
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      nav.classList.toggle('open');
    });
  }

  // small animation: fade in tiles when visible
  var tiles=document.querySelectorAll('.tile, .card, .project');
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; io.unobserve(e.target);} });
  },{threshold:.08});
  tiles.forEach(function(t){ t.style.opacity=0; t.style.transform='translateY(8px)'; t.style.transition='opacity .6s ease, transform .6s ease'; io.observe(t); });
});
