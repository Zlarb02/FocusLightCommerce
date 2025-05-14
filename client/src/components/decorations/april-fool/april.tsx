import React, { useEffect, useState } from "react";

export const AprilDecoration: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  // Effet pour faire tourner tout l'écran lentement
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => (r + 0.5) % 360);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Fond coloré et rotation subtile */}
      <div
        className="absolute inset-0 opacity-10 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500"
        style={{ transform: `rotate(${rotation}deg)` }}
      ></div>

      {/* Emojis flottants aléatoires */}
      <div
        className="absolute top-20 left-1/4 animate-bounce text-4xl"
        style={{ animationDuration: "3s" }}
      >
        🤡
      </div>

      <div
        className="absolute top-40 right-1/3 animate-bounce text-3xl"
        style={{ animationDuration: "2.5s" }}
      >
        🎭
      </div>

      <div
        className="absolute bottom-20 left-1/3 animate-bounce text-5xl"
        style={{ animationDuration: "4s" }}
      >
        🎪
      </div>

      <div
        className="absolute top-1/3 right-1/4 animate-bounce text-4xl"
        style={{ animationDuration: "3.2s" }}
      >
        🎈
      </div>

      {/* Étiquette "Poisson d'avril" */}
      <div className="absolute top-1/4 left-10 bg-teal-500 text-white px-4 py-2 rounded-lg transform rotate-12 shadow-lg">
        <div className="font-bold text-lg">Poisson d'avril!</div>
      </div>

      {/* Poisson dessiné */}
      <div className="absolute bottom-10 right-10 transform -rotate-12">
        <svg
          width="100"
          height="60"
          viewBox="0 0 100 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 30C20 10 60 0 90 30C60 60 20 50 10 30Z" fill="#FF9F43" />
          <circle cx="75" cy="20" r="5" fill="black" />
          <path d="M0 30C5 25 10 30 10 30C10 30 5 35 0 30Z" fill="#FF9F43" />
        </svg>
      </div>

      {/* Texte à l'envers */}
      <div className="absolute bottom-20 left-20 transform rotate-180">
        <p className="text-lg font-bold text-purple-600">Bienvenue !</p>
      </div>
    </div>
  );
};

export default AprilDecoration;
