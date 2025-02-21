import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ icon: Icon, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-6 relative">
      {/* Left-side icon */}
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="text-green-500 size-5" />
        </div>
      )}

      {/* Input field */}
      <input
        {...props}
        type={type === "password" && showPassword ? "text" : type}
        className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-opacity-50 border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 focus:ring-2 transition duration-200 ${
          type !== "password" ? "pr-3" : ""
        }`}
      />

      {/* Right-side password toggle icon */}
      {type === "password" && (
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
