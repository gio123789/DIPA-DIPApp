// componentes/compartidos/ModelViewerWeb.js
import React, { useCallback, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

// Componente que carga un .glb/.gltf/GLB vía URL usando <model-viewer> en una WebView.
// Props:
// - modelUrl: URL pública del archivo .glb/.gltf
// - autoRotate: boolean (opcional)
// - cameraControls: boolean (opcional)

const ModelViewerWeb = ({ modelUrl, autoRotate = true, cameraControls = true, style, debug = false }) => {
  const [webError, setWebError] = useState(null);
  const [status, setStatus] = useState('cargando');
  const [progress, setProgress] = useState(null);
  if (!modelUrl) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.center}>
          <Text style={styles.text}>No se proporcionó URL del modelo</Text>
        </View>
      </SafeAreaView>
    );
  }

  // HTML que se inyecta en la WebView. model-viewer se carga desde un CDN.
  const injectedHTML = `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
      <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
      <style>
        html, body { margin:0; height:100%; background:transparent; }
        model-viewer { width:100%; height:100%; }
        #dbg { position:absolute; left:8px; bottom:8px; right:8px; color:#fff; background:rgba(0,0,0,.45); font:12px/1.3 -apple-system, system-ui, Segoe UI, Roboto; padding:6px 8px; border-radius:6px; display:none; }
      </style>
    </head>
    <body>
      <model-viewer id="m"
        src="${modelUrl}"
        alt="3D model"
        background-color="#ffffff"
        ${autoRotate ? 'auto-rotate' : ''}
        ${cameraControls ? 'camera-controls' : ''}
        exposure="1"
        shadow-intensity="1"
        crossorigin="anonymous"
      ></model-viewer>
      <pre id="dbg"></pre>

      <script>
        const rn = window.ReactNativeWebView;
        const m = document.getElementById('m');
        const dbg = document.getElementById('dbg');
        function post(type, payload) {
          try { rn.postMessage(JSON.stringify({ type, payload })); } catch (e) {}
        }
        function debugLog(msg){
          try { if (${debug ? 'true' : 'false'}) { dbg.style.display='block'; dbg.textContent = String(msg).slice(0, 1000); } } catch(e){}
        }
        // Capturar errores de la página
        window.addEventListener('error', (e)=>{ post('error', e.message || 'window.error'); debugLog(e.message); });
        window.addEventListener('unhandledrejection', (e)=>{ post('error', e.reason ? String(e.reason) : 'unhandledrejection'); debugLog(e.reason); });
        // Proxy de console.error para enviar a RN
        const _cerr = console.error.bind(console);
        console.error = function(){ try{ post('consoleError', Array.from(arguments).map(String).join(' ')); debugLog(Array.from(arguments).map(String).join(' ')); }catch(e){}; _cerr.apply(console, arguments); };
        m.addEventListener('load', () => post('load', true));
        m.addEventListener('error', (e) => { post('error', String(e?.detail || 'error')); debugLog(e?.detail || 'model-viewer error'); });
        m.addEventListener('progress', (e) => { post('progress', e.detail?.totalProgress ?? null); });
        // Timeout si no carga
        setTimeout(()=>{ if(!m.loaded) { post('timeout', 'no-load-10s'); debugLog('Timeout: el modelo no respondió en 10s'); } }, 10000);
      </script>
    </body>
  </html>
  `;

  // Derivar origen de la URL del modelo para usarlo como baseUrl y evitar CORS
  let baseUrl = undefined;
  try {
    const url = new URL(modelUrl);
    baseUrl = `${url.protocol}//${url.host}`;
  } catch (e) {}

  return (
    <SafeAreaView style={[styles.container, style]}>
      {!!webError && (
        <View style={[styles.center, { padding: 12 }]}>
          <Text style={[styles.text, { color: '#e53935' }]}>Error al cargar modelo: {webError}</Text>
          <Text style={styles.text}>Verifica CORS en el servidor o la URL del GLB.</Text>
        </View>
      )}
      <WebView
        originWhitelist={["*"]}
        source={{ html: injectedHTML, baseUrl }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#202A64" />
            {progress != null && <Text style={styles.text}>Cargando modelo… {Math.round(progress*100)}%</Text>}
          </View>
        )}
        onMessage={(event) => {
          try {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg.type === 'error') setWebError(msg.payload);
            if (msg.type === 'load') setStatus('listo');
            if (msg.type === 'progress' && typeof msg.payload === 'number') setProgress(msg.payload);
            if (msg.type === 'timeout' && status !== 'listo') setWebError('Tiempo de espera agotado');
          } catch (e) {}
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setWebError(nativeEvent?.description || 'Error desconocido en WebView');
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setWebError(`HTTP ${nativeEvent.statusCode}: ${nativeEvent.description || 'Error de red'}`);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#5F6B7A' },
});

export default ModelViewerWeb;
