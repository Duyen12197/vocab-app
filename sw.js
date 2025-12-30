/* sw.js - Service Worker chuyên nghiệp cho Learn English App */

// Mỗi khi bạn nâng cấp code, hãy đổi tên phiên bản ở đây (ví dụ: v3 -> v4)
const CACHE_NAME = 'english-learn-v4';

// Danh sách tất cả các file cần lưu trữ để chạy offline
const assets = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
  './chuc-nang.js',
  './giao-dien.js',
  './chu-de.js',  
  './tu-vung.js',  
  './mau-cau.js', 
  // Danh sách các icon assets (đảm bảo đúng đường dẫn)
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

// 1. CÀI ĐẶT (INSTALL): Lưu các file vào bộ nhớ đệm
self.addEventListener('install', e => {
  console.log('SW: Đang cài đặt phiên bản mới...');
  
  // Ép Service Worker mới kích hoạt ngay lập tức mà không chờ đóng App cũ
  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Đang lưu trữ toàn bộ assets vào cache...');
      return cache.addAll(assets);
    })
  );
});

// 2. KÍCH HOẠT (ACTIVATE): Dọn dẹp cache cũ và chiếm quyền điều khiển
self.addEventListener('activate', e => {
  console.log('SW: Đã kích hoạt phiên bản: ' + CACHE_NAME);
  
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // Tìm các cache cũ không trùng tên phiên bản mới
          .map(key => {
            console.log('SW: Đang xóa cache lỗi thời:', key);
            return caches.delete(key);
          })
      );
    })
  );
  
  // Giúp App cập nhật code mới ngay lập tức mà không cần F5 nhiều lần
  return self.clients.claim();
});

// 3. FETCH: Chiến lược "Cache First" (Lấy từ bộ nhớ trước, nếu không có mới lên mạng)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Nếu có trong cache, trả về luôn (tốc độ cực nhanh)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Nếu không có, thử tải từ mạng (Internet)
      return fetch(e.request).catch(() => {
        // Nếu mạng hỏng và file yêu cầu là trang chủ, trả về index.html (Offline mode)
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
