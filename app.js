const express = require('express');
const fs = require('fs-extra');

const app = express();
const PORT = 3000;

app.use(express.json());

//Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
    try {
        const productos = fs.readJSONSync('productos.json');
        res.json(productos);
    } catch (err) {
        console.error('Error al leer los productos:', err);
        res.status(500).send('Error interno del servidor');
    }
});

//Ruta para agregar un nuevo producto al inventario
app.post('/productos', (req, res) => {
    try {
        const { nombre, descripcion, cantidad } = req.body;
        if (!nombre || !descripcion || !cantidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Leer los productos existentes del archivo JSON
        const productos = fs.readJSONSync('productos.json');

        //Crear un nuevo objeto de producto
        const nuevoProducto = {
            id: productos.length + 1,
            nombre,
            descripcion,
            cantidad
        };

        //Agregar el nuevo producto al array de productos
        productos.push(nuevoProducto);

        //Escribir los productos actualizados de vuelta al archivo JSON
        fs.writeJSONSync('productos.json', productos);

        //Devolver el nuevo producto creado
        res.status(201).json(nuevoProducto);
    } catch (err) {
        console.error('Error al agregar el producto:', err);
        res.status(500).send('Error interno del servidor');
    }
});

//Ruta para actualizar un producto existente en el inventario
app.put('/productos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, descripcion, cantidad } = req.body;
        if (!nombre || !descripcion || !cantidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        //Leer los productos existentes del archivo JSON
        const productos = fs.readJSONSync('productos.json');

        //Buscar el producto por ID
        const productoExistente = productos.find(producto => producto.id === id);
        if (!productoExistente) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        //Actualizar el producto
        productoExistente.nombre = nombre;
        productoExistente.descripcion = descripcion;
        productoExistente.cantidad = cantidad;

        //Escribir los productos actualizados de vuelta al archivo JSON
        fs.writeJSONSync('productos.json', productos);

        //Devolver el producto actualizado
        res.json(productoExistente);
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).send('Error interno del servidor');
    }
});

//Ruta para eliminar un producto del inventario
app.delete('/productos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        //Leer los productos existentes del archivo JSON
        let productos = fs.readJSONSync('productos.json');

        //Filtrar los productos para excluir el producto a eliminar
        productos = productos.filter(producto => producto.id !== id);

        //Escribir los productos actualizados de vuelta al archivo JSON
        fs.writeJSONSync('productos.json', productos);

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).send('Error interno del servidor');
    }
});

//Ruta para buscar un producto por nombre
app.get('/productos/buscar', (req, res) => {
    try {
        const nombreBusqueda = req.query.nombre;

        //Leer los productos existentes del archivo JSON
        const productos = fs.readJSONSync('productos.json');

        //Filtrar los productos por nombre de producto
        const productosEncontrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
        );

        //Devolver los productos encontrados como respuesta
        res.json(productosEncontrados);
    } catch (err) {
        console.error('Error al buscar productos:', err);
        res.status(500).send('Error interno del servidor');
    }
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});

