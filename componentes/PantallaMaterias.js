// componentes/PantallaMaterias.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { getMateriasPorAcademia, getTemasPorMateria } from '../librerias/api';
import { Ionicons } from '@expo/vector-icons';
import colores from '../recursos/colores';
import { tipografia } from '../recursos/estilos';

const PantallaMaterias = ({ route, navigation }) => {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [materiasExpandidas, setMateriasExpandidas] = useState({});
  const [temasPorMateria, setTemasPorMateria] = useState({});
  const [cargandoTemas, setCargandoTemas] = useState({});

  const { academiaId, academiaNombre } = route.params;

  useEffect(() => {
    setCargando(true);
    getMateriasPorAcademia(academiaId)
      .then(data => setMaterias(data))
      .catch(error => console.error(error))
      .finally(() => setCargando(false));
  }, [academiaId]);

  useEffect(() => {
    navigation.setOptions({ title: academiaNombre });
  }, [academiaNombre, navigation]);

  // Se eliminó el encabezado interno para evitar títulos duplicados; solo usamos el del header de navegación

  const toggleMateria = async (materiaId) => {
    const yaExpandida = materiasExpandidas[materiaId];
    
    // Toggle expandir/colapsar
    setMateriasExpandidas(prev => ({
      ...prev,
      [materiaId]: !yaExpandida
    }));

    // Si no está expandida y no tiene temas cargados, los cargamos
    if (!yaExpandida && !temasPorMateria[materiaId]) {
      setCargandoTemas(prev => ({ ...prev, [materiaId]: true }));
      try {
        const temas = await getTemasPorMateria(materiaId);
        setTemasPorMateria(prev => ({ ...prev, [materiaId]: temas }));
      } catch (error) {
        console.error('Error al cargar temas:', error);
      } finally {
        setCargandoTemas(prev => ({ ...prev, [materiaId]: false }));
      }
    }
  };

  const renderTema = (tema) => (
    <TouchableOpacity
      key={tema.id}
      style={styles.temaItem}
      onPress={() => navigation.navigate('DetalleTema', { 
        temaId: tema.id, 
        temaTitulo: tema.title.rendered 
      })}
      activeOpacity={0.7}
    >
      <Text style={styles.temaText}>{tema.title.rendered}</Text>
      <Ionicons name="chevron-forward" size={16} color={colores.textSecondary} />
    </TouchableOpacity>
  );

  const renderMateria = ({ item }) => {
    const expandida = materiasExpandidas[item.id];
    const temas = temasPorMateria[item.id] || [];
    const cargando = cargandoTemas[item.id];

    return (
      <View style={styles.materiaWrapper}>
        <TouchableOpacity
          style={styles.materiaContainer}
          onPress={() => toggleMateria(item.id)}
        >
          <View style={styles.materiaHeader}>
            <Ionicons 
              name={expandida ? 'chevron-down' : 'chevron-forward'} 
              size={24} 
              color={colores.primary} 
            />
            <Text style={styles.materiaText}>{item.title.rendered}</Text>
          </View>
        </TouchableOpacity>

        {expandida && (
          <View style={styles.temasSection}>
            {cargando ? (
              <ActivityIndicator size="small" color={colores.accent} style={{ marginVertical: 10 }} />
            ) : temas.length > 0 ? (
              temas.map((tema) => renderTema(tema))
            ) : (
              <Text style={styles.noTemasText}>No hay temas disponibles</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colores.primary} />
      </View>
    );
  }

  if (materias.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noMateriasText}>No hay materias disponibles para esta academia.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={materias}
      keyExtractor={item => item.id.toString()}
      renderItem={renderMateria}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.bg,
  },
  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: colores.bg,
  },
  materiaWrapper: {
    backgroundColor: 'white',
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  materiaContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colores.surface,
  },
  materiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materiaText: {
    flex: 1,
    fontSize: 18,
    fontFamily: tipografia.bold,
    color: colores.text,
    marginLeft: 12,
  },
  temasSection: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  temaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colores.border,
  },
  temaText: {
    flex: 1,
    fontSize: 15,
    color: colores.text,
  },
  noTemasText: {
    fontSize: 14,
    color: colores.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  noMateriasText: {
    fontSize: 16,
    color: colores.textSecondary,
  },
});

export default PantallaMaterias;
