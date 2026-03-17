import {
  ICS_TIMEZONE,
  addMinutes,
  escapeIcsText,
  formatIcsDate,
  formatUtcStamp,
  parseAppointmentDateTime,
} from "@utility/ical";

interface AppointmentIcsInput {
  orderId: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  duration?: number | null;
  price?: number | null;
  services: Array<{ serviceName: string }>;
}

const LOCATION = "Unique Beauty Studio, Jesenova ulica 31, 1230 Domžale";

export const buildAppointmentIcs = (input: AppointmentIcsInput) => {
  const start = parseAppointmentDateTime(input.date, input.startTime);
  if (!start) return null;

  const end =
    (input.endTime
      ? parseAppointmentDateTime(input.date, input.endTime)
      : null) ||
    (input.duration ? addMinutes(start, input.duration) : null);
  if (!end) return null;

  const servicesList = input.services.map((s) => s.serviceName).join(", ");
  const summary = escapeIcsText("Potrditev termina");

  const descriptionParts = [
    input.name ? `Stranka: ${input.name}` : null,
    input.phone ? `Telefon: ${input.phone}` : null,
    input.email ? `Email: ${input.email}` : null,
    input.duration ? `Trajanje: ${input.duration} min` : null,
    input.price != null ? `Cena: €${input.price}` : null,
    servicesList ? `Storitve: ${servicesList}` : null,
  ].filter(Boolean);

  const description = escapeIcsText(descriptionParts.join("\n"));

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Unique Beauty Corner//Client Appointment//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-TIMEZONE:${ICS_TIMEZONE}`,
    "BEGIN:VEVENT",
    `UID:order-${input.orderId}@unique-beauty-corner`,
    `DTSTAMP:${formatUtcStamp()}`,
    `DTSTART;TZID=${ICS_TIMEZONE}:${formatIcsDate(start)}`,
    `DTEND;TZID=${ICS_TIMEZONE}:${formatIcsDate(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${escapeIcsText(LOCATION)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return calendar;
};
