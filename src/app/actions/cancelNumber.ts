"use server";

import axios from "axios";
import { NINJAOTP_HANDLER_API_URL } from "@/lib/constants";

export async function cancelNumber(apiKey: string, accessId: string) {
    try {

        const API_URL = `${NINJAOTP_HANDLER_API_URL}?api_key=${apiKey}&action=setStatus&status=cancel&id=${accessId}`;

        const response = await axios.get(API_URL);

        const data = response.data;

        if (data === "ACCESS_CANCEL") {
            return { status: "success", message: "Number canceled successfully." };
        } else if (data === "ERROR") {
            return { status: "error", message: "Failed to cancel the number. Please cancel it manually on NinjaOTP." };
        } else {
            return { status: "error", message: "Unknown response from server." };
        }
    } catch (error) {
        return { status: "error", message: "Failed to cancel the number. Please cancel it manually on NinjaOTP." };
    }
}