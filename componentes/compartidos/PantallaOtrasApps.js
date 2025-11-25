import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Linking, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colores from '../../recursos/colores';
import { tipografia, radios } from '../../recursos/estilos';

const apps = [
  {
    id: 1,
    nombre: 'Podcast social',
    descripcion: '',
    logo: require('../../assets/imagenes/Logo DIPA Estudio.png'),
    url: 'https://dipaestudio.mx/',
  },
  {
    id: 2,
    nombre: 'DIPApp informativa',
    descripcion: '',
    logo: require('../../assets/imagenes/Logo DIPApp.png'),
    url: 'https://cudipa.mx/vida-cudipa/',
  },
  {
    id: 3,
    nombre: 'Maxnic app de formación',
    descripcion: '',
    logo: require('../../assets/imagenes/Logo Maxnic.png'),
    url: 'https://maxnic.mx/',
  },
];

const PantallaOtrasApps = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
    <View style={styles.listContainer}>
      {apps.map(app => (
        <TouchableOpacity
          key={app.id}
          style={styles.appItem}
          onPress={() => app.url && Linking.openURL(app.url)}
          activeOpacity={app.url ? 0.7 : 1}
        >
          {app.logo ? (
            <Image source={app.logo} style={styles.logoApp} />
          ) : (
            <View style={styles.logoApp} />
          )}
          <Text style={styles.appNombre}>{app.nombre}</Text>
          <View style={styles.arrowBtn}>
            <Ionicons name="arrow-forward" size={28} color="#fff" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 18,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.surfaceAlt,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 0,
    gap: 12,
  },
  logoApp: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    resizeMode: 'contain',
  },
  appNombre: {
    flex: 1,
    fontSize: 16,
    color: colores.primary,
    fontFamily: tipografia.bold,
    marginLeft: 10,
  },
  arrowBtn: {
    backgroundColor: colores.primary,
    borderRadius: 22,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PantallaOtrasApps;
