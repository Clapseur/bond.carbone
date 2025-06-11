"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IconButton = ({
  icon: Icon,
  active = false,
  onClick,
  size = "default",
  animate = true,
  className = "",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: "p-2",
    default: "p-3",
    md: "p-4",
    lg: "p-5"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const handleClick = (e) => {
    if (animate) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);
    }
    onClick?.(e);
  };

  const buttonVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: 1.05,
      rotate: 0,
      boxShadow: "0 8px 25px 0 rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    },
    active: {
      scale: 1.1,
      rotate: 0,
      boxShadow: "0 8px 25px 0 rgba(255, 193, 7, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const iconVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      pathLength: 1
    },
    hover: {
      scale: 1.1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.9,
      rotate: 15,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    },
    active: {
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        rotate: {
          duration: 0.5,
          ease: "easeInOut"
        },
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }
    }
  };

  const rippleVariants = {
    initial: {
      scale: 0,
      opacity: 0.6
    },
    animate: {
      scale: 2,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-full border-0 outline-none cursor-pointer ${
        active 
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
          : 'bg-white/10 backdrop-blur-md text-yellow-400 border border-white/20'
      } ${sizeClasses[size]} ${className}`}
      variants={buttonVariants}
      initial="initial"
      animate={active ? "active" : isHovered ? "hover" : "initial"}
      whileTap="tap"
      {...props}
    >
      {/* Ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/30"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Icon with animation */}
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate={active ? "active" : isHovered ? "hover" : "initial"}
        whileTap="tap"
        className="relative z-10"
      >
        <Icon 
          className={iconSizes[size]} 
          fill={active ? 'currentColor' : 'none'} 
          stroke="currentColor"
          strokeWidth={2}
        />
      </motion.div>

      {/* Glow effect for active state */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-400/20"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export { IconButton };