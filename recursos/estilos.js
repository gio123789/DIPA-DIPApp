// recursos/estilos.js
// Tipografía y estilos base (cambie fontFamily cuando definamos la fuente de la maqueta)

export const tipografia = {
	// Al instalar Poppins: 'Poppins_400Regular' y 'Poppins_700Bold'
	regular: 'Poppins_400Regular',
	bold: 'Poppins_700Bold',
	sizes: {
		h1: 28,
		h2: 22,
		body: 16,
		small: 13,
	},
};

export const radios = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	pill: 999,
};

export const sombras = {
	card: {
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
};

export default {
	tipografia,
	radios,
	sombras,
};

 