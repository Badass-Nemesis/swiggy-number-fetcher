import { NextResponse } from "next/server";
import { SocksProxyAgent } from "socks-proxy-agent";
import { API_KEY, PROXY_URL } from "@/lib/constants";

// Define the type for the request body (if needed)
interface FetchNumberRequest {
    service: string;
    country: number;
    server_id: number;
}

// Define the type for the response
interface FetchNumberResponse {
    access_id: string;
    number: string;
}

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body: FetchNumberRequest = await request.json();

        // Set up the proxy agent
        const agent = new SocksProxyAgent(PROXY_URL);

        // Construct the API URL
        const API_URL = `https://api.ninjaotp.com/stubs/handler_api.php?api_key=${API_KEY}&action=getNumber&service=${body.service}&country=${body.country}&server_id=${body.server_id}`;

        // Make the request
        const response = await fetch(API_URL, { agent } as RequestInit);
        const data = await response.text();

        // Handle the response
        if (data.startsWith("ACCESS_NUMBER:")) {
            const [_, access_id, number] = data.split(":");
            const result: FetchNumberResponse = { access_id, number };
            return NextResponse.json(result, { status: 200 });
        } else {
            throw new Error(data);
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: "Failed to fetch number" }, { status: 500 });
    }
}