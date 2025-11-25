// componentes/PantallaDetalleTema.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTemaDetalle } from '../librerias/api';
import colores from '../recursos/colores';
import { tipografia } from '../recursos/estilos';
import { WebView } from 'react-native-webview';
import ModelViewerWeb from './compartidos/ModelViewerWeb';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PantallaDetalleTema = ({ route, navigation }) => {
  const { temaId, temaTitulo } = route.params;
  const [tema, setTema] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [esFavorito, setEsFavorito] = useState(false);

  // Verificar si el tema es favorito al cargar y cuando cambie
  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const favoritos = await AsyncStorage.getItem('favoritos');
        const favoritosArray = favoritos ? JSON.parse(favoritos) : [];
        const esFav = favoritosArray.includes(temaId);
        setEsFavorito(esFav);
        
        // Actualizamos el título y el botón de favorito
        navigation.setOptions({
          title: temaTitulo,
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleFavorito}
              style={{ padding: 8 }}
            >
              <Ionicons
                name={esFav ? 'heart' : 'heart-outline'}
                size={26}
                color={esFav ? '#e63946' : '#fff'}
              />
            </TouchableOpacity>
          ),
        });
      } catch (error) {
        console.error('Error al verificar favorito:', error);
      }
    };
    verificarFavorito();
  }, [temaId, esFavorito]); // Agregamos esFavorito como dependencia

  // Función para toggle favorito
  const toggleFavorito = async () => {
    try {
      const favoritos = await AsyncStorage.getItem('favoritos');
      let favoritosArray = favoritos ? JSON.parse(favoritos) : [];
      
      if (esFavorito) {
        // Quitar de favoritos
        favoritosArray = favoritosArray.filter(id => id !== temaId);
        console.log('Quitando de favoritos:', temaId);
      } else {
        // Agregar a favoritos
        if (!favoritosArray.includes(temaId)) {
          favoritosArray.push(temaId);
          console.log('Agregando a favoritos:', temaId);
        }
      }
      
      await AsyncStorage.setItem('favoritos', JSON.stringify(favoritosArray));
      setEsFavorito(!esFavorito);
    } catch (error) {
      console.error('Error al gestionar favoritos:', error);
    }
  };

  useEffect(() => {
    // Solo actualizamos el título
    navigation.setOptions({
      title: temaTitulo,
    });

    // Pedimos los datos del tema específico
    getTemaDetalle(temaId)
      .then(data => {
        console.log('JSON recibido del tema:', JSON.stringify(data, null, 2));
        setTema(data);
        // Si hay imágenes en la galería, las pedimos (si eso aplica en tu API)
        const acf = data?.acf;
        if (acf && acf.galeria_imagenes && acf.galeria_imagenes.length > 0) {
          // Aquí podrías usar otra función de apis.js para obtener las imágenes
          // Por ahora, dejamos el fetch directo, pero puedes centralizarlo si lo prefieres
        }
      })
      .catch(error => console.error(error))
      .finally(() => setCargando(false));
  }, [temaId]);

  if (cargando) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // Preparar contenido HTML completo: usar content.rendered si existe; si no, usar ACF.contenido_del_tema
  const contenidoHtml = tema?.content?.rendered || tema?.acf?.contenido_del_tema || '';

  // Buscar todos los marcadores [CUDIPA_MODELO_3D::URL] en el contenido
  const modelo3dRegex = /\[CUDIPA_MODELO_3D::([^\]]+)\]/g;
  let partes = [];
  let lastIndex = 0;
  let match;

  while ((match = modelo3dRegex.exec(contenidoHtml)) !== null) {
    // Texto antes del marcador
    if (match.index > lastIndex) {
      partes.push({ tipo: 'html', contenido: contenidoHtml.slice(lastIndex, match.index) });
    }
    // Modelo 3D: extraer URL del marcador
    let url = match[1];
    partes.push({ tipo: 'modelo3d', url });
    lastIndex = match.index + match[0].length;
  }
  // Log para depuración: ver si se detectan los marcadores y cómo quedan las partes
  console.log('Partes detectadas para renderizar:', JSON.stringify(partes, null, 2));
  // Agregar el resto del contenido si hay texto después del último marcador
  if (lastIndex < contenidoHtml.length) {
    partes.push({ tipo: 'html', contenido: contenidoHtml.slice(lastIndex) });
  }

  // Solo mostrar modelos 3D en la posición del shortcode. Si no hay shortcodes, mostrar solo el contenido HTML.
  // Si el contenido está vacío y hay modelo_3d en ACF, mostrar solo el modelo (caso extremo, nunca ambos a la vez).
  const acfModelo = tema?.acf?.modelo_3d;
  const acfModelUrl = typeof acfModelo === 'string' ? acfModelo : (acfModelo?.url || null);
  if (partes.length === 0) {
    if (!contenidoHtml || !contenidoHtml.trim()) {
      if (acfModelUrl) {
        partes = [{ tipo: 'modelo3d', url: acfModelUrl }];
      } else {
        partes = [{ tipo: 'html', contenido: contenidoHtml }];
      }
    } else {
      partes = [{ tipo: 'html', contenido: contenidoHtml }];
    }
  }
  const soloHtml = partes.length === 1 && partes[0].tipo === 'html';

  return (
    <ScrollView style={styles.container}>
      {soloHtml ? (
        // Modo anterior: un solo WebView alto para mostrar todo el contenido cuando no hay shortcodes
        <View style={{ height: 800 }}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: `<!doctype html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><style>body{margin:0;padding:16px;font-family:-apple-system,Roboto,'Segoe UI',system-ui,sans-serif;color:#333}img{max-width:100%;height:auto;border-radius:8px}figure{margin:0 0 16px}</style></head><body>${partes[0].contenido}</body></html>` }}
            style={{ flex: 1 }}
            scrollEnabled={false}
          />
        </View>
      ) : (
      partes.map((parte, idx) => {
        if (parte.tipo === 'html') {
          // Renderizar el fragmento HTML en WebView
          const htmlDocument = `
            <!doctype html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>
                  body { margin: 0; padding: 16px; font-family: -apple-system, Roboto, 'Segoe UI', system-ui, sans-serif; color: #333; }
                  img { max-width: 100%; height: auto; border-radius: 8px; }
                  figure { margin: 0 0 16px; }
                </style>
              </head>
              <body>
                ${parte.contenido}
              </body>
            </html>`;
          return (
            <View key={idx} style={{ height: 600, marginBottom: 8 }}>
              <WebView
                originWhitelist={["*"]}
                source={{ html: htmlDocument }}
                style={{ flex: 1 }}
                scrollEnabled={false}
              />
            </View>
          );
        } else if (parte.tipo === 'modelo3d') {
          return (
            <View key={idx} style={{ height: 300, marginVertical: 12 }}>
              <ModelViewerWeb modelUrl={parte.url} />
            </View>
          );
        }
        return null;
      })
      )}

      {/* Mostramos la galería de imágenes */}
      {imagenes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Galería</Text>
          <FlatList
            data={imagenes}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {/* Mostramos la advertencia si existe */}
      {tema?.acf?.advertencia_tema && (
        <View style={styles.advertenciaContainer}>
          <Text style={styles.advertenciaTitle}>⚠️ Advertencia</Text>
          <Text style={styles.advertenciaTexto}>{tema.acf.advertencia_tema}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 0, backgroundColor: '#fff' },
  contenido: { fontSize: 16, lineHeight: 24, color: colores.text },
  sectionTitle: { fontSize: 20, fontFamily: tipografia.bold, color: colores.text, marginTop: 20, marginBottom: 10 },
  galleryImage: { width: 250, height: 250, borderRadius: 10, marginRight: 10 },
  advertenciaContainer: { backgroundColor: '#fffbe6', borderColor: '#ffe58f', borderWidth: 1, borderRadius: 8, padding: 15, marginTop: 20 },
  advertenciaTitle: { fontFamily: tipografia.bold, fontSize: 16, marginBottom: 5, color: colores.text },
  advertenciaTexto: { fontSize: 14 }
});

export default PantallaDetalleTema;