import React, { useState, useEffect } from "react";
import LogoFace from "../../assets/LogoFace.jpg";

const ChatBotButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Animation interval for the monkey's movement
  useEffect(() => {
    if (!isChatOpen) {
      const interval = setInterval(() => {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isChatOpen]);

  return (
    <div>
      {/* ChatBot Icon - Responsive Positioning */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 transform
          ${isWaving ? "animate-bounce" : ""}
          ${isChatOpen ? "scale-0" : "scale-100"}
        `}
      >
        <div className="relative group">
          {/* Hover Tooltip - Responsive */}
          {isHovered && (
            <div 
              className="absolute -top-12 md:-top-16 left-1/2 transform -translate-x-1/2 
              bg-blue-500 text-white font-bold px-3 py-1 md:px-4 md:py-2 rounded-lg 
              shadow-lg text-xs md:text-sm
              before:content-[''] before:absolute before:bottom-[-6px] 
              before:left-1/2 before:transform before:-translate-x-1/2 
              before:border-t-blue-500 before:border-t-8 
              before:border-x-transparent before:border-x-8 
              before:border-b-0 
              animate-fadeIn"
            >
              Let's Talk
            </div>
          )}

          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsChatOpen(true)}
            className={`relative group rounded-3xl shadow-lg transition-all duration-500
              bg-gradient-to-r from-blue-100 to-blue-100
              hover:from-blue-100 hover:to-blue-100
              ${isHovered ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""} mr-6
            `}
          >
            {/* Animated Ripple Effect */}
            <div className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-20"></div>
            
            {/* Monkey Face - Responsive Size */}
            <img
              src={LogoFace}
              alt="Monkey Face"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover p-1"
            />
          </button>
        </div>
      </div>

      {/* Chat Window - Fully Responsive */}
      <div
        className={`fixed inset-0 md:bottom-6 md:right-6 md:inset-auto z-50 
          flex items-end justify-center md:items-end md:justify-end 
          transition-all duration-500 transform origin-bottom-right
          ${isChatOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        <div className="w-full md:w-96 h-[90vh] md:h-[500px] 
          bg-white rounded-t-lg md:rounded-lg 
          shadow-2xl overflow-hidden 
          flex flex-col
          absolute bottom-0 md:static">
          {/* Chat Header - Responsive */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 md:p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm md:text-base">Monkey Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white opacity-80 hover:opacity-100 transition-opacity duration-300"
              >
                <span className="text-xl md:text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Chat Content - Scrollable and Responsive */}
          <div className="flex-grow p-3 md:p-4 overflow-y-auto 
            bg-gradient-to-b from-blue-50 to-white">
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg inline-block animate-fadeIn">
              <p className="text-gray-800 text-xs md:text-base"> 
                Hey there! How can I assist you today?
              </p>
            </div>
          </div>

          {/* Chat Input - Responsive */}
          <div className="p-3 md:p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 md:p-3 text-xs md:text-base 
                  border rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-blue-400 
                  transition-all duration-300"
              />
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-600 
                  hover:from-blue-500 hover:to-blue-700 
                  text-white px-4 md:px-6 py-2 
                  text-xs md:text-base
                  rounded-lg transition-all duration-300 
                  hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotButton;