import React from "react";

const TextInput = ({
  type = "text",
  value,
  onChange,
  placeholder = "Enter text",
  className = ""
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`mb- w-full border-b-2 border-gray-300 p-3 shadow-sm focus:border-blue-600 focus:outline-none ${className}`}
      value={value}
      onChange={onChange}
      required
    />
  );
};

export default TextInput;