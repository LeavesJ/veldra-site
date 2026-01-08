function copyTextFrom(id){
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`[data-copy="${id}"]`);
    if (!btn) return;
    const old = btn.innerText;
    btn.innerText = "Copied";
    setTimeout(() => (btn.innerText = old), 900);
  });
}
