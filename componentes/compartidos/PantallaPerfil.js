import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Linking, AsyncStorage } from 'react-native';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';
import { Ionicons } from '@expo/vector-icons';
import PantallaPoliticas from './PantallaPoliticas';
import PantallaAdvertencia from './PantallaAdvertencia';
import PantallaAcerca from './PantallaAcerca';
import PantallaOtrasApps from './PantallaOtrasApps';

const PantallaPerfil = ({ navigation }) => {
  const logoDipa = require('../../assets/imagenes/Logo DIPApp.png');

  const opcionesMenu = [
    { 
      id: 1, 
      titulo: 'Advertencia', 
      onPress: () => navigation.navigate('Advertencia')
    },
    { 
      id: 2, 
      titulo: 'Acerca de DIPA', 
      onPress: () => navigation.navigate('Acerca')
    },
    { 
      id: 3, 
      titulo: 'Otras aplicaciones educativas', 
      onPress: () => navigation.navigate('OtrasApps')
    },
  ];

  const redesSociales = [
    { 
      id: 1, 
      nombre: 'Facebook', 
      icono: 'logo-facebook',
  url: 'https://www.facebook.com/CUDipa/',
      color: '#3b5998'
    },
    { 
      id: 2, 
      nombre: 'TikTok', 
      icono: 'logo-tiktok',
      url: 'https://www.tiktok.com/@dipacentrouniversitario?_t=ZS-90nUJCK1XCk&_r=1',
      color: '#000000'
    },
    { 
      id: 3, 
      nombre: 'Instagram', 
      icono: 'logo-instagram',
      url: 'https://www.instagram.com/dipa_oficial?igsh=MXI4Y3M2eXVudnVhcw==',
      color: '#E4405F'
    },
  ];

  const abrirRedSocial = (url) => {
    Linking.openURL(url).catch(err => console.error("Error al abrir URL:", err));
  };

  // Botón temporal para borrar AsyncStorage
  const borrarAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert('Todos los datos han sido borrados. Reinicia la app para ver el efecto.');
    } catch (e) {
      alert('Error al borrar datos: ' + e.message);
    }
  };

  // Botón temporal para borrar solo la intro
  const borrarIntro = async () => {
    try {
      await AsyncStorage.removeItem('usuarioVioIntro');
      alert('La introducción se mostrará la próxima vez que abras la app. Cierra y vuelve a abrir la app.');
    } catch (e) {
      alert('Error al borrar intro: ' + e.message);
    }
  };

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Image source={logoDipa} style={styles.logo} />
        </View>

        <View style={styles.menuContainer}>
          {opcionesMenu.map((opcion, index) => (
            <TouchableOpacity
              key={opcion.id}
              style={[
                styles.menuItem,
                index === opcionesMenu.length - 1 && styles.menuItemLast
              ]}
              onPress={opcion.onPress}
            >
              <Text style={styles.menuTexto}>{opcion.titulo}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={colores.muted} 
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.redesContainer}>
          {redesSociales.map(red => (
            <TouchableOpacity key={red.id} onPress={() => Linking.openURL(red.url)} style={styles.redSocialBtn}>
              <Ionicons name={red.icono} size={32} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            DIPApp{"\n"}
            v1.0{"\n"}
            © Centro Universitario DIPA A.C. La app es educativa y de consulta personal, basada en los programas académicos del centro. No sustituye la formación académica y el uso indebido es responsabilidad del usuario.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.bg,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colores.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuTexto: {
    flex: 1,
    fontSize: 16,
    color: colores.text,
    fontFamily: tipografia.bold,
  },
  redesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    gap: 24,
  },
  redSocialBtn: {
    backgroundColor: colores.primary,
    borderRadius: 32,
    padding: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 32,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  footerText: {
    fontSize: 13,
    color: colores.muted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PantallaPerfil;
