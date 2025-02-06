require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Jugador = require('./models/Jugador');
const morgan = require('morgan');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware de Morgan para registrar solicitudes HTTP
app.use(morgan('dev'));

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));


    app.get('/formulario', (req, res) => {
        res.send(`
            <h1>Agregar Jugador</h1>
            <form action="/jugadores" method="POST">
                <label>Nombre: <input type="text" name="nombre"></label><br>
                <label>Equipo: <input type="text" name="equipo"></label><br>
                <label>Posición: <input type="text" name="posición"></label><br>
                <label>Número: <input type="number" name="número"></label><br>
                <label>Nacionalidad: <input type="text" name="nacionalidad"></label><br>
                <label>Edad: <input type="number" name="edad"></label><br>
                <label>Altura: <input type="text" name="altura"></label><br>
                <label>Peso: <input type="text" name="peso"></label><br>
                <label>Goles: <input type="number" name="goles"></label><br>
                <label>Asistencias: <input type="number" name="asistencias"></label><br>
                <label>Partidos Jugados: <input type="number" name="partidos_jugados"></label><br>
                <label>Tarjetas Amarillas: <input type="number" name="tarjetas_amarillas"></label><br>
                <label>Tarjetas Rojas: <input type="number" name="tarjetas_rojas"></label><br>
                <button type="submit">Agregar</button>
            </form>
        `);
    });


    // 🔹 Ruta `POST` para recibir datos y guardar en MongoDB
app.post('/jugadores', async (req, res) => {
    try {
        const nuevoJugador = new Jugador(req.body);
        await nuevoJugador.save();
        res.send(`<h2>Jugador agregado correctamente:</h2>
                  <pre>${JSON.stringify(nuevoJugador, null, 2)}</pre>
                  <a href="/formulario">Agregar otro jugador</a>`);
    } catch (error) {
        res.status(400).send(`<h2>Error al agregar el jugador</h2><pre>${error}</pre>`);
    }
});

// 🔹 Ruta `DELETE` para eliminar un jugador por ID

// 🔹 Formulario para eliminar jugadores desde el navegador
app.get('/eliminar-jugador', (req, res) => {
    res.send(`
        <h1>Eliminar Jugador</h1>
        <form action="/jugadores" method="POST" onsubmit="event.preventDefault(); eliminarJugador();">
            <label>ID del Jugador: <input type="text" id="jugadorId" required></label>
            <button type="submit">Eliminar</button>
        </form>
        <script>
            async function eliminarJugador() {
                const id = document.getElementById('jugadorId').value;
                const response = await fetch('/jugadores/' + id, { method: 'DELETE' });
                const result = await response.text();
                document.body.innerHTML += '<pre>' + result + '</pre>';
            }
        </script>
    `);
});




// Obtener todos los jugadores
app.get('/jugadores', async (req, res) => {
    const jugadores = await Jugador.find();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jugadores, null, 2));
});

// Encontrar jugadores de un equipo específico
app.get('/jugadores/equipo/:equipo', async (req, res) => {
    const jugadores = await Jugador.find({ equipo: req.params.equipo });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jugadores, null, 2));
});

// Filtrar jugadores con más de 10 goles
app.get('/jugadores/goles/mayores-10', async (req, res) => {
    const jugadores = await Jugador.find({ goles: { $gt: 10 } });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jugadores, null, 2));
});

// Mostrar jugadores con al menos 3 tarjetas amarillas
app.get('/jugadores/tarjetas-amarillas/3', async (req, res) => {
    const jugadores = await Jugador.find({ tarjetas_amarillas: { $gte: 3 } });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jugadores, null, 2));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
