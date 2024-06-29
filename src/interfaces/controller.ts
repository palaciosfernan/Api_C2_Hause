import { Request, Response } from 'express';
import { UserService } from '../application/userService';
import { UserRepositoryImpl } from '../domain/userRepository';
import jwt from 'jsonwebtoken';
import { query } from '../adapters/mysqlAdapter';
import { io } from './server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { User } from '../domain/userModel';

const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'palaciosfercho72@gmail.com',
    pass: 'uizg uuvj qzex gawg'
  }
});

async function sendEmail(user: User) {
  const mailOptions = {
    from: '"Alert : " <231176@ids.upchiapas.edu.mx>',
    to: '231176@ids.upchiapas.edu.mx',
    subject: 'Inicio de sesión exitoso',
    text: `Hola ${user.username}, has iniciado sesión en tu panel de control.`
  };
  console.log('Correo enviado')
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

async function sendTextMessage(user: User) {
  if (user.phoneNumber) {
    const client = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
    client.messages.create({
      body: `Hola ${user.username}, has iniciado sesión en tu panel de control.`,
      to: user.phoneNumber,
      from: '9616382275'
    }).then(message => console.log(message.sid)).catch(error => console.log(error));
  }
}

export async function register(req: Request, res: Response) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await userService.loginUser(req.body.username, req.body.password);
    if (!user.id) {
      throw new Error('User ID is missing');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

    await sendEmail(user);
    await sendTextMessage(user);
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function logEvent(req: Request, res: Response) {
  const { event_type } = req.body;

  try {
    await query('INSERT INTO events (event_type) VALUES (?)', [event_type]);
    io.emit('new_event', { event_type, created_at: new Date().toISOString() });
    res.status(201).json({ message: 'Evento creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el evento', error: (error as Error).message });
  }
}

export async function getEvents(req: Request, res: Response) {
  try {
    const events = await query('SELECT * FROM events ORDER BY created_at DESC');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events', error: (error as Error).message });
  }
}
