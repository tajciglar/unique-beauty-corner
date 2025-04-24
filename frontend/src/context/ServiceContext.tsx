// src/context/ServiceContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  time: number | null;
}

interface ServiceContextType {
  servicesPicked: ServiceItem[];
 setServicesPicked: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
}

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// kreiranje konteksta za storitev (services)
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [servicesPicked, setServicesPicked] = useState<ServiceItem[]>([]);

  const router = useRouter();
  useEffect(() => {
  const accessGranted = localStorage.getItem('accessGranted');
  if (!accessGranted) {
    router.push('/login');
  }
}, [router]);

  return (
    <ServiceContext.Provider value={{ servicesPicked, setServicesPicked }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};


// Kreiral smo context da se lahko uporabi na večih komponentah npr v Home.tsx in Booking.tsx. 
// Inicializirali smo tudi useState za servicesPicked, ki je tipa ServiceItem[].