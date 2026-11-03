'use strict';
for (const button of document.querySelectorAll('.copy-citation')) {
  button.addEventListener('click', async () => {
    const textElement = button.closest('.apa-citation').querySelector('.citation-text');
    const citation = textElement.innerText.trim();
    const status = document.getElementById('copy-status');
    const number = button.closest('.apa-citation').value;
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(citation); copied = true; } catch { /* Try browser compatibility path below. */ }
    }
    if (!copied) {
      const field = document.createElement('textarea');
      field.value = citation;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      field.remove();
      button.focus({preventScroll:true});
    }
    if (copied) {
      button.textContent = 'Copied';
      status.textContent = `Citation ${number} copied to clipboard.`;
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textElement);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Text selected';
      status.textContent = 'Citation selected. Use your browser’s Copy command to copy it.';
    }
  });
}
