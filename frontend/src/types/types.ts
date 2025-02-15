interface Appointment {
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    order: ClientAppointment;
  }

interface ServiceCategory {
    id: number;
    categoryName: string;
    services: Service[];
}

interface ClientAppointment extends Appointment {
    name: string;
    phone: string;
    email: string;
    price: number,
    time: number,
    services: object[];
}

interface Service {
    id: number;
    serviceName: string;
    servicePrice: number;
    serviceTime: number
}


export type { Appointment, ServiceCategory, ClientAppointment, Service}