import express from 'express';
import fs from 'fs/promises';  // Uso de fs.promises para manejar asíncrono
import routerproducts from './router/productRouter.js';
import routercart from './router/cartRouter.js';

const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
// Middleware para procesar el cuerpo de las peticiones
app.use(express.json());


// Rutas para manejar productos y carritos
app.use('/api/products', routerproducts);
app.use('/api/carts', routercart);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
