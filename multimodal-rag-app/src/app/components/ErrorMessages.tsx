import React from "react";

interface ErrorMessagesProps {
  errors: string[];
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors }) => {
  if (errors.length === 0) return <div>...</div>;

  return (
    <div className="">
      {errors.map((error, index) => (
        <p key={index} className="text-sm">
          {error}
        </p>
      ))}
    </div>
  );
};

export default ErrorMessages;
