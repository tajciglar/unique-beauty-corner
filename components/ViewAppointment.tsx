import { useState, useEffect } from "react";
import getServices from "../hooks/useFetchServices";
import { ServiceCategory, Appointment } from "../types/types";
interface Service {
  id: number;
  serviceName: string;
  servicePrice?: number;
  serviceTime?: number;
}

interface ViewAppointmentProps {
  appointmentId: number | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: number, appointmentForm: Appointment) => void;
} 

const ViewAppointment: React.FC<ViewAppointmentProps> = ({
  appointmentId,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  const isAvailableSlot = appointment?.available ?? false;
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        const data = await response.json();
        setAppointment(data);
        setSelectedServices(data.order?.services || []);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);


  // Fetch services only when in update mode
  useEffect(() => {
    if (!updateMode) return;
    const fetchServices = async () => {
      const fetchedServices = await getServices();
      setServices(fetchedServices ?? []);
    };
    fetchServices();
  }, [updateMode]);


  if (!appointment) return null;

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!appointment) return; 

    setAppointment((prev) => {
      // At this point, prev is guaranteed to be non-null
      return {
        ...prev!,
        order: ["name", "email", "phone", "price"].includes(name)
          ? {
              ...prev!.order,
              [name]: name === "price" ? Number(value) : value,
            }
          : prev!.order,
        ...( ["name", "email", "phone", "price"].includes(name) ? {} : { [name]: value } )
      };
    });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: Service) => {
    setAppointment((prev) => {
      if (!prev) return prev;

      // Compute updated services
      const updatedServices = e.target.checked
        ? [...(prev.order?.services || []), service]
        : (prev.order?.services || []).filter((s) => s.id !== service.id);
      const updatedPrice = updatedServices.reduce((sum, s) => sum + Number(s.servicePrice || 0), 0);
      return {
        ...prev!,
        order: prev!.order
          ? { ...prev!.order, price: updatedPrice, services: updatedServices }
          : {
              id: undefined,
              name: "",
              email: "",
              phone: "",
              price: 0,
              duration: 0,
              services: updatedServices,
            },
      };
    });

  // Update local state for checkboxes as well
    setSelectedServices((prev) =>
      e.target.checked ? [...prev!, service] : prev!.filter((s) => s.id !== service.id)
    );
  };

  

  const handleUpdate = () => {
    onUpdate(Number(appointment.id), appointment);

    setUpdateMode(false);
    onClose();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-[var(--terracotta)]">
          Podrobnosti termina
        </h2>
        {/* If in update mode, show editable form */}
        {updateMode ? (
          <div className="space-y-3 overflow-y-auto max-h-[70vh]">
            {!isAvailableSlot ? (
              <>
                <div>
                  <label className="block font-semibold">Ime</label>
                  <input
                    type="text"
                    name="name"
                    value={appointment.order?.name || ''}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">E-pošta</label>
                  <input
                    type="email"
                    name="email"
                    value={appointment.order?.email}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Telefon</label>
                  <input
                    type="text"
                    name="phone"
                    value={appointment.order?.phone}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div >
                  <label className="block font-semibold">Datum</label>
                  <input
                    type="date"
                    name="date"
                    value={appointment.date}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold ">Začetek</label>
                  <input
                    type="time"
                    name="startTime"
                    value={appointment.startTime}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Konec</label>
                  <input
                    type="time"
                    name="endTime"
                    value={appointment.endTime}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label htmlFor="services">Storitve</label>
                  {services?.map((category) => (
                    <div key={category.id} className="mb-2">
                      <label className="font-bold">{category.categoryName}</label>
                      <ul className="ml-4">
                        {category.services.map((service) => (
                          <li key={category.id + "-" + service.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`service-${service.id}`}
                              value={service.id}
                              onChange={(e) => handleServiceChange(e, service)}
                              checked={selectedServices.some((s) => s.id === service.id)}
                              className="mr-2"
                            />
                            <label htmlFor={`service-${service.id}`}>
                              {service.serviceName}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-semibold">Cena (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={appointment.order?.price}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </>
            ) : (
              <>
              
                <p className="!mb-2">
                  <span className="font-semibold">Termin:</span> {appointment.order?.name}
                </p>

                <label htmlFor="startTime">Datum</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={appointment.date}
                  onChange={handleAppointmentChange}
                  className="border p-2 rounded w-full !mb-3 !mt-1"
                />

                <label htmlFor="startTime">Začetek</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={appointment.startTime}
                  onChange={handleAppointmentChange}
                  className="border p-2 rounded w-full !mb-3 !mt-1"
                />

                <label htmlFor="endTime" className="m-">Konec</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={appointment.endTime}
                  onChange={handleAppointmentChange}
                  className="border p-2 rounded w-full !mb-3 !mt-1"
                />
              </>
            )}

            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 text-white py-2 px-4 rounded-lg"
                onClick={handleUpdate}
              >
                Shrani spremembe
              </button>
              <button
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setUpdateMode(false)}
              >
                Prekliči
              </button>
            </div>
          </div>
        ) : (
          <>
            {isAvailableSlot ? (
              <>
                <p><span className="font-semibold">Termin:</span> Prosti termin</p>
                <p><span className="font-semibold">Datum:</span> {appointment.date}</p>
                <p><span className="font-semibold">Začetek:</span> {appointment.startTime}</p>
                <p><span className="font-semibold">Konec:</span> {appointment.endTime}</p>
              </>
            ) : (
              <>
                <p><span className="font-semibold">Ime:</span> {appointment.order?.name}</p>
                <p><span className="font-semibold">E-pošta:</span> {appointment.order?.email}</p>
                <p><span className="font-semibold">Telefon:</span> {appointment.order?.phone}</p>
                <p><span className="font-semibold">Začetek:</span> {appointment.startTime}</p>
                <p><span className="font-semibold">Konec:</span> {appointment.endTime}</p>
                <div>
                  <p className="font-semibold">Storitve:</p>
                 
                  <ul className="list-disc list-inside ml-2">
                    {appointment.order?.services?.map(
                      (service: { serviceName: string; serviceCategory?: { categoryName: string } }) => (
                        <li key={service.serviceName}>
                          <span className="font-semibold">
                            {service.serviceCategory?.categoryName}:
                          </span>{" "}
                          {service.serviceName}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <p>
                  <span className="font-semibold">Cena:</span>{" "}
                  {appointment.order?.price
                    ? `${appointment.order?.price}€`
                    : "Ni podatka"}
                </p>
              </>
            )}
            <div className="flex flex-col gap-4 mt-6">
              <button
                className="flex-1 text-white py-2 px-4 rounded-lg"
                onClick={() => setUpdateMode(true)}
              >
                Spremeni
              </button>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  onClick={() => appointment.id !== undefined && onDelete(String(appointment.id))}
                >
                  Izbriši termin
                </button>
                <button
                  className="flex-1 bg-[var(--soft-rose)] hover:bg-[var(--soft-rose)] text-white py-2 px-4 rounded-lg"
                  onClick={onClose}
                >
                  Zapri
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAppointment;