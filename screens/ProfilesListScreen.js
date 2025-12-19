import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

// Axios instance'ımız (baseURL ayarlı)
import { api } from '../api/client';

export default function ProfilesListScreen({ navigation }) {
  // Ekranda göstereceğimiz profil listesi
  const [profiles, setProfiles] = useState([]);

  // Sayfalama için: hangi sayfadayız?
  const [page, setPage] = useState(1);

  // Şu an veri çekiyor muyuz?
  const [loading, setLoading] = useState(false);

  // Hata mesajı (varsa)
  const [error, setError] = useState(null);

  // Daha fazla veri var mı? (API boş dönerse false yapacağız)
  const [hasMore, setHasMore] = useState(true);

  // Pull-to-refresh için state
    const [refreshing, setRefreshing] = useState(false);

    // Yukarı çekince çalışacak fonksiyon
    const onRefresh = async () => {
    setRefreshing(true);

    // Listeyi ve sayfayı sıfırla
    setProfiles([]);
    setPage(1);
    setHasMore(true);

    // İlk sayfayı tekrar çek
    await fetchProfiles();

    setRefreshing(false);
    };


  /**
   * API'den profilleri sayfa sayfa çeker.
   * - loading true ise aynı anda ikinci isteği atmaz (çakışmayı önler)
   * - hasMore false ise artık istek atmayı durdurur (daha veri yok)
   */
  const fetchProfiles = async () => {
    // Eğer zaten yükleme yapıyorsak veya veri kalmadıysa çık
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      // Örnek istek: /profiles?page=1&limit=10
      const res = await api.get(`/profiles?page=${page}&limit=10`);

      // res.data'nin bir dizi olduğunu varsayıyoruz: [{id, name, email}, ...]
      if (!res.data || res.data.length === 0) {
        // API boş döndüyse artık veri yok
        setHasMore(false);
      } else {
        // Yeni gelenleri eskilerin sonuna ekle
        setProfiles((prev) => [...prev, ...res.data]);

        // Bir sonraki sayfaya geç
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError('Failed to load profiles. Check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect:
   * Bu ekran ilk açıldığında BİR kez çalışır.
   * Burada ilk sayfayı çekiyoruz.
   */
  useEffect(() => {
    fetchProfiles();
    // [] boş olduğu için sadece ilk render'da çalışır
  }, []);

  /**
   * FlatList her elemanı böyle çizer.
   * Pressable: tıklanabilir kart
   */
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate('ProfileDetail', {
          // Detay ekrana parametre gönderiyoruz
          // Detay ekranda route.params.profileId ile alabilirsin
          profileId: item.id,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </Pressable>
  );

  /**
   * Liste en altına gelince "yükleniyor" göstermek için footer
   */
  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  // Liste boşsa gösterilecek bileşen
    const renderEmpty = () => {
        if (loading) return null;
    
        return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No profiles found</Text>
        </View>
        );
    };

    if (loading && profiles.length === 0) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading profiles...</Text>
          </View>
        );
      }
      
  

  /**
   * Eğer hata var ve hiç veri yoksa (ilk yükleme başarısız)
   * kullanıcıya retry ekranı göster.
   */
  if (error && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={fetchProfiles}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}

        // Kullanıcı aşağı indikçe yeni sayfayı çek
        onEndReached={fetchProfiles}

        // Ne kadar yaklaşınca tetiklensin?
        // 0.5 => listenin sonuna %50 kala çalıştır
        onEndReachedThreshold={0.5}

        // En altta loading göstergesi
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          
      />
    </View>
  );
}

/**
 * StyleSheet:
 * CSS benzeri ama React Native'e uygun stil sistemi.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,

    // iOS gölgesi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android gölgesi
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
