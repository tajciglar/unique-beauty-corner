// src/context/ServiceContext.tsx
'use client';
import { Service } from '../types/types';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface ServiceContextType {
  servicesPicked: Service[];
 setServicesPicked: React.Dispatch<React.SetStateAction<Service[]>>;
}

// kreiranje konteksta za storitev (services)
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [servicesPicked, setServicesPicked] = useState<Service[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === '/login') {
      setIsCheckingAuth(false);
      return;
    }

    // Check authentication - use sessionStorage to match login page
    const accessGranted = sessionStorage.getItem('accessGranted');
    if (!accessGranted) {
      router.push('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router, pathname]);

  // Show nothing while checking authentication to prevent flash
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--cream-white)]">
        <div className="text-[var(--terracotta)]">Loading...</div>
      </div>
    );
  }

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