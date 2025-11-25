
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';

const PantallaPoliticas = ({ navigation }) => {
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const handleLink = () => {
    Linking.openURL('https://cudipa.mx/aviso-de-privacidad.php');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
  {/* Título interno removido para evitar duplicar el del header */}
        <Text style={styles.texto}>
          La aplicación de Centro Universitario DIPA A.C. es 100% educativa, diseñada como herramienta de apoyo basada en los programas académicos de cada academia del centro.{"\n\n"}
          Toda la información está referenciada con fuentes confiables y se actualizará continuamente conforme se renueven nuestros programas. Esta app no sustituye el aprendizaje ni la formación académica, y su uso es personal e informativo, con el objetivo de ayudar a alumnos, egresados y personal del Centro Universitario DIPA A.C. a consultar información de manera rápida en su día a día, incluso en situaciones de servicio o emergencia.{"\n\n"}
          No nos hacemos responsables del uso indebido de la información proporcionada. Su empleo es bajo la responsabilidad de cada usuario.{"\n\n"}
          Para más información, pueden consultar las políticas de privacidad y uso de datos en:
        </Text>
        <Text style={styles.linkWeb} onPress={handleLink}>www.cudipa.mx</Text>

        <View style={styles.checkRow}>
          <TouchableOpacity
            style={[styles.checkbox, aceptaTerminos && styles.checkboxChecked]}
            onPress={() => setAceptaTerminos(!aceptaTerminos)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceptaTerminos }}
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
            <Text style={styles.checkLabelBold}>Acepto los términos y condiciones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkRow}>
          <TouchableOpacity
            style={[styles.checkbox, aceptaPrivacidad && styles.checkboxChecked]}
            onPress={() => setAceptaPrivacidad(!aceptaPrivacidad)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceptaPrivacidad }}
            activeOpacity={0.7}
          >
            {aceptaPrivacidad && (
              <Ionicons name="checkmark" size={20} color={colores.accent} />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkLabel}>
              Acepto que mis informaciones sean procesadas como descrito.{' '}
            </Text>
            <TouchableOpacity onPress={handleLink} activeOpacity={0.7}>
              <Text style={styles.link}>Las políticas de privacidad</Text>
            </TouchableOpacity>
            <Text style={styles.checkLabel}>, a continuación describo cómo se manejan los datos personales.</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.boton, !(aceptaTerminos && aceptaPrivacidad) && styles.botonDisabled]}
          disabled={!(aceptaTerminos && aceptaPrivacidad)}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.botonTexto}>CONTINUAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colores.bg,
    flexGrow: 1,
  },
  titulo: {
    fontSize: 20,
    fontFamily: tipografia.bold,
    color: colores.text,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  texto: {
    fontSize: 15,
    color: colores.text,
    lineHeight: 22,
    marginBottom: 18,
  },
  link: {
    color: colores.accent,
    textDecorationLine: 'underline',
  },
  linkWeb: {
    color: colores.text,
    fontFamily: tipografia.bold,
    marginBottom: 18,
    marginLeft: 2,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colores.accent,
    borderRadius: 4,
    marginRight: 10,
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
    marginTop: 2,
  },
  checkLabelBold: {
    fontSize: 14,
    color: colores.text,
    fontFamily: tipografia.bold,
    marginTop: 2,
  },
  boton: {
    backgroundColor: colores.primary,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  botonDisabled: {
    backgroundColor: colores.muted,
  },
  botonTexto: {
    color: '#fff',
    fontFamily: tipografia.bold,
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default PantallaPoliticas;
