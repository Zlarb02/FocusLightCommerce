import React from "react";

export const JulyDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Soleil dans le coin supérieur */}
      <div className="absolute top-5 right-5">
        <div className="w-16 h-16 bg-yellow-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-yellow-400 rounded-full opacity-50"></div>
        </div>
        {/* Rayons de soleil */}
        <div className="absolute top-8 -left-6 w-6 h-1 bg-yellow-400 opacity-70"></div>
        <div className="absolute top-8 -right-6 w-6 h-1 bg-yellow-400 opacity-70"></div>
        <div className="absolute -top-6 left-8 w-1 h-6 bg-yellow-400 opacity-70"></div>
        <div className="absolute -bottom-6 left-8 w-1 h-6 bg-yellow-400 opacity-70"></div>
        <div className="absolute top-4 -left-4 transform -rotate-45 w-6 h-1 bg-yellow-400 opacity-70"></div>
        <div className="absolute bottom-4 -left-4 transform rotate-45 w-6 h-1 bg-yellow-400 opacity-70"></div>
        <div className="absolute top-4 -right-4 transform rotate-45 w-6 h-1 bg-yellow-400 opacity-70"></div>
        <div className="absolute bottom-4 -right-4 transform -rotate-45 w-6 h-1 bg-yellow-400 opacity-70"></div>
      </div>

      {/* Palmiers décoratifs */}
      <div className="absolute bottom-0 left-10">
        <div className="w-4 h-20 bg-yellow-800 rounded-t-sm"></div>
        <div className="absolute -top-2 -left-8 w-12 h-3 bg-green-500 rounded-full transform -rotate-30"></div>
        <div className="absolute -top-4 -left-10 w-14 h-3 bg-green-500 rounded-full transform -rotate-20"></div>
        <div className="absolute -top-6 -left-12 w-16 h-3 bg-green-500 rounded-full transform -rotate-10"></div>
        <div className="absolute -top-2 left-0 w-12 h-3 bg-green-500 rounded-full transform rotate-30"></div>
        <div className="absolute -top-4 left-0 w-14 h-3 bg-green-500 rounded-full transform rotate-20"></div>
        <div className="absolute -top-6 left-0 w-16 h-3 bg-green-500 rounded-full transform rotate-10"></div>
      </div>

      <div className="absolute bottom-0 right-20">
        <div className="w-4 h-24 bg-yellow-800 rounded-t-sm"></div>
        <div className="absolute -top-2 -left-8 w-12 h-3 bg-green-500 rounded-full transform -rotate-30"></div>
        <div className="absolute -top-4 -left-10 w-14 h-3 bg-green-500 rounded-full transform -rotate-20"></div>
        <div className="absolute -top-6 -left-12 w-16 h-3 bg-green-500 rounded-full transform -rotate-10"></div>
        <div className="absolute -top-2 left-0 w-12 h-3 bg-green-500 rounded-full transform rotate-30"></div>
        <div className="absolute -top-4 left-0 w-14 h-3 bg-green-500 rounded-full transform rotate-20"></div>
        <div className="absolute -top-6 left-0 w-16 h-3 bg-green-500 rounded-full transform rotate-10"></div>
      </div>

      {/* Cercle "SOLDES" */}
      <div className="absolute top-20 left-20">
        <div className="w-16 h-16 flex items-center justify-center bg-red-500 rounded-full animate-pulse text-white font-bold border-2 border-white shadow-lg">
          <div className="-rotate-12">SOLDES</div>
        </div>
      </div>

      {/* Mentions "Jusqu'à -50%" */}
      <div className="absolute top-40 right-20">
        <div className="bg-yellow-400 px-3 py-1 rounded-md text-red-600 font-bold transform rotate-6 shadow-md border border-red-600">
          Jusqu'à -50%
        </div>
      </div>
    </div>
  );
};

export default JulyDecoration;
