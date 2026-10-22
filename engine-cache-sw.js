// Only Phaser 3.86.0 is cached, never bonus rules or HTML.
const CACHE='art-studio-engine-phaser-3.86.0-v1';
const ENGINE=new URL('phaser.min.js',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.add(ENGINE))));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||event.request.url!==ENGINE)return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const saved=await cache.match(ENGINE);if(saved)return saved;
  const response=await fetch(event.request);if(response.ok)await cache.put(ENGINE,response.clone());return response;
 }));
});
