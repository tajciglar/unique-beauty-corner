import twilio from "twilio";

interface SmsPayload {
  to: string;
  name: string;
  date: string;
  startTime: string;
  duration: number;
  price: number;
  services: Array<{ serviceName: string }>;
}

const getClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are missing");
  }
  return twilio(accountSid, authToken);
};

export async function sendSms(payload: SmsPayload) {
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!from) {
    throw new Error("Twilio sender number is missing");
  }

  const { to, name, date, startTime, duration, price, services } = payload;
  const serviceList = services.map((s) => s.serviceName).join(", ");

  const message =
    `Potrditev termina - Unique Beauty Studio\n` +
    `Ime: ${name}\n` +
    `Datum: ${date} ob ${startTime}\n` +
    `Trajanje: ${duration} min\n` +
    `Storitev: ${serviceList}\n` +
    `Cena: €${price}`;

  const client = getClient();
  return client.messages.create({
    to,
    from,
    body: message,
  });
}
