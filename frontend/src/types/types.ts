
export interface Appointment {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  location: string;
  orders?: Order; 
}

export interface Order extends Appointment {
  name: string;
  email: string;
  phone: string;
  price: number;
  duration: number; 
  services: Service[];  
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
