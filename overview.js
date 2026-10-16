const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});

// Form prompts; submission is handled by explore-form-integration.js.
const form=document.getElementById('interest-form'),checks=[...form.querySelectorAll('input[name="interests"]')];
const prompts={membership:'Share what you hope to find and what you would like to contribute.',host:'Tell us your city, the gathering you imagine, and any space you could offer.',idea:'What would you love to explore, and who might it serve?',expertise:'What experience or subject would you like to share?',sponsor:'Tell us the organization and why it could be a fit. Please leave out private contact details.',partner:'Share your organization and what we could create together.',volunteer:'Tell us your skills, interests, and the time you could offer.',other:'We’d love to hear what you have in mind.'};
function updateInterests(){const box=document.getElementById('interest-prompts');box.replaceChildren();checks.filter(c=>c.checked).forEach(c=>{const p=document.createElement('p');p.textContent=prompts[c.value];box.append(p)});box.hidden=!box.children.length;checks[0].setCustomValidity('');document.getElementById('form-status').textContent=''}
checks.forEach(c=>c.addEventListener('change',updateInterests));
document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>{const c=checks.find(c=>c.value===a.dataset.interest);if(c){c.checked=true;updateInterests()}}));
