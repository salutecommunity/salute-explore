(()=>{
 const selector=document.getElementById('leadership-select');
 selector.addEventListener('change',()=>{
  for(let i=0;i<3;i++)document.getElementById(`team-pane-${i}`).hidden=String(i)!==selector.value;
 });
 const info=document.getElementById('membership-lightbox-info');
 const membership=document.querySelector('input[value="membership"]');
 const title=document.getElementById('interest-dialog-title');
 const update=()=>{info.hidden=!membership.checked;title.textContent=membership.checked?'Request an invitation.':'Get involved.'};
 document.querySelectorAll('[data-open-interest]').forEach(button=>button.addEventListener('click',()=>{
  membership.checked=button.dataset.interest==='membership';
  membership.dispatchEvent(new Event('change',{bubbles:true}));
  update();
  document.getElementById('interest-dialog').scrollTop=0;
 }));
 membership.addEventListener('change',update);
 update();
})();
