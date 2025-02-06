const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
    nombre: String,
    equipo: String,
    posición: String,
    número: Number,
    nacionalidad: String,
    edad: Number,
    altura: String,
    peso: String,
    goles: Number,
    asistencias: Number,
    partidos_jugados: Number,
    tarjetas_amarillas: Number,
    tarjetas_rojas: Number
}, { collection: 'jugadores' }); 

module.exports = mongoose.model('Jugador', jugadorSchema);
