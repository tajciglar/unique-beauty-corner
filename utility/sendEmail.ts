import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

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
  calendarAttachment?: {
    filename: string;
    content: string;
  };
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(payload: EmailPayload) {
  const { name, phone, email, duration, price, services, date, startTime, calendarAttachment } = payload;

  const datum = new Date(date);
  const formattedDate = datum.toLocaleDateString('sl-SI', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replaceAll(' ', '');

  const servicesList = services.map(s => escapeHtml(s.serviceName)).join(', ');
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeStartTime = escapeHtml(startTime);

  const mailToClient = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Potrditev termina",
    html: `
      Pozdravljeni,<br><br>
      Zahvaljujemo se vam za vašo rezervacijo termina na dan <b>${formattedDate}</b> ob <b>${safeStartTime} uri</b>.<br><br>
      <b>Trajanje:</b> ${duration} minut<br>
      <b>Storitev:</b> ${servicesList}<br>
      <b>Cena:</b> €${price}<br>
      <b>Lokacija:</b> <a href="https://maps.app.goo.gl/ip2rtBSkh8jA225v8">Unique Beauty Studio, Jesenova ulica 31, 1230 Domžale</a><br><br>
      Veselimo se vašega obiska!<br><br>
      <b>Za odpoved ali spremembo termina</b> me prosim pravočasno obvestite na tel: <a href='tel:+38670654560'>070 654 560</a>.<br><br>
      Lep pozdrav,<br>
      Unique Beauty Studio
    `,
    attachments: calendarAttachment
      ? [
          {
            filename: calendarAttachment.filename,
            content: calendarAttachment.content,
            contentType: "text/calendar; charset=utf-8",
          },
        ]
      : [],
  };

  const mailToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Nova rezervacija termina",
    html: "Nova rezervacija termina je bila ustvarjena.<br><br>" +
      `<b>Stranka:</b> ${safeName}<br>` +
      `<b>Telefon:</b> ${safePhone}<br>` +
      `<b>Email:</b> ${safeEmail}<br>` +
      `<b>Datum:</b> ${formattedDate}<br>` +
      `<b>Čas začetka:</b> ${safeStartTime}<br>` +
      `<b>Trajanje:</b> ${duration} minut<br>` +
      `<b>Storitev:</b> ${servicesList}<br>` +
      `<b>Cena:</b> €${price}<br><br>`,
  };

  await transporter.sendMail(mailToClient);
  console.log('Email sent to client');
  
  await transporter.sendMail(mailToAdmin);
  console.log('Email sent to admin');
}
