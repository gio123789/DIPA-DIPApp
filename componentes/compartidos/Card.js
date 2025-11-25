// compartidos/Card.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colores from '../../recursos/colores';
import { tipografia } from '../../recursos/estilos';

const Card = ({ titulo, descripcion, imagenUrl, onPress }) => {
  const [showDescripcion, setShowDescripcion] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          {imagenUrl ? (
            <Image source={{ uri: imagenUrl }} style={styles.cardImage} resizeMode="contain" />
          ) : (
            <View style={[styles.cardImage, styles.imagePlaceholder]} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>{titulo}</Text>
          {descripcion && (
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowDescripcion(!showDescripcion)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={showDescripcion ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color={colores.accent} 
              />
            </TouchableOpacity>
          )}
        </View>
        {showDescripcion && descripcion && (
          <Text style={styles.cardDescription}>{descripcion}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: colores.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colores.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 20,
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: tipografia.bold,
    color: colores.text,
    textAlign: 'center',
  },
  toggleButton: {
    padding: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: colores.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colores.border,
  },
});

export default Card;
