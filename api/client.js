import axios from 'axios';

// Expo env değişkeninden API'nin ana adresini alıyoruz.
// Örn: http://172.20.10.2:3000
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Axios "instance" oluşturuyoruz.
 * Instance = ayarları hazır axios objesi.
 * Böylece her istekte baseURL yazmayız.
 */
export const api = axios.create({
  baseURL: API_BASE_URL, // Tüm isteklerin başına eklenecek ana adres
  timeout: 10000,        // 10 saniye içinde cevap gelmezse isteği kes (timeout)
});

/**
 * Interceptor (araya giren):
 * Axios'un response (cevap) aşamasına "araya girip" işlem yapmamızı sağlar.
 *
 * - Başarılı cevap gelirse: olduğu gibi döndürürüz
 * - Hata gelirse: burada ortak bir şekilde yakalayıp daha anlaşılır hata mesajları üretiriz
 */
api.interceptors.response.use(
  // 1) Başarılı istek: response'u aynen geri döndür
  (response) => response,

  // 2) Hata olursa burası çalışır
  (error) => {
    /**
     * error.response yoksa:
     * - İnternet yok
     * - Sunucuya ulaşılamadı
     * - Timeout oldu
     * gibi durumlar olabilir.
     */
    if (!error.response) {
      // Daha okunur bir hata mesajı fırlatıyoruz
      return Promise.reject(new Error('Network error. Check your connection.'));
    }

    // Sunucudan cevap geldi ama status code hata olabilir.
    const status = error.response.status;

    // 404: endpoint bulunamadı
    if (status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }

    // 500 ve üzeri: sunucu hatası
    if (status >= 500) {
      return Promise.reject(
        new Error('Server error. Please try again later.')
      );
    }

    // Diğer hataları (örn 400, 401, 403) olduğu gibi ilet
    return Promise.reject(error);
  }
);
