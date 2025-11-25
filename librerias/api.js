const BASE_URL = "https://cudipa.mx/vida-cudipa/wp-json/wp/v2";

// Función para obtener todas las academias
export const getAcademias = async () => {
  try {
    const response = await fetch(`${BASE_URL}/academia?_embed`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getAcademias:", error);
    return [];
  }
};

// Función para obtener las materias de UNA academia específica
// Soporta relación 1-1 (objeto) y muchos-a-muchos (array) en ACF (academia_principal)
export const getMateriasPorAcademia = async (academiaId) => {
  try {
    // Traemos un lote amplio y filtramos del lado del cliente para soportar Relationship multiple
    // Nota: si superas 100 materias, considera paginar o incrementar per_page.
    const response = await fetch(`${BASE_URL}/materias?_fields=id,title,acf&per_page=100`);
    const data = await response.json();

    const idStr = String(academiaId);
    const perteneceA = (valor) => {
      if (valor == null) return false;
      // Si viene como número o string directo
      if (typeof valor === 'number' || typeof valor === 'string') {
        return String(valor) === idStr;
      }
      // Si viene como objeto { ID, post_title } o { id }
      if (typeof valor === 'object') {
        const posible = valor.ID ?? valor.id;
        return posible != null && String(posible) === idStr;
      }
      return false;
    };

    const filtradas = (data || []).filter((materia) => {
      const ap = materia?.acf?.academia_principal;
      if (!ap) return false;
      if (Array.isArray(ap)) {
        return ap.some(perteneceA);
      }
      return perteneceA(ap);
    });

    return filtradas;
  } catch (error) {
    console.error("Error en getMateriasPorAcademia:", error);
    return [];
  }
};

// Función para obtener los temas de UNA materia específica
// Filtramos del lado del cliente para evitar problemas con meta_query en WordPress
export const getTemasPorMateria = async (materiaId) => {
  try {
    console.log('🔍 Buscando temas para materia ID:', materiaId);
    const response = await fetch(`${BASE_URL}/temas?_fields=id,title,acf&per_page=100`);
    
    if (!response.ok) {
      console.error(`Error HTTP en getTemasPorMateria: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    console.log('📚 Total de temas recibidos:', data.length);
    
    // Mostrar un ejemplo de los primeros temas para debug
    if (data.length > 0) {
      console.log('📝 Ejemplo tema 0:', JSON.stringify(data[0], null, 2));
      console.log('🔗 Campo materia_relacionada del tema 0:', data[0]?.acf?.materia_relacionada);
    }
    
    // Filtrar temas que pertenecen a esta materia
    const idStr = String(materiaId);
    const perteneceA = (valor) => {
      if (valor == null) return false;
      // Si viene como número o string directo
      if (typeof valor === 'number' || typeof valor === 'string') {
        return String(valor) === idStr;
      }
      // Si viene como objeto { ID, post_title } o { id }
      if (typeof valor === 'object') {
        const posible = valor.ID ?? valor.id;
        return posible != null && String(posible) === idStr;
      }
      return false;
    };

    const filtrados = (data || []).filter((tema) => {
      const mr = tema?.acf?.materia_relacionada;
      if (!mr) return false;
      if (Array.isArray(mr)) {
        return mr.some(perteneceA);
      }
      return perteneceA(mr);
    });

    console.log('✅ Temas filtrados para materia', materiaId, ':', filtrados.length);
    return filtrados;
  } catch (error) {
    console.error("Error en getTemasPorMateria:", error);
    return [];
  }
};

// Función para obtener el detalle de UN tema específico
export const getTemaDetalle = async (temaId) => {
  try {
    // Traemos tanto el contenido HTML como los campos ACF
    const response = await fetch(`${BASE_URL}/temas/${temaId}?_fields=id,title,content,acf`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getTemaDetalle:", error);
    return null;
  }
};

// Función para obtener las imágenes de la galería por sus IDs
export const getImagenesPorIds = async (ids) => {
  try {
    if (!ids || ids.length === 0) return [];
    // 1. Añadimos '_fields=acf' para que la respuesta sea más ligera.
    const response = await fetch(`${BASE_URL}/imagen_galeria?include=${ids.join(',')}&_fields=acf`);
    const data = await response.json();
    // 2. Devolvemos solo la URL de la imagen, que es lo que la app necesita.
    return data.map(img => img.acf.archivo_imagen);
  } catch (error) {
    console.error("Error en getImagenesPorIds:", error);
    return [];
  }
};

// Función para buscar en academias y temas por coincidencia de texto
export const buscarContenido = async (textoBusqueda) => {
  try {
    if (!textoBusqueda || textoBusqueda.length < 3) {
      return [];
    }

    const textoLower = textoBusqueda.toLowerCase();
    
    // Buscar en paralelo en academias y temas (sin materias)
    const [academias, temas] = await Promise.all([
      fetch(`${BASE_URL}/academia?search=${encodeURIComponent(textoBusqueda)}&_fields=id,title,type`).then(r => r.json()),
      fetch(`${BASE_URL}/temas?search=${encodeURIComponent(textoBusqueda)}&_fields=id,title,type,acf`).then(r => r.json())
    ]);

    // Formatear resultados con tipo y relevancia
    const resultados = [
      ...(academias || []).map(item => ({
        id: item.id,
        title: item.title.rendered || item.title,
        tipo: 'academia',
        tipoLabel: 'Academia',
        data: item
      })),
      ...(temas || []).map(item => ({
        id: item.id,
        title: item.title.rendered || item.title,
        tipo: 'tema',
        tipoLabel: 'Tema',
        data: item
      }))
    ];

    // Filtrar por coincidencia de texto (búsqueda adicional del lado del cliente)
    return resultados.filter(item => 
      item.title.toLowerCase().includes(textoLower)
    );

  } catch (error) {
    console.error("Error en buscarContenido:", error);
    return [];
  }
};