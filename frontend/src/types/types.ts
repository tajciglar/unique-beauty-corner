

export interface Appointment {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  location: string;
  order?: Order; 
}

export interface Order {
  id?: number;
  name: string;
  email: string;
  phone: string;
  price: number;
  duration: number; 
  services: Service[];
  appointment: Appointment  
}


export interface ServiceCategory {
  id: number;
  categoryName: string;
  services: Service[];
}

// Service type (for each individual service)
export interface Service {
  id: number;
  serviceName: string;
  servicePrice: number;
  serviceTime: number;  
  serviceCategoryId: number;  
  serviceCategory: ServiceCategory; 
  orders?: Order[]; 
}
