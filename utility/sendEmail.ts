import { Order } from './../types/types';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Function to send an email using Nodemailer

export async function sendEmail(order: Order) {
  const { name, phone, email, duration, price, services, appointment } = order;
  console.log("Preparing to send email for order:", order);
  // Use appointment data
  if (!appointment) {
    throw new Error("Appointment is undefined.");
  }
  const { date, startTime } = appointment;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASS, // your app password or SMTP password
    },
  });
  
  const datum = new Date(date);
  const formattedDate = datum.toLocaleDateString('sl-SI', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replaceAll(' ','');

  const mailToClient = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Potrditev termina",
  html: `
    Pozdravljeni,<br><br>
    Zahvaljujemo se vam za vašo rezervacijo termina na dan <b>${formattedDate}</b> ob <b>${startTime} uri</b>.<br><br>
    <b>Trajanje:</b> ${duration} minut<br>
    <b>Storitev:</b> ${(services?.map(service => service.serviceName).join(', ')) || ''}<br>
    <b>Cena:</b> €${price}<br>
    <b>Lokacija:</b> <a href="https://maps.app.goo.gl/ip2rtBSkh8jA225v8">Unique Beauty Studio, Jesenova ulica 31, 1230 Domžale</a><br><br>
    Veselimo se vašega obiska!<br><br>
    <b>Za odpoved ali spremembo termina</b> me prosim pravočasno obvestite na tel: <a href='tel:+38670654560'>070 654 560</a>.<br><br>
    Lep pozdrav,<br>
    Unique Beauty Studio
  `
};

  const mailToAdmin = {
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_USER, // admin email
    subject: "Nova rezervacija termina",
    html: "Nova rezervacija termina je bila ustvarjena.<br><br>" +
          `<b>Stranka:</b> ${name}<br>` +
          `<b>Telefon:</b> ${phone}<br>` + 
          `<b>Email:</b> ${email}<br>` +
          `<b>Datum:</b> ${formattedDate}<br>` +
          `<b>Čas začetka:</b> ${startTime}<br>` +
          `<b>Trajanje:</b> ${duration} minut<br>` +
          `<b>Storitev:</b> ${(services?.map(service => service.serviceName).join(', ')) || ''}<br>` +
          `<b>Cena:</b> €${price}<br><br>`,
  };

  return transporter.sendMail(mailToClient)
    .then(() => {
      console.log('Email sent to client');
      return transporter.sendMail(mailToAdmin);
    })
    .then(() => {
      console.log('Email sent to admin');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      throw error; // Re-throw the error for further handling if needed
  });
}