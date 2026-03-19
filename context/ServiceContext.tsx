// src/context/ServiceContext.tsx
'use client';
import { Service } from '../types/types';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface ServiceContextType {
  servicesPicked: Service[];
  setServicesPicked: React.Dispatch<React.SetStateAction<Service[]>>;
  clearServicesPicked: () => void;
  csrfToken: string | null;
}

// kreiranje konteksta za storitev (services)
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Key for sessionStorage
const SERVICES_STORAGE_KEY = 'unique-beauty-services-picked';

// Helper function to load services from sessionStorage
const loadServicesFromStorage = (): Service[] => {
  if (typeof window === 'undefined') return []; // SSR safety check
  
  try {
    const stored = sessionStorage.getItem(SERVICES_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Validate it's an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading services from sessionStorage:', error);
    // If there's invalid data, clear it
    sessionStorage.removeItem(SERVICES_STORAGE_KEY);
    return [];
  }
};

// Helper function to save services to sessionStorage
const saveServicesToStorage = (services: Service[]) => {
  if (typeof window === 'undefined') return; // SSR safety check
  
  try {
    sessionStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (error) {
    console.error('Error saving services to sessionStorage:', error);
    // Handle quota exceeded or other storage errors gracefully
  }
};

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from sessionStorage on mount
  const [servicesPicked, setServicesPicked] = useState<Service[]>(() => loadServicesFromStorage());
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Save to sessionStorage whenever servicesPicked changes
  useEffect(() => {
    saveServicesToStorage(servicesPicked);
  }, [servicesPicked]);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const res = await fetch('/api/csrf', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrf();
  }, []);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === '/login') {
      setIsCheckingAuth(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
          signal: controller.signal,
        });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        if (isActive) setIsCheckingAuth(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };
    checkAuth();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [router, pathname]);

  // Show nothing while checking authentication to prevent flash
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--cream-white)]">
        <div className="text-[var(--terracotta)]">Loading...</div>
      </div>
    );
  }

  // Helper function to clear services (useful after booking completion)
  const clearServicesPicked = () => {
    setServicesPicked([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SERVICES_STORAGE_KEY);
    }
  };

  return (
    <ServiceContext.Provider value={{ servicesPicked, setServicesPicked, clearServicesPicked, csrfToken }}>
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
