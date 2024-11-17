import fs from 'fs';
import path from 'path';

// Obtener el __dirname usando import.meta.url
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo productos.json
const productosPath = path.join(__dirname, '../data/productos.json');

export default class ProductManager {
    #jsonFilename;
 
    constructor() {
        this.#jsonFilename = "productos.json";
    }
    
    // Método para leer los productos
    async readProducts() {
        try {
            const data = await fs.promises.readFile(productosPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('Error al leer productos');
        }
    }

    // Método para escribir los productos
    async writeProducts(productos) {
        try {
            await fs.promises.writeFile(productosPath, JSON.stringify(productos, null, 2), 'utf8');
        } catch (err) {
            throw new Error('Error al escribir productos');
        }
    }

    // Método para obtener un producto por su id
    async getProductById(pid) {
        try {
            // Lee el archivo de productos
            const productos = await this.readProducts();
            // Busca el producto por ID
            const producto = productos.find(p => p.id === pid);
            
            // Si no se encuentra el producto, lanza un error
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
        } catch (err) {
            throw new Error(`Error al obtener el producto: ${err.message}`);
        }
    }

    // Método para agregar un nuevo producto
    async addProduct(productData) {
        const productos = await this.readProducts();
        const newId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1; // Generar un id único
        const newProduct = { id: newId, ...productData };
        productos.push(newProduct);
        await this.writeProducts(productos);
        return newProduct;
    }

    // Método para actualizar un producto
    async updateProduct(id, updatedData) {
        const productos = await this.readProducts();
        const productIndex = productos.findIndex(p => p.id === id);
        if (productIndex === -1) return null; // Producto no encontrado

        // No se debe actualizar el id, solo los otros campos
        productos[productIndex] = { ...productos[productIndex], ...updatedData };
        await this.writeProducts(productos);
        return productos[productIndex];
    }

    // Método para eliminar un producto
    async deleteProduct(id) {
        const productos = await this.readProducts();
        const updatedProductos = productos.filter(p => p.id !== id);
        await this.writeProducts(updatedProductos);
        return true;
    }
}
