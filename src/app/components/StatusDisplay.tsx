"use client";

interface StatusDisplayProps {
  status: "idle" | "loading" | "success" | "error";
  message?: string | null;
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
      backgroundColor = "bg-blue-100 dark:bg-blue-900";
      borderColor = "border-blue-400 dark:border-blue-700";
      textColor = "text-blue-700 dark:text-blue-200";
      break;
    case "success":
      backgroundColor = "bg-green-100 dark:bg-green-900";
      borderColor = "border-green-400 dark:border-green-700";
      textColor = "text-green-700 dark:text-green-200";
      break;
    case "error":
      backgroundColor = "bg-red-100 dark:bg-red-900";
      borderColor = "border-red-400 dark:border-red-700";
      textColor = "text-red-700 dark:text-red-200";
      break;
    default:
      break;
  }

  return (
    <div className={`p-4 ${backgroundColor} border ${borderColor} ${textColor} rounded-md text-center`}>
      {status === "loading" ? (
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>{message || "Loading..."}</p>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}