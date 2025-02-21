import { motion } from "framer-motion";
import { Loader, UserRound } from "lucide-react";
import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuthApi } from "../Api/authApi";

function SetUsernamePage() {
  const navigate = useNavigate();
  const { error, isLoading, settingUsername, user } = useAuthApi();

  const [username, setUsername] = useState(user.username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await settingUsername(username);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Set the username
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={UserRound}
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
          />

          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Submit"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default SetUsernamePage;
