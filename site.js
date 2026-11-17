// Mobile menu
(function(){
  const b=document.getElementById('menuBtn'),n=document.getElementById('navLinks');
  if(!b||!n)return;
  b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
})();

// Open-now status + today's hours (shop time = Pacific)
(function(){
  try{
    const now=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Los_Angeles'}));
    const d=now.getDay(),h=now.getHours()+now.getMinutes()/60;
    const openDay=d!==3,open=openDay&&h>=6&&h<21;
    let msg;
    if(open)msg='Open now · until 9 PM';
    else if(openDay&&h<6)msg='Closed · opens 6 AM today';
    else msg='Closed · opens 6 AM '+(d===2?'Thursday':'tomorrow');
    document.querySelectorAll('[data-status]').forEach(el=>{
      const dot=el.querySelector('.dot'),txt=el.querySelector('.txt');
      if(dot)dot.classList.add(open?'open':'closed');
      if(txt)txt.textContent=msg;
    });
    document.querySelectorAll('.hours-table tr[data-d="'+d+'"]').forEach(r=>r.classList.add('today'));
    document.querySelectorAll('[data-year]').forEach(el=>el.textContent=now.getFullYear());
  }catch(e){}
})();

// Forms: build an email to the shop from the fields
(function(){
  // Prefill device from ?device= in the link
  const p=new URLSearchParams(location.search).get('device');
  const sel=document.getElementById('f-device');
  if(p&&sel)sel.value=p;

  document.querySelectorAll('form[data-mailto]').forEach(f=>{
    f.addEventListener('submit',e=>{
      e.preventDefault();
      const lines=[...f.querySelectorAll('input,select,textarea')].filter(x=>x.value.trim()).map(x=>{
        const l=f.querySelector('label[for="'+x.id+'"]');return (l?l.textContent:x.name)+': '+x.value.trim();
      });
      const subj=f.dataset.subject||'Website request';
      location.href='mailto:'+f.dataset.mailto+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n'));
      const ok=f.querySelector('.form-ok');if(ok)ok.classList.add('show');
    });
  });
})();

// Google reviews widget: show a link instead if it doesn't load
(function(){
  const w=document.querySelector('.g-widget');if(!w)return;
  // The widget fills its box with content when it loads; if the box is still empty, show the backup panel.
  const fail=()=>{const c=w.firstElementChild;return !c||c.offsetHeight<60};
  setTimeout(()=>{
    if(fail()){const fb=document.querySelector('.g-fallback');if(fb)fb.classList.add('show');w.hidden=true}
  },6000);
})();

// Fade-in on scroll (content stays visible if anything fails)
(function(){
  const els=[...document.querySelectorAll('.reveal')];
  const check=()=>{const h=innerHeight;els.forEach(el=>{if(!el.classList.contains('in')&&el.getBoundingClientRect().top<h-40)el.classList.add('in')})};
  try{
    document.documentElement.classList.add('anim');check();
    addEventListener('scroll',check,{passive:true});addEventListener('resize',check);
    setTimeout(()=>els.forEach(el=>el.classList.add('in')),4000);
  }catch(e){document.documentElement.classList.remove('anim')}
})();
