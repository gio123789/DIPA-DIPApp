// compartidos/header.js
import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';

// Si tienes un logo, asegúrate de tener la ruta correcta
// const logo = require('../../assets/imagenes/logo.png'); 

const Header = ({ titulo }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* {logo && <Image source={logo} style={styles.logo} />} */}
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colores.primary,
  },
  container: {
    height: 60,
    width: '100%',
    backgroundColor: colores.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 15,
  },
  titulo: {
    color: 'white',
    fontSize: 20,
    fontFamily: tipografia.bold,
  },
});

export default Header;
