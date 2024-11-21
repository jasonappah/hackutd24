const BASE_URL = "https://api.backtracc.tech";
const PINATA_GATEWAY_URL = "https://amethyst-accessible-ox-864.mypinata.cloud";
import {
  useQuery,
} from '@tanstack/react-query'  

export interface GetAllImagesResponse {
    success: true;
    error: null;
    data: {
        files: PinataFile[];
        next_page_token: string;
    }
}

export interface PinataFile {
    id: string;
    name: string;
    cid: string;
    size: number;
    number_of_files: number;
    mime_type: string;
    group_id: unknown;
    keyvalues: Keyvalues;
    created_at: string;
}

export interface Keyvalues {
    driverName: string;
    passengerName: string;
    timestamp: string;
    
    description?: string
}


export async function getAllImages() {
    const response = await fetch(`${BASE_URL}/api/all-images`);
    const data = await response.json();
    return data as GetAllImagesResponse;
}

export const pinataCidToUrl = (cid: string) => `${PINATA_GATEWAY_URL}/files/${cid}?img-width=500&img-fit=scale-down`;

export function useAllImages() {
    return useQuery({
        queryKey: ['all-images'],
        queryFn: async () => {
            const response = await getAllImages();
            return response;
        },
        // refetchInterval: 60 * 1000,
    });
}
