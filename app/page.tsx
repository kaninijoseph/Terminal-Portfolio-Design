"use client";
import Header from "@/Components/Header";
import Terminal from "@/Components/terminal";
import React from "react";
import Matrix from "@/Components/Matrix_animation";
import { useState, useEffect, useRef } from "react";

const HomePage = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (window.innerWidth <= 768) {
      // Only for mobile
      setIsFullScreen(!isFullScreen);
    }
  };

  // Close fullscreen when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isFullScreen &&
        terminalContainerRef.current &&
        !terminalContainerRef.current.contains(e.target as Node)
      ) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFullScreen]);

  return (
    <div className="bg-gray-950 px-4 md:px-8 flex flex-col md:flex-row py-5 md:py-10 gap-5 h-[100vh] w-[100vw] align-top relative sm:gap-2">
      {/* Left Panel (unchanged) */}
      <div className="w-full md:w-[30%] md:h-full py-4 bg-gray-950 border-gray-700 border-2 rounded-lg shadow-lg px-3 relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Matrix />
        </div>
        <div className="relative z-10">
          <Header />
        </div>
      </div>

      {/* Right Panel - Terminal Container */}
      <div
        ref={terminalContainerRef}
        className={`flex w-full md:w-[70%] h-[80vh] md:h-full border-gray-800 mb-3 border-2 rounded-lg overflow-hidden ${
          isFullScreen
            ? "fixed inset-0 z-50 !w-screen !h-screen !m-0 !border-0 !rounded-none"
            : ""
        }`}
        onClick={toggleFullScreen}
      >
        {/* Close button (visible only in fullscreen mode) */}
        {isFullScreen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false);
            }}
            className="absolute top-4 right-4 z-50 text-gray-300 hover:text-white bg-gray-800 rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <Terminal />
      </div>
    </div>
  );
};

export default HomePage;
