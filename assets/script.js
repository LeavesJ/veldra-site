function copyFrom(id){
  const el = document.getElementById(id);
  if(!el) return;
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = document.querySelector(`[data-copy='${id}']`);
    if(!btn) return;
    const old = btn.textContent;
    btn.textContent = "Copied";
    setTimeout(()=>btn.textContent = old, 900);
  });
}

(function revealOnScroll(){
  const els = Array.from(document.querySelectorAll(".reveal"));
  if(!("IntersectionObserver" in window)){
    els.forEach(e=>e.classList.add("on"));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    for(const ent of entries){
      if(ent.isIntersecting){
        ent.target.classList.add("on");
        io.unobserve(ent.target);
      }
    }
  }, { threshold: 0.08 });
  els.forEach(e=>io.observe(e));
})();
