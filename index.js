import express from 'express';
import suscriptionRoutes from './routes/suscriptionRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js'
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

connectDB()

const app = express();

// Configuración de CORS
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || dominiosPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};

app.use(cors(corsOptions));

// Middleware para manejar las solicitudes POST
app.use(express.json());

//Rutas
app.use('/api/suscription', suscriptionRoutes);
app.use('/api/clientes', clienteRoutes)

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})

