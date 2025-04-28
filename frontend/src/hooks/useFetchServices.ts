// Get all the services from the backend
import { ServiceCategory } from "@/types/types";

const getServices = async (): Promise<ServiceCategory[] | null> => { 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`,
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
      console.log("response", response);
      const data = await response.json();
      console.log("fetched data",data);
      return data as ServiceCategory[];
    } catch (error) { 
      console.log(error);
      return null;
    }
}

export default getServices;