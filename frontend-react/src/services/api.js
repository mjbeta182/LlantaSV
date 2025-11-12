const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProductos() {
  try {
    const response = await fetch(`${API_URL}/api/productos`);
    if (!response.ok) throw new Error("Error al obtener productos");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}