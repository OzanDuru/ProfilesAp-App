import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';

import { api } from '../api/client';

export default function ProfileDetailScreen({ route, navigation }) {
  /**
   * route.params:
   * Bir önceki ekrandan (ProfilesListScreen) gönderdiğimiz veriler burada gelir.
   * Örn: navigation.navigate('ProfileDetail', { profileId: item.id })
   */
  const { profileId } = route.params;

  // Seçilen profilin detay verisi
  const [profile, setProfile] = useState(null);

  // Yükleme durumu (spinner göstermek için)
  const [loading, setLoading] = useState(true);

  // Hata mesajı
  const [error, setError] = useState(null);

  /**
   * API'den tek bir profilin detayını çeker
   * /profiles/:id endpoint'ine istek atıyoruz
   */
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/profiles/${profileId}`);
      setProfile(res.data);
    } catch (err) {
      setError('Failed to load profile details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect:
   * Bu ekran açılınca profili yükler.
   * profileId değişirse (başka profile geçilirse) tekrar çalışır.
   */
  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  // 1) Yükleniyorsa loading ekranı göster
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // 2) Hata varsa hata ekranı + retry göster
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // 3) Ne hata var ne loading ama profile yoksa: bulunamadı
  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  // 4) Her şey OK ise detay ekranını göster
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Üst başlık alanı */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
        </View>

        {/* Email */}
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{profile.age}</Text>
        </View>

        {/* Phone sadece varsa göster */}
        {profile.phone ? (
          <View style={styles.section}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
        ) : null}

        {/* Bio sadece varsa göster */}
        {profile.bio ? (
          <View style={styles.section}>
            <Text style={styles.label}>Bio</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,

    // iOS gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // Android gölge
    elevation: 4,
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 16,
    marginBottom: 16,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },

  section: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: '#333',
  },

  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
});
