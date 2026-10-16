(()=>{
 const dialog=document.getElementById('interest-dialog');
 let opener=null,previousOverflow='';
 document.querySelectorAll('[data-open-interest]').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();opener=button;
  if(typeof closeMenu==='function')closeMenu();
  previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  dialog.showModal();dialog.scrollTop=0;
  dialog.querySelector('input[name="name"]').focus({preventScroll:true});
 }));
 dialog.querySelector('[data-close-interest]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const box=dialog.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
 });
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;if(opener)opener.focus({preventScroll:true})});
})();
