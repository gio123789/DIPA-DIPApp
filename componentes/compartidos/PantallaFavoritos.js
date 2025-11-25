// componentes/PantallaFavoritos.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PantallaFavoritos = ({ navigation }) => {
  const [temasFavoritos, setTemasFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // useFocusEffect se ejecuta cada vez que el usuario entra a esta pantalla
  useFocusEffect(
    useCallback(() => {
      const cargarFavoritos = async () => {
        setCargando(true);
        const favoritosIds = await AsyncStorage.getItem('favoritos');
        const favoritosArray = favoritosIds ? JSON.parse(favoritosIds) : [];

        if (favoritosArray.length > 0) {
          console.log('Cargando favoritos:', favoritosArray);
          // Obtener todos los temas favoritos con información de la academia
          fetch(`https://cudipa.mx/vida-cudipa/wp-json/wp/v2/temas?include=${favoritosArray.join(',')}&_fields=id,title,acf`)
            .then(res => res.json())
            .then(temas => {
              console.log('Temas favoritos recibidos:', temas);
              
              // Verificar si temas es un array
              if (!Array.isArray(temas)) {
                console.error('Temas no es un array:', temas);
                setTemasFavoritos([]);
                setCargando(false);
                return;
              }
              
              // Crear mapa de academia IDs únicos
              const academiaIds = [...new Set(temas.map(tema => {
                const academiaRelacionada = tema.acf?.academia_relacionada;
                // Si es un array, tomar el primer elemento
                if (Array.isArray(academiaRelacionada) && academiaRelacionada.length > 0) {
                  const academia = academiaRelacionada[0];
                  // Si el elemento es un objeto, extraer el ID
                  return academia?.ID || academia?.id || academia;
                }
                // Si es un objeto directo, extraer el ID
                if (academiaRelacionada && typeof academiaRelacionada === 'object') {
                  return academiaRelacionada.ID || academiaRelacionada.id;
                }
                // Si es un número directo, devolverlo
                return academiaRelacionada;
              }).filter(id => id && typeof id === 'number'))];
              
              if (academiaIds.length > 0) {
                // Obtener nombres de academias
                console.log('IDs de academias a buscar:', academiaIds);
                fetch(`https://cudipa.mx/vida-cudipa/wp-json/wp/v2/academia?include=${academiaIds.join(',')}&_fields=id,title`)
                  .then(res => res.json())
                  .then(academias => {
                    console.log('Academias recibidas en favoritos:', academias);
                    
                    // Crear mapa de academias
                    const academiaMap = {};
                    if (Array.isArray(academias)) {
                      academias.forEach(academia => {
                        console.log(`Mapeando academia: ${academia.id} -> ${academia.title.rendered}`);
                        academiaMap[academia.id] = academia.title.rendered;
                      });
                    } else if (academias && academias.id) {
                      console.log(`Mapeando academia única: ${academias.id} -> ${academias.title.rendered}`);
                      academiaMap[academias.id] = academias.title.rendered;
                    }
                    
                    console.log('Mapa de academias creado:', academiaMap);
                    
                    // Agregar nombre de academia a cada tema
                    const temasConAcademia = temas.map(tema => {
                      let academiaId = tema.acf?.academia_relacionada;
                      
                      // Extraer el ID correcto del campo academia_relacionada
                      if (Array.isArray(academiaId) && academiaId.length > 0) {
                        const academia = academiaId[0];
                        academiaId = academia?.ID || academia?.id || academia;
                      } else if (academiaId && typeof academiaId === 'object') {
                        academiaId = academiaId.ID || academiaId.id;
                      }
                      
                      const academiaNombre = academiaMap[academiaId] || 'Academia desconocida';
                      console.log(`Tema: ${tema.title.rendered}, Academia ID: ${academiaId}, Nombre: ${academiaNombre}`);
                      return {
                        ...tema,
                        academiaNombre
                      };
                    });
                    
                    setTemasFavoritos(temasConAcademia);
                  })
                  .catch(err => {
                    console.error('Error al cargar academias:', err);
                    // Aún así mostrar los temas sin nombres de academias
                    const temasConAcademia = temas.map(tema => ({
                      ...tema,
                      academiaNombre: 'Academia desconocida'
                    }));
                    setTemasFavoritos(temasConAcademia);
                  })
                  .finally(() => setCargando(false));
              } else {
                console.log('No se encontraron IDs de academias');
                const temasConAcademia = temas.map(tema => ({
                  ...tema,
                  academiaNombre: 'Academia desconocida'
                }));
                setTemasFavoritos(temasConAcademia);
                setCargando(false);
              }
            })
            .catch(err => {
              console.error('Error al cargar favoritos:', err);
              setCargando(false);
            });
        } else {
          setTemasFavoritos([]);
          setCargando(false);
        }
      };
      cargarFavoritos();
    }, [])
  );

  const eliminarFavorito = async (temaId) => {
    try {
      const favoritosIds = await AsyncStorage.getItem('favoritos');
      let favoritosArray = favoritosIds ? JSON.parse(favoritosIds) : [];
      
      // Filtrar el tema eliminado
      favoritosArray = favoritosArray.filter(id => id !== temaId);
      
      // Guardar de nuevo
      await AsyncStorage.setItem('favoritos', JSON.stringify(favoritosArray));
      
      console.log(`Tema ${temaId} eliminado de favoritos`);
      
      // Actualizar la lista localmente
      setTemasFavoritos(prev => prev.filter(tema => tema.id !== temaId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  const confirmarEliminar = (temaId, titulo) => {
    Alert.alert(
      'Eliminar favorito',
      `¿Deseas eliminar "${titulo}" de tus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarFavorito(temaId) },
      ],
      { cancelable: true }
    );
  };

  const renderTema = ({ item }) => (
    <View style={styles.temaItem}>
      <TouchableOpacity
        style={styles.temaContent}
        onPress={() => navigation.navigate('DetalleTema', {
          temaId: item.id,
          temaTitulo: item.title.rendered 
        })}
      >
  <Ionicons name="folder" size={32} color={colores.primary} style={styles.folderIcon} />
        <View style={styles.temaInfo}>
          <Text style={styles.temaTitulo}>{item.title.rendered}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.temaActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => confirmarEliminar(item.id, item.title.rendered)}
        >
          <Ionicons name="trash-outline" size={24} color={colores.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cargando) {
    return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colores.primary} />
          <Text style={styles.loadingText}>Cargando favoritos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colores.bg }}>
      <View style={styles.container}>
        <FlatList
          data={temasFavoritos}
          renderItem={renderTema}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.mensajeContainer}>
              <Ionicons name="heart-outline" size={64} color="#ccc" />
              <Text style={styles.mensaje}>No tienes temas guardados en favoritos</Text>
              <Text style={styles.submensaje}>Los temas que marques como favoritos aparecerán aquí</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  temaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colores.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  temaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  folderIcon: {
    marginRight: 16,
  },
  temaInfo: {
    flex: 1,
  },
  temaTitulo: {
    fontSize: 16,
    fontFamily: tipografia.bold,
    color: colores.text,
    marginBottom: 4,
  },
  temaAcademia: {
    fontSize: 13,
    color: colores.muted,
  },
  temaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  mensajeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  mensaje: {
    fontSize: 18,
    fontFamily: tipografia.bold,
    textAlign: 'center',
    color: colores.muted,
    marginTop: 20,
    marginBottom: 10,
  },
  submensaje: {
    fontSize: 14,
    textAlign: 'center',
    color: colores.textSecondary,
  },
});

export default PantallaFavoritos;