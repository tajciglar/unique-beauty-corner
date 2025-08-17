import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { changeDate, formatTime } from '../utility/changeDate.js';

dotenv.config();

export async function sendEmail(
    name: string,
    phone: string,
    email: string,
    date: string,
    startTime: string,
    duration: number,
    services: { name: string }[],
    price: number
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASS, // your app password
    },
  });

  const formattedDate = changeDate(date); // format date as DD-MM-YYYY
  const formattedStartTime = formatTime(startTime); // optional formatting

  const mailToClient = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Potrditev termina",
    html: `
      Pozdravljeni,<br><br>
      zahvaljujemo se vam za vašo rezervacijo termina na dan ${formattedDate} ob ${formattedStartTime}.<br><br>
      Trajanje: ${duration} minut<br>
      Storitev: ${services.map(service => service.name).join(', ')}<br>
      Veselimo se vašega obiska!<br><br>
      Lep pozdrav,<br>
      Unique Beauty Studio
    `
  };

  const mailToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Nova rezervacija termina",
    html: `
      Nova rezervacija termina je bila ustvarjena.<br><br>
      Datum: ${formattedDate}<br>
      Čas začetka: ${formattedStartTime}<br>
      Trajanje: ${duration} minut<br>
      Storitev: ${services.map(service => service.name).join(', ')}<br>
      Cena: €${price.toFixed(2)}<br><br>
    `
  };

  try {
    await transporter.sendMail(mailToClient);
    console.log('Email sent to client');

    await transporter.sendMail(mailToAdmin);
    console.log('Email sent to admin');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}