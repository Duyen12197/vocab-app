const CACHE_NAME = 'english-learn-v3';

// Danh sách các file cần lưu trữ để chạy offline
const assets = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
  // 10 Icon chủ đề mới trong thư mục assets
  './assets/gia-dinh.png',
  './assets/ban-than.png',
  './assets/so-dem-thoi-gian.png',
  './assets/mau-sac-hinh-dang.png',
  './assets/do-vat-xung-quanh.png',
  './assets/nha-cua.png',
  './assets/thuc-an-do-uong.png',
  './assets/mua-sam.png',
  './assets/giao-thong.png',
  './assets/suc-khoe.png'
];

// Bước 1: Cài đặt Service Worker và lưu các file vào bộ nhớ cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Đang lưu trữ các file assets...');
      return cache.addAll(assets);
    })
  );
});

// Bước 2: Kích hoạt và dọn dẹp bộ nhớ cache cũ
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Bước 3: Phản hồi các yêu cầu truy cập file (kể cả khi không có mạng)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // Trả về file từ cache nếu có, nếu không thì tải từ mạng
      return response || fetch(e.request);
    })
  );
});
