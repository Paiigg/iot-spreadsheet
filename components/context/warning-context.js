"use client";

import { createContext, useContext, useState } from "react";

const WarningContext = createContext();

export function WarningWrapper({ children }) {
  const [warningMessage, setWarningMessage] = useState([]);
  return (
    <WarningContext.Provider value={{ warningMessage, setWarningMessage }}>
      {children}
    </WarningContext.Provider>
  );
}

export function useWarningContext() {
  return useContext(WarningContext);
}
