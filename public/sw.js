self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("PWA активирован");
});

self.addEventListener("fetch", function () {
  // базовый оффлайн режим (упрощённый)
});