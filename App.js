// React Navigation'dan gerekli bileşenleri import ediyoruz
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Kendi oluşturduğumuz ekran (screen) bileşenlerini import ediyoruz
import ProfilesListScreen from './screens/ProfilesListScreen';
import ProfileDetailScreen from './screens/ProfileDetailScreen';

// Stack navigator oluşturuyoruz
// Bu, ekranlar arasında "ileri-geri" geçiş yapmamızı sağlar
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // NavigationContainer: Navigasyon sisteminin en dış sarmalayıcısıdır
    // Uygulamada sadece BİR tane olur
    <NavigationContainer>
      
      {/* Stack.Navigator: Bu uygulamadaki stack yapısını tanımlar */}
      <Stack.Navigator>
        
        {/* İlk ekran: Profil listesini gösterir */}
        <Stack.Screen
          name="Profiles"                 // Ekranın navigasyondaki adı
          component={ProfilesListScreen} // Gösterilecek React component
        />

        {/* İkinci ekran: Seçilen profilin detayını gösterir */}
        <Stack.Screen
          name="ProfileDetail"
          component={ProfileDetailScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
