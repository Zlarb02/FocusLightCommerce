import React from "react";

export const OctoberDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Toiles d'araignée aux coins supérieurs */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-40">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L100 100M0 50L100 50M50 0L50 100M0 100L100 0"
            stroke="#333"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#333"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#333"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            stroke="#333"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-48 h-48 opacity-40 transform scale-x-[-1]">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L100 100M0 50L100 50M50 0L50 100M0 100L100 0"
            stroke="#333"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#333"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="#333"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            stroke="#333"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Araignées suspendues */}
      <div
        className="absolute top-20 left-1/4 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <div className="w-6 h-6 bg-black rounded-full relative">
          <div className="absolute w-8 h-1 bg-black left-6 top-2 transform -rotate-45"></div>
          <div className="absolute w-8 h-1 bg-black left-6 top-3 transform rotate-45"></div>
          <div className="absolute w-8 h-1 bg-black right-6 top-2 transform rotate-45"></div>
          <div className="absolute w-8 h-1 bg-black right-6 top-3 transform -rotate-45"></div>
        </div>
        <div className="w-px h-20 bg-gray-500 mx-auto -mt-1"></div>
      </div>

      {/* Citrouilles sur les côtés */}
      <div className="absolute bottom-10 left-10">
        <div className="w-12 h-10 bg-orange-500 rounded-full relative">
          <div className="absolute -top-2 left-5 w-2 h-4 bg-green-800 rounded-sm"></div>
          <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-black rounded-full"></div>
          <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-black rounded-full"></div>
          <div className="absolute bottom-2 left-4 right-4 h-1 bg-black rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default OctoberDecoration;
