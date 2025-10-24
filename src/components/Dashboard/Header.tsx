// Arquivo: src/components/Dashboard/Header.tsx
import React from 'react';
import logo from "../../assets/images/icon.png"

export default function Header() {
  return (
    <header className="flex h-16 items-center bg-red-800 px-6 text-white shadow-md">
      <div className="flex items-center gap-3">
        <img src={logo} alt="HemogloVida Logo" className="h-8 w-auto" />
        <span className="text-xl font-bold">HemogloVida</span>
      </div>
    </header>
  );
}