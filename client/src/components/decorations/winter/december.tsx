import React from "react";

export const DecemberDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Neige qui tombe */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-fall"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              opacity: Math.random() * 0.7 + 0.3,
              top: `-${Math.random() * 10 + 10}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Guirlande en haut */}
      <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center">
        <div className="flex space-x-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i % 4 === 0
                  ? "bg-red-500"
                  : i % 4 === 1
                  ? "bg-green-500"
                  : i % 4 === 2
                  ? "bg-yellow-400"
                  : "bg-blue-500"
              } animate-pulse`}
              style={{
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Sapin de Noël */}
      <div className="absolute bottom-10 right-10 w-40 h-60 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[40px] border-l-transparent border-r-transparent border-b-green-700 relative">
          <div className="absolute top-5 left-[-3px] w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-[-3px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[50px] border-l-transparent border-r-transparent border-b-green-700 -mt-5 relative">
          <div className="absolute top-10 left-[-5px] w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute top-15 right-[-5px] w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[60px] border-l-transparent border-r-transparent border-b-green-700 -mt-5 relative">
          <div className="absolute top-20 left-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-30 right-0 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        </div>
        <div className="w-10 h-20 bg-brown-600 -mt-3"></div>
      </div>

      {/* Étiquette "Joyeux Noël" */}
      <div className="absolute top-20 left-20 bg-red-600 text-white px-4 py-2 rounded-lg transform -rotate-12 shadow-lg border-2 border-white">
        <div className="font-bold text-lg">Joyeux Noël</div>
      </div>

      {/* Boule de Noël suspendue */}
      <div className="absolute top-0 left-1/4 flex flex-col items-center">
        <div className="w-px h-20 bg-gray-300"></div>
        <div
          className="w-12 h-12 bg-red-500 rounded-full shadow-lg relative animate-swing"
          style={{ animationDuration: "3s" }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default DecemberDecoration;
