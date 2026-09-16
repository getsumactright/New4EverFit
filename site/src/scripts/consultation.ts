const form=document.getElementById('consultation-form') as HTMLFormElement|null;
if(form){
 const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
 const label=submit.querySelector('span')!;
 const original=label.textContent!;
 const error=document.getElementById('form-error')!;
 const result=document.getElementById('form-result')!;
 const endpoint=form.dataset.endpoint;
 submit.disabled=false;
 document.querySelectorAll<HTMLAnchorElement>('[data-service]').forEach(link=>link.addEventListener('click',()=>{
  const radio=Array.from(form.querySelectorAll<HTMLInputElement>('[name="service"]')).find(el=>el.value===link.dataset.service);
  if(radio)radio.checked=true;
 }));
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  error.hidden=true;submit.disabled=true;label.textContent=endpoint?'Sending…':'Preparing preview…';
  const data=new FormData(form);
  try{
   if(endpoint){
    const response=await fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('delivery');
   }
   document.getElementById('result-heading')!.textContent=endpoint?'Your request is in.':'Your request, ready to review.';
   document.getElementById('result-message')!.textContent=endpoint?'Thank you for getting in touch. We’ll reply by email to discuss your consultation.':'This is a preview only. Nothing has been sent or saved. You can edit your details or open an email draft to the testing address.';
   const summary=document.getElementById('request-summary')!;
   summary.replaceChildren();
   const fields=[['Name','name'],['Email','email'],['Coaching','service'],['Location','location'],['Goal','goal'],['Message','message']];
   for(const [title,key] of fields){const value=String(data.get(key)||'');if(!value)continue;const dt=document.createElement('dt');dt.textContent=title;const dd=document.createElement('dd');dd.textContent=value;summary.append(dt,dd);}
   const draft=document.getElementById('email-draft') as HTMLAnchorElement;
   draft.hidden=!!endpoint;
   if(!endpoint){const body=fields.map(([title,key])=>`${title}: ${data.get(key)||'—'}`).join('\n');draft.href=`mailto:${form.dataset.email}?subject=${encodeURIComponent('4Ever Fit consultation request — testing')}&body=${encodeURIComponent(body)}`;}
   form.hidden=true;result.hidden=false;result.focus();
  }catch{
   error.textContent='Your request could not be confirmed. Your details are still here. Please try again or use the contact email in the footer.';error.hidden=false;
  }finally{submit.disabled=false;label.textContent=original;}
 });
 document.getElementById('edit-request')?.addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.querySelector<HTMLInputElement>('input')?.focus();});
}
