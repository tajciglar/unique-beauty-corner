import { formatTime } from "../utility/changeDate";

interface ViewAppointmentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ViewAppointment: React.FC<ViewAppointmentProps> = ({ appointment, onClose, onDelete }) => {
  if (!appointment) return null;
  const isAvailableSlot = appointment.title === "Prosti termin";

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-[var(--terracotta)]">Podrobnosti termina</h2>

        {isAvailableSlot ? (
          <>
            <p><span className="font-semibold">Termin:</span> {appointment.title}</p>
            <p><span className="font-semibold">Začetek:</span> {formatTime(appointment.start)}</p>
            <p><span className="font-semibold">Konec:</span> {formatTime(appointment.end)}</p>
            <p><span className="font-semibold">Lokacija:</span> {appointment.extendedProps.location}</p>
          </>
        ) : (
          <>
            <p><span className="font-semibold">Ime:</span> {appointment.title}</p>
            <p><span className="font-semibold">E-pošta:</span> {appointment.extendedProps.email}</p>
            <p><span className="font-semibold">Telefon:</span> {appointment.extendedProps.phone}</p>
            <p><span className="font-semibold">Začetek:</span> {formatTime(appointment.start)}</p>
            <p><span className="font-semibold">Konec:</span> {formatTime(appointment.end)}</p>

            <div>
              <p className="font-semibold">Storitve:</p>
              <ul className="list-disc list-inside ml-2">
                {appointment.extendedProps.services.map((service: { serviceName: string }) => (
                  <li key={service.serviceName}>{service.serviceName}</li>
                ))}
              </ul>
            </div>

            <p>
              <span className="font-semibold">Cena:</span>{" "}
              {appointment.extendedProps.price ? `${appointment.extendedProps.price}€` : "Ni podatka"}
            </p>
            <p><span className="font-semibold">Lokacija:</span> {appointment.extendedProps.location}</p>
          </>
        )}

        <div className="flex gap-4 mt-6">
          {!isAvailableSlot && (
            <button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              onClick={() => onDelete(appointment.id)}
            >
              Izbriši termin
            </button>
          )}
          <button
            className="flex-1 bg-[var(--terracotta)] hover:bg-[var(--soft-rose)] text-white py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Zapri
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;