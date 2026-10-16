/* Standalone production integration for SALUTE Explore.
 * REQUIRED: remove the demonstration form.addEventListener('submit', ...) from
 * overview.js before loading this script AFTER overview.js. Keep the existing
 * interest prompt / navigation code. No Supabase key or preview bridge needed.
 */
(() => {
  'use strict';
  const endpoint = 'https://nyqckfgiocbzovhwmvap.supabase.co/functions/v1/explore-interest';
  const allowed = ['https://explore.salute.community', 'https://salute-explore.vercel.app'];
  const form = document.getElementById('interest-form');
  if (!form || form.dataset.liveConnected) return;
  form.dataset.liveConnected = 'true';
  const status = document.getElementById('form-status');
  const submit = form.querySelector('button[type="submit"]');
  const checks = [...form.querySelectorAll('input[name="interests"]')];
  const startedAt = Date.now();
  let requestId = null, busy = false;
  function updateSubmitLabel() {
    if (!busy) submit.textContent = checks.some(c => c.value === 'membership' && c.checked) ? 'Submit Request ↗' : 'Submit Interest ↗';
  }
  form.addEventListener('change', updateSubmitLabel);

  for (const [name, max] of Object.entries({name:120,email:254,city:160,role:200,message:4000})) {
    if (form.elements.namedItem(name)) form.elements.namedItem(name).maxLength = max;
  }
  const notice = form.querySelector('.form-notice');
  if (notice) notice.textContent = 'Your details will be saved securely and shared with SALUTE to follow up about your selected interests.';
  updateSubmitLabel();
  const trapLabel = document.createElement('label');
  trapLabel.textContent = 'Leave this field empty';
  trapLabel.setAttribute('aria-hidden', 'true');
  trapLabel.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden';
  const trap = document.createElement('input');
  trap.name = 'website'; trap.type = 'text'; trap.tabIndex = -1; trap.autocomplete = 'off';
  trapLabel.append(trap); form.append(trapLabel);
  function say(message) { status.textContent = message; status.focus(); }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    if (!allowed.includes(location.origin)) {
      say('This form is available at explore.salute.community. Please use the live site or email hello@salute.community.'); return;
    }
    if (!checks.some(c => c.checked)) {
      checks[0].setCustomValidity('Please choose at least one way you would like to be involved.');
      checks[0].reportValidity(); return;
    }
    checks[0].setCustomValidity('');
    if (!form.reportValidity()) return;
    if (Date.now() - startedAt < 2000) { say('Please take a moment to review your details, then submit again.'); return; }
    if (!crypto.randomUUID) { say('Please use a current browser or email hello@salute.community.'); return; }
    requestId ||= crypto.randomUUID();
    const data = new FormData(form);
    const payload = {
      request_id: requestId, name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(), city: String(data.get('city') || '').trim(),
      role: String(data.get('role') || '').trim(), message: String(data.get('message') || '').trim(),
      interests: data.getAll('interests'), consent: data.get('consent') !== null,
      started_at: startedAt, website: trap.value
    };
    busy = true; submit.disabled = true; submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true'); status.textContent = 'Saving your interest…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', mode: 'cors', credentials: 'omit',
        headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload), signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.saved) {
        throw new Error(response.status === 429
          ? 'Please try again later or email hello@salute.community.'
          : result.message || 'We could not save your interest. Please try again or email hello@salute.community.');
      }
      form.reset(); requestId = null;
      checks[0].dispatchEvent(new Event('change', {bubbles:true}));
      say('Thank you. Your interest has been saved for SALUTE to review. A membership request does not confirm membership.');
    } catch (error) {
      say(error.name === 'AbortError' || error instanceof TypeError
        ? 'We could not confirm receipt. Please try again; your request will not be duplicated. You can also email hello@salute.community.'
        : error.message);
    } finally {
      clearTimeout(timer); busy = false; submit.disabled = false;
      updateSubmitLabel(); form.removeAttribute('aria-busy');
    }
  });
})();
