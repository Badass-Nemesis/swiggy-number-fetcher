export async function fetchNumber(apiKey: string) {
  try {
    const response = await fetch(
      `/api/proxy?apiKey=${apiKey}&action=getNumber&service=jx&country=22&serverId=2`
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
        return { status: "error", message: "Unknown response from server." };
      }
    } else {
      return { status: "error", message: result.message };
    }
  } catch (error) {
    console.error("Error fetching number:", error);
    return { status: "error", message: "Failed to fetch number. Please try again." };
  }
}