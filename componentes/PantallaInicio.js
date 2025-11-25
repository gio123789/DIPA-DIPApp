// componentes/PantallaInicio.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colores from '../recursos/colores';
import { tipografia } from '../recursos/estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logoDipa = require('../assets/imagenes/Recurso 1.png');

const PantallaInicio = ({ onComplete }) => {
  // Usamos un estado para saber en qué paso de la introducción estamos
  const [paso, setPaso] = useState(1); // 1: Bienvenida, 2: Aviso de uso

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  const handleComplete = async () => {
    try {
      // Guardamos en la memoria del teléfono que el usuario ya vio la intro
      await AsyncStorage.setItem('usuarioVioIntro', 'true');
      // Llamamos a la función que nos pasaron para que la app principal se actualice
      onComplete();
    } catch (e) {
      console.error("Error al guardar en AsyncStorage", e);
    }
  };

  if (paso === 1) {
    // Pantalla 2 de tu maqueta
    return (
      <SafeAreaView style={styles.container}>
  {/* <Text style={styles.titulo}>DIPApp</Text> */}
        <Image source={logoDipa} style={styles.logo} />
        <Text style={styles.subtitulo}>Respuestas fiables y de libre acceso a todas tus dudas diarias, disponibles sin conexión y en cualquier lugar.</Text>
        <TouchableOpacity style={styles.boton} onPress={() => setPaso(2)}>
          <Text style={styles.botonTexto}>EMPECEMOS</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>Centro Universitario DIPA{"\n"}Todos los derechos reservados</Text>
      </SafeAreaView>
    );
  }

  const handleLink = () => {
    Linking.openURL('https://cudipa.mx/aviso-de-privacidad.php');
  };

  if (paso === 2) {
    // Pantalla 3 de tu maqueta
    return (
      <SafeAreaView style={styles.containerAviso}>
        <Text style={styles.tituloAviso}>Aviso de uso y responsabilidad</Text>
        
        <Text style={styles.textoAviso}>
          La aplicación de Centro Universitario DIPA A.C. es 100% educativa, diseñada como herramienta de apoyo basada en los programas académicos de cada academia del centro.{"\n\n"}
          Toda la información está referenciada con fuentes confiables y se actualizará continuamente conforme se renueven nuestros programas. Esta app no sustituye el aprendizaje ni la formación académica, y su uso es personal e informativo, con el objetivo de ayudar a alumnos, egresados y personal del Centro Universitario DIPA A.C. a consultar información de manera rápida en su día a día, incluso en situaciones de servicio o emergencia.{"\n\n"}
          No nos hacemos responsables del uso indebido de la información proporcionada. Su empleo es bajo la responsabilidad de cada usuario.{"\n\n"}
          Para más información, pueden consultar las políticas de privacidad y uso de datos en:{"\n"}
          <Text style={styles.linkInline} onPress={handleLink}>www.cudipa.mx</Text>
        </Text>
        
        <View style={styles.checkboxContainer}>
          {/* Primer checkbox */}
          <View style={styles.checkRow}>
            <TouchableOpacity
              style={[styles.checkbox, aceptaTerminos && styles.checkboxChecked]}
              onPress={() => setAceptaTerminos(!aceptaTerminos)}
              activeOpacity={0.7}
            >
              {aceptaTerminos && (
                <Ionicons name="checkmark" size={20} color={colores.accent} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => setAceptaTerminos(!aceptaTerminos)}
              activeOpacity={0.7}
            >
              <Text style={styles.checkLabel}>Acepto los términos y condiciones</Text>
            </TouchableOpacity>
          </View>

          {/* Segundo checkbox */}
          <View style={styles.checkRow}>
            <TouchableOpacity
              style={[styles.checkbox, aceptaPoliticas && styles.checkboxChecked]}
              onPress={() => setAceptaPoliticas(!aceptaPoliticas)}
              activeOpacity={0.7}
            >
              {aceptaPoliticas && (
                <Ionicons name="checkmark" size={20} color={colores.accent} />
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkLabel}>
                Acepto que mis informaciones sean procesadas como descrito. <Text style={styles.link} onPress={handleLink}>Las políticas de privacidad</Text>, a continuación describo cómo se manejan los datos personales.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.botonAviso, !(aceptaTerminos && aceptaPoliticas) && styles.botonDisabled]}
          onPress={handleComplete}
          disabled={!(aceptaTerminos && aceptaPoliticas)}
        >
          <Text style={styles.botonTexto}>CONTINUAR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30, 
    backgroundColor: '#ffffff' 
  },
  logo: { 
    width: 140,
    height: 140,
    marginBottom: 24,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  titulo: { 
    fontSize: 28, 
    fontFamily: tipografia.bold, 
    color: colores.primary,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  subtitulo: { 
    fontSize: 15, 
    color: colores.textSecondary, 
    textAlign: 'center', 
    marginBottom: 40,
    marginHorizontal: 10,
  },
  footer: {
    fontSize: 12,
    color: colores.muted,
    textAlign: 'center',
    marginTop: 40,
  },
  parrafo: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginVertical: 30, 
    lineHeight: 24,
    color: colores.text,
    paddingHorizontal: 20
  },
  boton: { 
    backgroundColor: colores.primary, 
    paddingVertical: 15, 
    paddingHorizontal: 50, 
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  botonTexto: { 
    color: 'white', 
    fontSize: 16, 
    fontFamily: tipografia.bold,
    letterSpacing: 1
  },
  botonDisabled: {
    backgroundColor: colores.muted,
    opacity: 0.6,
  },
  containerAviso: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  tituloAviso: {
    fontSize: 18,
    fontFamily: tipografia.bold,
    color: colores.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  textoAviso: {
    fontSize: 13,
    color: colores.text,
    lineHeight: 20,
    textAlign: 'left',
    marginBottom: 20,
  },
  linkInline: {
    fontSize: 13,
    color: colores.text,
    fontFamily: tipografia.bold,
    textDecorationLine: 'underline',
  },
  botonAviso: {
    backgroundColor: colores.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colores.accent,
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: colores.accent,
    backgroundColor: '#fff',
  },
  checkLabel: {
    fontSize: 13,
    color: colores.text,
    lineHeight: 18,
  },
  link: {
    fontSize: 13,
    color: colores.accent,
    textDecorationLine: 'underline',
    lineHeight: 18,
  },
});

export default PantallaInicio;