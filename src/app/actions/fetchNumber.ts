"use server";

import axios from "axios";
import { NINJAOTP_HANDLER_API_URL, RETRY_DELAY } from "@/lib/constants";

export async function fetchNumber(apiKey: string) {
  try {
    const API_URL = `${NINJAOTP_HANDLER_API_URL}?api_key=${apiKey}&action=getNumber&service=jx&country=22&server_id=2`;

    while (true) {
      const response = await axios.get(API_URL);
      const data = response.data;

      if (data === "NO_NUMBERS") {
        console.log(`No numbers available. Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else if (data.startsWith("ACCESS_NUMBER:")) {
        const [_, access_id, number] = data.split(":");
        console.log("Number fetched successfully:", { access_id, number });
        return { status: "success", access_id, number };
      } else {
        throw new Error("Unknown response from server.");
      }
    }
  } catch (error) {
    console.error("Error fetching number:", error);
    throw error;
  }
}