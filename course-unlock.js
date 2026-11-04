"use strict";
(()=>{
 const form=document.getElementById("course-unlock");
 if(!form)return;
 const status=document.getElementById("unlock-status");
 const bytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
 form.addEventListener("submit",async event=>{
  event.preventDefault();
  const button=form.querySelector("button");button.disabled=true;status.textContent="Unlocking…";
  try{
   if(!window.crypto?.subtle){status.textContent="Your browser cannot unlock this page. Please use a current browser over HTTPS.";return;}
   const payload=JSON.parse(document.getElementById("course-data").textContent);
   const password=document.getElementById("course-password").value;
   const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveKey"]);
   const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt:bytes(payload.salt),iterations:600000,hash:"SHA-256"},material,{name:"AES-GCM",length:256},false,["decrypt"]);
   const plaintext=await crypto.subtle.decrypt({name:"AES-GCM",iv:bytes(payload.iv)},key,bytes(payload.ciphertext));
   const main=document.getElementById("main");main.innerHTML=new TextDecoder().decode(plaintext);
   main.setAttribute("tabindex","-1");main.focus();
   document.getElementById("course-data").remove();
  }catch(error){status.textContent="Incorrect password. Please try again.";document.getElementById("course-password").focus();}
  finally{button.disabled=false;}
 });
})();