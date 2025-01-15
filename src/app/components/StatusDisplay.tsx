"use client";

interface StatusDisplayProps {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function StatusDisplay({ status, message }: StatusDisplayProps) {
  if (status === "idle") {
    return null;
  }

  let backgroundColor = "";
  let borderColor = "";
  let textColor = "";

  switch (status) {
    case "loading":
      backgroundColor = "bg-blue-100";
      borderColor = "border-blue-400";
      textColor = "text-blue-700";
      break;
    case "success":
      backgroundColor = "bg-green-100";
      borderColor = "border-green-400";
      textColor = "text-green-700";
      break;
    case "error":
      backgroundColor = "bg-red-100";
      borderColor = "border-red-400";
      textColor = "text-red-700";
      break;
    default:
      break;
  }

  return (
    <div className={`p-4 ${backgroundColor} border ${borderColor} ${textColor} rounded-md`}>
      {status === "loading" ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>{message || "Loading..."}</p>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}