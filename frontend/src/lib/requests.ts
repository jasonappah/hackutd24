const BASE_URL = "http://localhost:3000";
const PINATA_GATEWAY_URL = "https://amethyst-accessible-ox-864.mypinata.cloud";
  
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
    
    // TODO: below is not included from the backend but should be in the future
    itemsLeftBehind?: string[]
}


export async function getAllImages() {
    const response = await fetch(`${BASE_URL}/api/all-images`);
    const data = await response.json();
    return data as GetAllImagesResponse;
}

export const pinataCidToUrl = (cid: string) => `${PINATA_GATEWAY_URL}/files/${cid}?img-width=500&img-fit=scale-down`;