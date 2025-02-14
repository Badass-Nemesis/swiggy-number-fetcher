export async function fetchNumber(apiKey: string, serverId: number) {
  try {
    const response = await fetch(
      `/api/proxy?apiKey=${apiKey}&action=getNumber&service=siy&country=22&serverId=${serverId}`
    );
    const result = await response.json();

    if (result.status === "success") {
      const data = result.data;
      if (data === "NO_NUMBERS") {
        return { status: "retry", message: "No numbers available." };
      } else if (data.startsWith("ACCESS_NUMBER:")) {
        const [_, access_id, number] = data.split(":");
        return { status: "success", access_id, number };
      } else {
        return { status: "error", message: JSON.stringify(result) };
      }
    } else {
      return { status: "error", message: result };
    }
  } catch (error) {
    console.error("Error fetching number:", error);
    if (error instanceof Error) {
      return { status: "error", message: `Failed to fetch number. Please try again. ${error.message}` }
    }
    return { status: "error", message: "Failed to fetch number. Please try again." };
  }
}