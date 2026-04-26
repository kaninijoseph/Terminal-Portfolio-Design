"use client";
import Header from "@/Components/Header";
import Terminal from "@/Components/terminal";
import React from "react";
import Matrix from "@/Components/Matrix_animation";
import { useState, useEffect, useRef } from "react";

const HomePage = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  // NEW: This state holds the image path shared between components
  const [activeImg, setActiveImg] = useState<string | null>(null);

  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (window.innerWidth <= 768) {
      setIsFullScreen(!isFullScreen);
    }
  };

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
      {/* Left Panel */}
      <div className="w-full md:w-[30%] md:h-full py-4 bg-gray-950 border-gray-700 border-2 rounded-lg shadow-lg px-3 relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Matrix />
        </div>
        <div className="relative z-10">
          {/* FIX 1: Pass the active image to the Header */}
          <Header activeProjectImage={activeImg} />
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
        {isFullScreen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false);
            }}
            className="absolute top-4 right-4 z-50 text-gray-300 hover:text-white bg-gray-800 rounded-full p-2"
          >
            {/* ... SVG remains same ... */}
          </button>
        )}

        {/* FIX 2: Pass the setter function to the Terminal */}
        <Terminal onProjectSelect={(img) => setActiveImg(img)} />
      </div>
    </div>
  );
};

export default HomePage;
