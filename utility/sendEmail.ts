import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Simple, flat interface for what we actually need
interface EmailPayload {
  name: string;
  phone: string;
  email: string;
  duration: number;
  price: number;
  services: Array<{ serviceName: string }>;
  date: Date | string;
  startTime: string;
}

export async function sendEmail(payload: EmailPayload) {
  const { name, phone, email, duration, price, services, date, startTime } = payload;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const datum = new Date(date);
  const formattedDate = datum.toLocaleDateString('sl-SI', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replaceAll(' ', '');

  const servicesList = services.map(s => s.serviceName).join(', ');

  const mailToClient = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Potrditev termina",
    html: `
      Pozdravljeni,<br><br>
      Zahvaljujemo se vam za vašo rezervacijo termina na dan <b>${formattedDate}</b> ob <b>${startTime} uri</b>.<br><br>
      <b>Trajanje:</b> ${duration} minut<br>
      <b>Storitev:</b> ${servicesList}<br>
      <b>Cena:</b> €${price}<br>
      <b>Lokacija:</b> <a href="https://maps.app.goo.gl/ip2rtBSkh8jA225v8">Unique Beauty Studio, Jesenova ulica 31, 1230 Domžale</a><br><br>
      Veselimo se vašega obiska!<br><br>
      <b>Za odpoved ali spremembo termina</b> me prosim pravočasno obvestite na tel: <a href='tel:+38670654560'>070 654 560</a>.<br><br>
      Lep pozdrav,<br>
      Unique Beauty Studio
    `
  };

  const mailToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Nova rezervacija termina",
    html: "Nova rezervacija termina je bila ustvarjena.<br><br>" +
      `<b>Stranka:</b> ${name}<br>` +
      `<b>Telefon:</b> ${phone}<br>` +
      `<b>Email:</b> ${email}<br>` +
      `<b>Datum:</b> ${formattedDate}<br>` +
      `<b>Čas začetka:</b> ${startTime}<br>` +
      `<b>Trajanje:</b> ${duration} minut<br>` +
      `<b>Storitev:</b> ${servicesList}<br>` +
      `<b>Cena:</b> €${price}<br><br>`,
  };

  await transporter.sendMail(mailToClient);
  console.log('Email sent to client');
  
  await transporter.sendMail(mailToAdmin);
  console.log('Email sent to admin');
}