import { NextResponse } from "next/server";
import { getCookies } from "@/app/utils/getCookies";
import { getCsrfToken } from "@/app/utils/getCsrfToken";
import { signinWithCheck } from "@/app/utils/signinWithCheck";

export const maxDuration = 45;

export async function POST(request: Request) {
    try {
        const { phoneNumber } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json(
                { status: "error", message: "Phone number is required." },
                { status: 400 }
            );
        }

        const initialCookies = await getCookies();
        if (!initialCookies) {
            return NextResponse.json(
                { status: "error", message: "Failed to fetch initial cookies." },
                { status: 500 }
            );
        }

        const { combinedCookies, csrfToken } = await getCsrfToken(initialCookies);
        if (!combinedCookies || !csrfToken) {
            return NextResponse.json(
                { status: "error", message: "Failed to fetch CSRF token or updated cookies." },
                { status: 500 }
            );
        }

        const numberDetails = await signinWithCheck(combinedCookies, csrfToken, phoneNumber);
        if (!numberDetails) {
            return NextResponse.json(
                { status: "error", message: "Failed to fetch number details." },
                { status: 500 }
            );
        }

        if (numberDetails.statusCode !== 2) {
            return NextResponse.json(
                { status: "error", message: numberDetails.statusMessage },
                { status: 400 }
            );
        }

        const isRegistered = numberDetails.data?.registered === true;
        return NextResponse.json(
            { status: "success", isRegistered, numberDetails },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error checking number registration:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to check number registration. Please try again." },
            { status: 500 }
        );
    }
};