// componentes/PantallaTemas.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { getTemasPorAcademia } from '../librerias/api';
import { Ionicons } from '@expo/vector-icons';
import colores from '../recursos/colores';
import { tipografia } from '../recursos/estilos';

// 1. Añadimos { route, navigation } a los props.
// 'route' nos da acceso a los parámetros que pasamos (como el ID de la academia).
// 'navigation' nos permite navegar a otras pantallas.
const PantallaTemas = ({ route, navigation }) => {
  const [temas, setTemas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. Obtenemos el ID y el nombre de la academia que pasamos desde la pantalla Home.
  const { academiaId, academiaNombre } = route.params;

  useEffect(() => {
    // Usamos la función centralizada de apis.js
    setCargando(true);
    getTemasPorAcademia(academiaId)
      .then(data => setTemas(data))
      .catch(error => console.error(error))
      .finally(() => setCargando(false));
  }, [academiaId]);

  useEffect(() => {
    // Actualizamos el título de la barra de navegación con el nombre de la academia.
    navigation.setOptions({ title: academiaNombre });
  }, [academiaNombre, navigation]);


  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => {
        // Aquí navegaremos a la pantalla de detalle en el futuro.
        navigation.navigate('DetalleTema', { temaId: item.id, temaTitulo: item.title.rendered });
      }}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemNumber}>{index + 1}.</Text>
        <Text style={styles.itemText}>{item.title.rendered}</Text>
  <Ionicons name="chevron-forward" size={20} color={colores.accent} />
      </View>
    </TouchableOpacity>
  );

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
  <ActivityIndicator size="large" color={colores.primary} />
      </View>
    );
  }
  
  // 4. Mostramos un mensaje si no hay temas
  if (temas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No hay temas disponibles para esta academia.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={temas}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

// --- Estilos para la pantalla ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colores.border,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemNumber: {
    fontSize: 16,
    fontFamily: tipografia.bold,
    color: colores.accent,
    marginRight: 12,
    minWidth: 30,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colores.text,
  },
});

export default PantallaTemas;