// App.js
import  { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import Header from './componentes/compartidos/header';
import colores from './recursos/colores';
import { tipografia } from './recursos/estilos';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PantallaInicio from './componentes/PantallaInicio';
import SplashVideo from './componentes/SplashVideo';
import PantallaHome from './componentes/compartidos/PantallaHome';
import PantallaMaterias from './componentes/PantallaMaterias';
import PantallaDetalleTema from './componentes/PantallaDetalleTema';
import PantallaBuscador from './componentes/compartidos/PantallaBuscador';
import PantallaFavoritos from './componentes/compartidos/PantallaFavoritos';
import PantallaPerfil from './componentes/compartidos/PantallaPerfil';
import PantallaPoliticas from './componentes/compartidos/PantallaPoliticas';
import PantallaAdvertencia from './componentes/compartidos/PantallaAdvertencia';
import PantallaAcerca from './componentes/compartidos/PantallaAcerca';
import PantallaOtrasApps from './componentes/compartidos/PantallaOtrasApps';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colores.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: tipografia.bold },
        headerBackTitleVisible: false,
        headerBackTitle: '',
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={PantallaHome} 
        options={{ 
          header: () => <Header titulo="Academias DIPA" />
        }} 
      />
      <Stack.Screen name="Materias" component={PantallaMaterias} />
      <Stack.Screen name="DetalleTema" component={PantallaDetalleTema} />
    </Stack.Navigator>
  );
}

// Opciones comunes para todos los Stack Navigators
const stackScreenOptions = {
  headerStyle: { backgroundColor: colores.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontFamily: tipografia.bold },
  headerBackTitleVisible: false,
  headerBackTitle: '',
};

// Stack Navigator para Favoritos
function FavoritosStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name="MisFavoritos" 
        component={PantallaFavoritos} 
        options={{ title: 'Mis Favoritos' }} 
      />
      <Stack.Screen 
        name="DetalleTema" 
        component={PantallaDetalleTema} 
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Buscador
function BuscadorStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name="Buscar" 
        component={PantallaBuscador} 
        options={{ title: 'Buscar Temas' }} 
      />
      <Stack.Screen 
        name="DetalleTema" 
        component={PantallaDetalleTema} 
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Perfil
function PerfilStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Perfil" component={PantallaPerfil} options={{ title: 'Perfil' }} />
      <Stack.Screen name="Politicas" component={PantallaPoliticas} options={{ title: 'Políticas de Privacidad' }} />
      <Stack.Screen name="Advertencia" component={PantallaAdvertencia} options={{ title: 'Advertencia' }} />
      <Stack.Screen name="Acerca" component={PantallaAcerca} options={{ title: 'Acerca de DIPA' }} />
      <Stack.Screen name="OtrasApps" component={PantallaOtrasApps} options={{ title: 'Otras aplicaciones educativas' }} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Buscador') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colores.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStackNavigator} />
      <Tab.Screen name="Buscador" component={BuscadorStackNavigator} />
      <Tab.Screen name="Favoritos" component={FavoritosStackNavigator} />
      <Tab.Screen name="Perfil" component={PerfilStackNavigator} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [usuarioVioIntro, setUsuarioVioIntro] = useState(false);
  const [splashTerminado, setSplashTerminado] = useState(false);
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  useEffect(() => {
    const revisarSiVioIntro = async () => {
      try {
        const valor = await AsyncStorage.getItem('usuarioVioIntro');
        console.log('Valor usuarioVioIntro en AsyncStorage:', valor);
        if (valor !== null) {
          setUsuarioVioIntro(true);
        } else {
          setUsuarioVioIntro(false);
        }
      } catch (e) {
        console.error("Error al leer AsyncStorage", e);
      } finally {
        setCargando(false);
      }
    };
    revisarSiVioIntro();
  }, []);

  if (cargando || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!splashTerminado) {
    return <SplashVideo onFinish={() => setSplashTerminado(true)} />;
  }

  return (
    <NavigationContainer>
      {usuarioVioIntro ? (
        <MainTabNavigator />
      ) : (
        <PantallaInicio onComplete={() => setUsuarioVioIntro(true)} />
      )}
    </NavigationContainer>
  );
}