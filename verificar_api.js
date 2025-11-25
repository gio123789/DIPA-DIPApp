// Script para verificar la respuesta de la API de WordPress
const BASE_URL = "https://cudipa.mx/vida-cudipa/wp-json/wp/v2";

async function verificarAcademias() {
  console.log('=== VERIFICANDO ACADEMIAS ===\n');
  
  try {
    const response = await fetch(`${BASE_URL}/academia?_embed`);
    const academias = await response.json();
    
    console.log(`Total de academias: ${academias.length}\n`);
    
    academias.forEach((academia, index) => {
      console.log(`\n--- ACADEMIA ${index + 1}: ${academia.title.rendered} ---`);
      console.log(`ID: ${academia.id}`);
      console.log(`Slug: ${academia.slug}`);
      console.log(`Featured Media ID: ${academia.featured_media}`);
      
      // Verificar ACF
      console.log('\nCampos ACF:');
      if (academia.acf) {
        console.log(JSON.stringify(academia.acf, null, 2));
      } else {
        console.log('  ❌ No hay campos ACF');
      }
      
      // Verificar excerpt
      console.log('\nExcerpt:');
      if (academia.excerpt && academia.excerpt.rendered) {
        console.log(`  ${academia.excerpt.rendered.substring(0, 100)}...`);
      } else {
        console.log('  ❌ No hay excerpt');
      }
      
      // Verificar content
      console.log('\nContent:');
      if (academia.content && academia.content.rendered) {
        const content = academia.content.rendered.replace(/<[^>]*>/g, '').trim();
        if (content) {
          console.log(`  ${content.substring(0, 100)}...`);
        } else {
          console.log('  ❌ Content vacío');
        }
      } else {
        console.log('  ❌ No hay content');
      }
      
      // Verificar imagen destacada
      console.log('\nImagen destacada:');
      if (academia._embedded && academia._embedded['wp:featuredmedia']) {
        const media = academia._embedded['wp:featuredmedia'][0];
        console.log(`  ✅ ${media.source_url}`);
      } else {
        console.log('  ❌ No hay imagen destacada');
      }
      
      console.log('\n' + '='.repeat(60));
    });
    
    console.log('\n\n=== RECOMENDACIONES ===');
    console.log('Para que aparezcan las descripciones e imágenes:');
    console.log('1. Ve al editor de cada Academia en WordPress');
    console.log('2. Llena el campo ACF "descripcion_academia"');
    console.log('3. Sube una imagen en el campo ACF "imagen_academia"');
    console.log('4. O configura una "Imagen destacada" (Featured Image)');
    console.log('5. Guarda los cambios');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verificarAcademias();
