/* Pokélings: Sprite-Pakete dauerhaft im Browser speichern (Dateinamen enthalten ?v=<Hash>, ändern sich also bei jedem neuen Inhalt).
   Alles andere (index.html usw.) geht normal übers Netz, damit Updates sofort ankommen. */
const C="pkl-spr-1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith("pkl-spr-")&&k!==C)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;let u;try{u=new URL(q.url);}catch(x){return;}
  if(u.origin!==self.location.origin||!/\/sprites-[a-z0-9-]+\.js$/.test(u.pathname))return;const v=u.searchParams.get("v");if(!v)return;
  const key=u.origin+u.pathname+"?v="+v;
  e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match(key);if(hit)return hit;
    const r=await fetch(q);if(r&&r.ok){try{await c.put(key,r.clone());const ks=await c.keys();for(const k of ks){const ku=new URL(k.url);if(ku.pathname===u.pathname&&ku.searchParams.get("v")!==v)await c.delete(k);}}catch(x){}}return r;})());});
