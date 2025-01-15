"use server";

import { SWIGGY_BASE_URL } from "@/lib/constants";
import { getCookies } from "@/app/utils/getCookies";
import { getCsrfToken } from "@/app/utils/getCsrfToken";
import { signinWithCheck } from "@/app/utils/signinWithCheck";

export async function checkNumber(phoneNumber: string) {
  console.log("Checking number registration on Swiggy...");
  try {
    const initialCookies = await getCookies(`${SWIGGY_BASE_URL}/restaurants`);
    if (!initialCookies) {
      console.error("Failed to fetch initial cookies.");
      return { status: "error", message: "Failed to fetch initial cookies." };
    }

    const { combinedCookies, csrfToken } = await getCsrfToken(initialCookies);
    if (!combinedCookies || !csrfToken) {
      console.error("Failed to fetch CSRF token or updated cookies.");
      return { status: "error", message: "Failed to fetch CSRF token or updated cookies." };
    }

    const numberDetails = await signinWithCheck(combinedCookies, csrfToken, phoneNumber);
    if (!numberDetails) {
      console.error("Failed to fetch number details.");
      return { status: "error", message: "Failed to fetch number details." };
    }

    if (numberDetails.statusCode !== 2) {
      console.error("Swiggy API error:", numberDetails.statusMessage);
      return { status: "error", message: numberDetails.statusMessage };
    }

    const isRegistered = numberDetails.data?.registered === true;
    console.log("Number registration check result:", { isRegistered });
    return { status: "success", isRegistered, numberDetails };
  } catch (error) {
    console.error("Error checking number registration:", error);
    return { status: "error", message: "Failed to check number registration. Please try again." };
  }
}