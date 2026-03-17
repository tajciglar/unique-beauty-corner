const DEFAULT_TZ = "Europe/Ljubljana";

export const ICS_TIMEZONE = DEFAULT_TZ;

const pad = (value: number) => String(value).padStart(2, "0");

export const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

export const formatUtcStamp = (date: Date = new Date()) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

export const formatIcsDate = (date: Date, timeZone: string = DEFAULT_TZ) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const lookup = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return (
    lookup("year") +
    lookup("month") +
    lookup("day") +
    "T" +
    lookup("hour") +
    lookup("minute") +
    lookup("second")
  );
};

export const parseAppointmentDateTime = (
  dateValue: string | null | undefined,
  timeValue: string | null | undefined
) => {
  if (timeValue && timeValue.includes("T")) {
    const parsed = new Date(timeValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (!dateValue) return null;

  const time = (timeValue || "00:00").trim();
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const parsed = new Date(`${dateValue}T${normalizedTime}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60000);
