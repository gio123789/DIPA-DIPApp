// componentes/PantallaBuscador.js
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';
import { buscarContenido } from '../../librerias/api';

const PantallaBuscador = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('Busca un tema.');

  const buscar = (texto) => {
    setQuery(texto);
    if (texto.length < 3) {
      setResultados([]);
      setMensaje('Escribe al menos 3 letras para buscar.');
      return;
    }

    setCargando(true);
    buscarContenido(texto)
      .then(data => {
        // Filtrar solo temas
        const soloTemas = data.filter(item => item.tipo === 'tema');
        if (soloTemas.length === 0) {
          setMensaje('No se encontraron temas.');
        }
        setResultados(soloTemas);
      })
      .catch(error => {
        console.error(error);
        setMensaje('Error al realizar la búsqueda.');
      })
      .finally(() => setCargando(false));
  };

  const navegarA = (item) => {
    if (item.tipo === 'tema') {
      navigation.navigate('DetalleTema', { 
        temaId: item.id, 
        temaTitulo: item.title 
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colores.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar tema..."
            value={query}
            onChangeText={buscar}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => buscar('')}>
              <Ionicons name="close-circle" size={20} color={colores.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        {cargando ? (
          <ActivityIndicator size="large" color={colores.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={resultados}
            keyExtractor={(item, index) => `${item.tipo}-${item.id}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navegarA(item)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemText}>{item.title}</Text>
                    <View style={[styles.badge, styles[`badge${item.tipo}`]]}>
                      <Text style={styles.badgeText}>{item.tipoLabel}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colores.accent} />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.mensaje}>{mensaje}</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: colores.bg 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colores.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colores.text,
  },
  itemContainer: { 
    backgroundColor: 'white', 
    padding: 16, 
    marginVertical: 6, 
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: { 
    flex: 1,
    fontSize: 16, 
    color: colores.text, 
    fontFamily: tipografia.regular,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeacademia: {
    backgroundColor: '#E3F2FD',
  },
  badgetema: {
    backgroundColor: '#F3E5F5',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: tipografia.bold,
    color: colores.text,
    textTransform: 'uppercase',
  },
  mensaje: { 
    textAlign: 'center', 
    marginTop: 40, 
    fontSize: 16, 
    color: colores.textSecondary,
    paddingHorizontal: 20,
  },
});

export default PantallaBuscador;