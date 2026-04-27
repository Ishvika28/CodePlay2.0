import { useState } from "react";

function LanguageSelector({ language, setLanguage, disabled }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-400">Language:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        disabled={disabled}
        className={`bg-gray-800 text-gray-100 text-sm rounded-md px-3 py-1.5 border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-700"
        }`}
      >
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>
    </div>
  );
}

export default LanguageSelector;