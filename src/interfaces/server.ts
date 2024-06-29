// server.js
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { register, login, logEvent, getEvents } from './controller'; // Importar controladores
import { authGuard } from '../application/authGuard'; // Importar el middleware de autenticación

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

app.use(cors()); 
app.use(express.json()); 


app.post('/api/register', register); 
app.post('/api/login', login); 
app.post('/api/events', authGuard, logEvent); 
app.get('/api/events', authGuard, getEvents);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Iniciar el servidor
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export { io }; 
