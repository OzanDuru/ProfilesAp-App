// HTTP istekleri yapmak için axios kütüphanesini import ediyoruz
import axios from 'axios';

// Expo environment değişkeninden API adresimizi alıyoruz
// Örnek: http://172.20.10.2:3000
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Axios için hazır bir instance (örnek) oluşturuyoruz
// Böylece her istekte tekrar tekrar base URL yazmak zorunda kalmayız
export const api = axios.create({
  baseURL: API_BASE_URL, // Tüm isteklerin başına eklenecek ana adres
});
