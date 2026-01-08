// copyTextFrom("elementId") copies the textContent of a <pre> or any element by id.
function copyTextFrom(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const text = el.innerText || el.textContent || "";
  if (!text.trim()) return;

  // Prefer modern clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => toastCopied()).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }

  function fallbackCopy(t) {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    toastCopied();
  }

  function toastCopied() {
    // optional: tiny UX feedback without needing CSS changes
    const btn = document.activeElement;
    if (btn && btn.classList && btn.classList.contains("copybtn")) {
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = old), 900);
    }
  }
}
