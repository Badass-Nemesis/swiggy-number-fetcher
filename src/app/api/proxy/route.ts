import { NextResponse } from "next/server";
import { NINJAOTP_HANDLER_API_URL } from "@/lib/constants";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");
    const action = searchParams.get("action");
    const service = searchParams.get("service");
    const country = searchParams.get("country");
    const serverId = searchParams.get("serverId");
    const status = searchParams.get("status");
    const id = searchParams.get("id");

    if (!apiKey || !action) {
        return NextResponse.json(
            { status: "error", message: "Missing required parameters." },
            { status: 400 }
        );
    }

    let NINJAOTP_API_URL = `${NINJAOTP_HANDLER_API_URL}?api_key=${apiKey}&action=${action}`;

    if (action === "getNumber") {
        if (!service || !country || !serverId) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for getNumber." },
                { status: 400 }
            );
        }
        NINJAOTP_API_URL += `&service=${service}&country=${country}&server_id=${serverId}`;
    } else if (action === "setStatus") {
        if (!status || !id) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for setStatus." },
                { status: 400 }
            );
        }
        NINJAOTP_API_URL += `&status=${status}&id=${id}`;
    } else {
        return NextResponse.json(
            { status: "error", message: "Invalid action." },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(NINJAOTP_API_URL);
        const data = await response.text();
        // console.log(data); // debug
        return NextResponse.json({ status: "success", data });
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Failed to fetch data from NinjaOTP." },
            { status: 500 }
        );
    }
}