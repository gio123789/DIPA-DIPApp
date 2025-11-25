import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';

const PantallaAcerca = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: colores.primary }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/imagenes/Logo DIPA Blanco.png')} style={styles.logo} />
      <Text style={styles.textoBlanco}>
        Somos una institución educativa con 18 años de experiencia en la formación de profesionales en el área de la salud y emergencias al servicio de la sociedad. Mediante una capacitación constante a través de programas académicos integrales.
      </Text>
      <Text style={styles.subtitulo}>¿Por qué estudiar en DIPA?</Text>
      <Text style={styles.textoBlanco}>
        En Centro Universitario DIPA nos comprometemos a desarrollar tu potencial para contribuir de forma positiva a la comunidad.
      </Text>
      <Text style={styles.subtitulo}>Nuestra Misión</Text>
      <Text style={styles.textoBlanco}>
        El Centro Universitario DIPA A.C. tiene como misión capacitar y formar profesionales íntegros en el área de la salud y emergencias, desarrollando sus competencias, habilidades y valores, con el fin de brindar atención de calidad y contribuir al desarrollo social y cultural de la comunidad, a través de programas educativos pertinentes y estructurados.
      </Text>
      <View style={styles.iconosContainer}>
        <Image source={require('../../assets/imagenes/Logo Capacitando Para Salvar Vidas Blanco.png')} style={styles.logoBottom} />
        <Image source={require('../../assets/imagenes/Logo Formación Continua Blanco.png')} style={styles.logoBottom} />
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colores.primary,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  titulo: {
    fontSize: 22,
    fontFamily: tipografia.bold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 16,
    fontFamily: tipografia.bold,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  textoBlanco: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 16,
  },
  iconosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    gap: 24,
  },
  logoBottom: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
  },
});

export default PantallaAcerca;
