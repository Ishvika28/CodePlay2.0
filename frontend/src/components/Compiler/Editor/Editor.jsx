import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";

function Editor({ code, setCode, language, readOnly }) {

  return (
    <div className="w-full h-full">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16 }
        }}
      />
    </div>
  );
}

export default Editor;