import { Order } from "../types/types";

const fetchNewOrder = async (): Promise<Order | null> => {
    try {
        const response = await fetch("/api/orders", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response)
    
        if (!response.ok) {
            throw new Error('Error with getting new orders.');
        }
    
        const data = await response.json();
        console.log(data)
        return data as Order;
    } catch (error) {
        console.error("Errow while fetching new orders", error);    
        return null;
    }
}

export default fetchNewOrder;