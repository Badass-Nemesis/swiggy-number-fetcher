import { NextResponse } from "next/server";
import { POWERSMS_HANDLER_API_URL } from "@/app/lib/constants";
import axios from "axios";

export const config = {
    maxDuration: 30,
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");
    const action = searchParams.get("action");
    const service = searchParams.get("service");
    const serverId = searchParams.get("serverId");
    const id = searchParams.get("id");

    if (!apiKey || !action) {
        return NextResponse.json(
            { status: "error", message: "Missing required parameters." },
            { status: 400 }
        );
    }

    let POWERSMS_API_URL = `${POWERSMS_HANDLER_API_URL}?api_key=${apiKey}&action=${action}`;

    if (action === "getNumber") {
        if (!service || !serverId) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for getNumber." },
                { status: 400 }
            );
        }
        POWERSMS_API_URL += `&service=${service}&server=${serverId}`;
    } else if (action === "setStatus") {
        if (!id) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for setStatus." },
                { status: 400 }
            );
        }
        POWERSMS_API_URL += `&status=8&id=${id}`;
    } else if (action === "getServices") {
        // do nothing lol
    } else {
        return NextResponse.json(
            { status: "error", message: "Invalid action. What are you trying to do, other than cancellation, getNumber and getServices?" },
            { status: 400 }
        );
    }

    try {
        const response = await axios.get(POWERSMS_API_URL);
        const data = response.data;
        // console.log(data); // debug
        return NextResponse.json({ status: "success", data });
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Failed to fetch data from NinjaOTP." },
            { status: 500 }
        );
    }
}