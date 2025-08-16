// Get all the services from the backend
import { ServiceCategory } from "../types/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(apiBaseUrl);

const getServices = async (): Promise<ServiceCategory[] | null> => { 
    try {
      const response = await fetch(`${apiBaseUrl}/api/services`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error with getting the services.');
      }

      const data = await response.json();
  
      return data as ServiceCategory[];
      
    } catch (error) { 
      console.log(error);
      return null;
    }
}

export default getServices;