export async function cancelNumber(apiKey: string, accessId: string) {
    try {
        const response = await fetch(
            `/api/proxy?apiKey=${apiKey}&action=setStatus&id=${accessId}`
        );
        const result = await response.json();

        if (result.status === "success") {
            const data = result.data;
            if (data === "ACCESS_CANCEL") {
                return { status: "success", message: "Number canceled successfully." };
            } else if (data === "ACCESS_CANCEL_ALREADY") {
                return { status: "success", message: "Number is already canceled." };
            } else if (data === "ERROR") {
                return { status: "error", message: "Failed to cancel the number. Please cancel it manually on NinjaOTP." };
            } else {
                return { status: "error", message: "Unknown response from server." };
            }
        } else {
            return { status: "error", message: result.message };
        }
    } catch (error) {
        console.error("Error canceling number:", error);
        return { status: "error", message: "Failed to cancel the number. Please try again." };
    }
}