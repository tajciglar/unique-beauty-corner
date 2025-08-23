import { useState, useEffect } from "react";
import { changeDate, formatTime } from "../utility/changeDate";
import getServices from "../hooks/useFetchServices";
import { ServiceCategory, Appointment } from "../types/types";


interface Service {
  id: number;
  serviceName: string;
  servicePrice?: number;
  serviceTime?: number;
}


interface ViewAppointmentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: number, appointmentForm: Appointment) => void;
} 

const ViewAppointment: React.FC<ViewAppointmentProps> = ({
  appointment,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  const isAvailableSlot = appointment?.title === "Prosti termin";
  console.log(appointment.extendedProps.services)
  const [orderForm, setOrderForm] = useState({
    name: appointment.title || "",
    email: appointment?.extendedProps?.email || "",
    phone: appointment?.extendedProps?.phone || "",
    price: appointment?.extendedProps?.price || "",
    duration: appointment?.extendedProps?.duration || 0,
    services: appointment?.extendedProps?.services || [],
  });

  const [appointmentForm, setAppointmentForm] = useState({
    id: appointment?.id ? Number(appointment.id) : undefined,
    date: new Date(appointment.start).toISOString().split("T")[0] || "",
    startTime: formatTime(appointment?.start),
    endTime: formatTime(appointment?.end),
    order: orderForm,
    createdAt: appointment?.createdAt || new Date().toISOString(),
    updatedAt: appointment?.updatedAt || new Date().toISOString(),
    available: appointment?.available || false,
  });

  const [selectedServices, setSelectedServices] = useState<Service[]>(orderForm.services || []);
  const [services, setServices] = useState<ServiceCategory[]>([]);

  // Fetch services only when in update mode
  useEffect(() => {
    if (!updateMode) return;
    const fetchServices = async () => {
      const fetchedServices = await getServices();
      setServices(fetchedServices ?? []);
    };
    fetchServices();
  }, [updateMode]);

  useEffect(() => {
    setOrderForm((prev) => ({
      ...prev,
      services: selectedServices,
    }));
  }, [selectedServices]);

  if (!appointment) return null;

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value });
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: Service) => {
  const updatedServices = e.target.checked
    ? [...selectedServices, service]
    : selectedServices.filter((s) => s.id !== service.id);

    setSelectedServices(updatedServices);
  };

  

  const handleUpdate = () => {
    appointmentForm.order = orderForm;
    onUpdate(Number(appointment.id), appointmentForm);

    setUpdateMode(false);
    onClose();
  };

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
                    value={orderForm.name}
                    onChange={handleOrderChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">E-pošta</label>
                  <input
                    type="email"
                    name="email"
                    value={orderForm.email}
                    onChange={handleOrderChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>console.
                  <label className="block font-semibold">Telefon</label>
                  <input
                    type="text"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleOrderChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div >
                  <label className="block font-semibold">Datum</label>
                  <input
                    type="date"
                    name="date"
                    value={changeDate(appointment.start.toISOString().split("T")[0])}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold ">Začetek</label>
                  <input
                    type="time"
                    name="startTime"
                    value={appointmentForm.date}
                    onChange={handleAppointmentChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Konec</label>
                  <input
                    type="time"
                    name="endTime"
                    value={appointmentForm.endTime}
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
                    value={orderForm.price}
                    onChange={handleOrderChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </>
            ) : (
              <>
              
                <p className="!mb-2">
                  <span className="font-semibold">Termin:</span> {appointment.title}
                </p>

                <label htmlFor="startTime">Datum</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={appointmentForm.date}
                  onChange={handleAppointmentChange}
                  className="border p-2 rounded w-full !mb-3 !mt-1"
                />

                <label htmlFor="startTime">Začetek</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={appointmentForm.startTime}
                  onChange={handleAppointmentChange}
                  className="border p-2 rounded w-full !mb-3 !mt-1"
                />

                <label htmlFor="endTime" className="m-">Konec</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={appointmentForm.endTime}
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
                <p><span className="font-semibold">Termin:</span> {appointment.title}</p>
                <p><span className="font-semibold">Datum:</span> {changeDate(appointment.start.toISOString().split("T")[0]).split("-").join(".")}</p>
                <p><span className="font-semibold">Začetek:</span> {formatTime(appointment.start)}</p>
                <p><span className="font-semibold">Konec:</span> {formatTime(appointment.end)}</p>
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
                    {appointment.extendedProps.services.map(
                      (service: { serviceName: string; serviceCategory?: { categoryName: string } }) => (
                        <li key={service.serviceName}>
                          <span className="font-semibold">
                            {service.serviceCategory?.categoryName || "Uncategorized"}:
                          </span>{" "}
                          {service.serviceName}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <p>
                  <span className="font-semibold">Cena:</span>{" "}
                  {appointment.extendedProps.price
                    ? `${appointment.extendedProps.price}€`
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
                  onClick={() => onDelete(appointment.id)}
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