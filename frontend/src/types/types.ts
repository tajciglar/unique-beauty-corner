interface Appointment {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    avalible: boolean;
    location: string;
    orders: ClientAppointment;
  }

interface ServiceCategory {
    id: number;
    categoryName: string;
    services: Service[];
}

interface ClientAppointment extends Appointment {
    orderId: number;
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