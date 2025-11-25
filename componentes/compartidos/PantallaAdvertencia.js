import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';

const iconoAdvertencia = require('../../assets/imagenes/Maqueta DIPApp.png');

const PantallaAdvertencia = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={iconoAdvertencia} style={styles.icono} />
      <Text style={styles.titulo}>Advertencia</Text>
      <Text style={styles.texto}>
        Esta aplicación de referencia rápida, no es un manual de entrenamiento ni sustituye de manera alguna el entrenamiento, la capacitación o destreza del personal de salud o de las emergencias que se encuentran a bordo de una unidad de transporte.{"\n\n"}Es meramente una recopilación de datos y escalas que le pueden ser útiles a los profesionales de la salud y las emergencias en el trabajo diario o estudio. Esta app no certifica a nadie, está directamente bajo la responsabilidad de quienes los apliquen. No se trata de un manual digital de entrenamiento.
      </Text>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icono: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  titulo: {
    fontSize: 28,
    fontFamily: tipografia.bold,
    marginBottom: 18,
    color: '#00AAF0',
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
    color: colores.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PantallaAdvertencia;
