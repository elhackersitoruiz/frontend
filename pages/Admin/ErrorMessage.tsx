import React from "react";

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return <p style={{ color: "red" }}>{message}</p>;
};

export default ErrorMessage;
