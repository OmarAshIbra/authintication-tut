import { motion } from "framer-motion";
export const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute ${color} ${size} rounded-full opacity-20 blur-xl  `}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0.36],
        transition: {
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          delay,
        },
      }}
      aria-hidden="true"
    ></motion.div>
  );
};
