const CACHE='momo-room-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const allowed=new Set(FILES.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(FILES.map(path=>new Request(path,{credentials:'same-origin',redirect:'error'})));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith('momo-room-')&&name!==CACHE)await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);url.search='';url.hash='';
 if(!allowed.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(event.request);
   if(response.ok&&!response.redirected&&response.type==='basic')await cache.put(url.href,response.clone());
   return response;
  }catch(error){
   const saved=await cache.match(url.href);
   if(saved)return saved;
   if(event.request.mode==='navigate'){const home=await cache.match(new URL('./',self.registration.scope).href);if(home)return home;}
   throw error;
  }
 })());
});
