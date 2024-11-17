import express from 'express';
import ProductManager from '../manager/productManager.js';
const router = express.Router();
const productManager = new ProductManager();

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await productManager.readProducts();
        if (!productos || productos.length === 0) {
            return res.status(404).send('No se encontraron productos en la base de datos');
        }
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor al obtener los productos');
    }
});

// Ruta para obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
 
        const producto = await productManager.getProductById(pid.toString());
        if (!producto) {
            return res.status(404).send(`Producto con ID ${pid} no encontrado`);
        }
        res.json(producto);
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${pid}:`, error);
        res.status(500).send('Error interno del servidor al obtener el producto');
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        
        if (!productData || Object.keys(productData).length === 0) {
            return res.status(400).json({
                error: 'Datos incompletos para crear el producto',
                message: 'Se requieren datos para crear un producto. Por favor, incluya los campos necesarios.'
            });
        }

        if (!productData.name || !productData.price) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'El producto debe incluir al menos el nombre y el precio.'
            });
        }

        const nuevoProducto = await productManager.addProduct(productData);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'Hubo un problema al crear el producto. Por favor, intente nuevamente más tarde.'
        });
    }
});
// Ruta para actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    try {
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).send('Datos incompletos para actualizar el producto');
        }

        const productoActualizado = await productManager.updateProduct(parseInt(pid), updatedData);
        if (!productoActualizado) {
            return res.status(404).send(`Producto con ID ${pid} no encontrado`);
        }
        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${pid}:`, error);
        res.status(500).send('Error interno del servidor al actualizar el producto');
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const deleted = await productManager.deleteProduct(parseInt(pid));
        if (!deleted) {
            return res.status(404).send(`Producto con ID ${pid} no encontrado`);
        }
        res.status(200).send(`Producto con ID ${pid} eliminado exitosamente`);
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${pid}:`, error);
        res.status(500).send('Error interno del servidor al eliminar el producto');
    }
});

export default router;
