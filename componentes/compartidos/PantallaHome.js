// PantallaHome.js

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Card from './Card';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';
import { getAcademias } from '../../librerias/api';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PantallaHome = () => {
  const [academias, setAcademias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  // Función para cargar las academias
  const cargarAcademias = () => {
    setCargando(true);
    getAcademias()
      .then(data => {
        console.log('Academias recibidas:', data.length);
        // Log de la primera academia para ver su estructura
        if (data.length > 0) {
          console.log('Primera academia:', JSON.stringify(data[0], null, 2));
        }
        setAcademias(data);
      })
      .catch(error => {
        console.error("Error al obtener las academias:", error);
      })
      .finally(() => setCargando(false));
  };

  // Recargar cada vez que la pantalla obtiene el foco
  useFocusEffect(
    React.useCallback(() => {
      cargarAcademias();
    }, [])
  );
  // Función para renderizar cada tarjeta de academia
  const renderItem = ({ item }) => {
    // Obtener descripción de ACF o excerpt o content
    const descripcionACF = item.acf?.descripcion_academia;
    const descripcionExcerpt = item.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim();
    const descripcionContent = item.content?.rendered?.replace(/<[^>]*>/g, '').trim();
    const descripcion = descripcionACF || descripcionExcerpt || descripcionContent || '';
    
    // Obtener imagen de ACF o featured media
    const imagenACF = item.acf?.imagen_academia;
    const imagenFeatured = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const imagenUrl = imagenACF || imagenFeatured;
    
    console.log(`Academia: ${item.title.rendered}`);
    console.log(`  - Descripción ACF: "${descripcionACF}"`);
    console.log(`  - Imagen ACF: "${imagenACF}"`);
    console.log(`  - Imagen Featured: "${imagenFeatured}"`);
    
    return (
      <Card
        titulo={item.title.rendered}
        descripcion={descripcion}
        imagenUrl={imagenUrl}
        onPress={() => navigation.navigate('Materias', { 
          academiaId: item.id, 
          academiaNombre: item.title.rendered 
        })}
      />
    );
  };

  // Si aún está cargando, mostramos un círculo
  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colores.primary} />
        <Text>Cargando Academias...</Text>
      </View>
    );
  }

  // Cuando ya cargó, mostramos la lista
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
      <View style={styles.container}>
        <FlatList
          data={academias}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

// --- Estilos para la pantalla ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colores.bg,
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    backgroundColor: colores.surfaceAlt,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: tipografia.bold,
    textAlign: 'center',
    color: colores.text,
  },
});

export default PantallaHome;