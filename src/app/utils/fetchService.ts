export async function fetchService(apiKey: string, serverId: number) {
    try {
        const response = await fetch(
            `/api/proxy?apiKey=${apiKey}&action=getServices&country=22&serverId=${serverId}`
        );
        const result = await response.json();

        if (result.status === "success") {
            const data = result.data;
            console.log(data);

            // finding the key whose value is "Swiggy", case sensitive handled
            const swiggyKey = Object.keys(data).find((key) => data[key].toLowerCase() === "swiggy".toLowerCase());

            if (swiggyKey) {
                return { status: "success", swiggyId: swiggyKey };
            } else {
                return { status: "error", message: "Swiggy service not found in the response." };
            }
        } else {
            return { status: "error", message: result.message || "Failed to fetch services." };
        }
    } catch (error) {
        console.error("Error fetching service:", error);
        if (error instanceof Error) {
            return { status: "error", message: `Failed to fetch service data. Please try again. ${error.message}` };
        }
        return { status: "error", message: "Failed to fetch service data. Please try again." };
    }
}