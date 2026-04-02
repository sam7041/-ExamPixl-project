import React, { createContext, useContext, useState } from 'react';

interface FileContextType {
  droppedFiles: File[];
  setDroppedFiles: (files: File[]) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  return (
    <FileContext.Provider value={{ droppedFiles, setDroppedFiles }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
}
