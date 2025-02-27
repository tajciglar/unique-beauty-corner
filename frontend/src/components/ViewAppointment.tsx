import { formatTime } from "@/utility/changeDate";


interface ViewAppointmentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ViewAppointment: React.FC<ViewAppointmentProps> = ({ appointment, onClose, onDelete }) => {
  if (!appointment) return null; // Avoid rendering if no appointment is selected
  console.log(appointment.extendedProps.location)
  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="absolute bg-[var(--soft-rose)] bg-opacity-90 p-4 rounded-lg text-base flex flex-col gap-4">
        {appointment.title === "Prosti termin" ? (
          <>
            <h2 className="text-xl">Podrobnosti termina</h2>
            <p>{appointment.title}</p>
            <p><strong>Začetek:</strong> {formatTime(appointment.start)}</p>
            <p><strong>Konec:</strong> {formatTime(appointment.end)}</p>
            <p><strong>Lokacija:</strong> {appointment.extendedProps.location}</p>
            
          </>
        ) : (
          <>
            <h2 className="text-xl">Podrobnosti termina</h2>
            <p><strong>Ime:</strong> {appointment.title}</p>
            <p><strong>E-pošta:</strong> {appointment.extendedProps.email}</p>
            <p><strong>Telefon:</strong> {appointment.extendedProps.phone}</p>
            <p><strong>Začetek:</strong> {formatTime(appointment.start)}</p>
            <p><strong>Konec:</strong> {formatTime(appointment.end)}</p>
            <ul><strong>Storitve:</strong> {appointment.extendedProps.services.map((service: { serviceName: string }) => (
              <li key={service.serviceName}>{service.serviceName}</li>
            ))}</ul>
            <p><strong>Cena:</strong> {appointment.extendedProps.price ? `${appointment.extendedProps.price}€` : 'Ni podatka'}</p>
            <p><strong>Lokacija:</strong>{appointment.extendedProps.location}</p>
          </>
        )}
        <button className="bg-red-500 text-white py-1 px-3 rounded-lg" onClick={() => onDelete(appointment.id)}>
          Izbriši termin
        </button>
        <button className="bg-blue-500 text-white py-1 px-3 rounded-lg" onClick={onClose}>
          Zapri
        </button>
      </div>
    </div>
  );
};

export default ViewAppointment;
