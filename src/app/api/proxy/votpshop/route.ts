import { NextResponse } from "next/server";
import { VOTPSHOP_HANDLER_API_URL } from "@/app/lib/constants";
import axios from "axios";

export const config = {
    maxDuration: 300,
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");
    const action = searchParams.get("action");
    const service = searchParams.get("service");
    const country = searchParams.get("country");
    const operator = searchParams.get("serverId");
    const id = searchParams.get("id");

    if (!apiKey || !action) {
        return NextResponse.json(
            { status: "error", message: "Missing required parameters." },
            { status: 400 }
        );
    }

    let VOTPSHOP_API_URL = `${VOTPSHOP_HANDLER_API_URL}?api_key=${apiKey}&action=${action}`;

    if (action === "getNumber") {
        if (!service || !country || !operator) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for getNumber." },
                { status: 400 }
            );
        }
        VOTPSHOP_API_URL += `&service=${service}&country=${country}&operator=${operator}`;
    } else if (action === "setStatus") {
        if (!id) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for setStatus." },
                { status: 400 }
            );
        }
        VOTPSHOP_API_URL += `&id=${id}`;
    } else if (action === "getServices") {
        if (!country || !operator) {
            return NextResponse.json(
                { status: "error", message: "Missing required parameters for getServices." },
                { status: 400 }
            );
        }
        VOTPSHOP_API_URL += `&country=${country}&operator=${operator}`;
    } else {
        return NextResponse.json(
            { status: "error", message: "Invalid action. What are you trying to do, other than cancellation, getNumber and getServices?" },
            { status: 400 }
        );
    }

    try {
        const response = await axios.get(VOTPSHOP_API_URL);
        // console.log(response.data); // debug
        const data = response.data;
        return NextResponse.json({ status: "success", data });
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Failed to fetch data from VOtpShop.", error: error },
            { status: 500 }
        );
    }
}