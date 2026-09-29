import React, { createContext, useContext, useState } from "react";

const DetailPanelContext = createContext(null);

export const DetailPanelProvider = ({ children }) => {
  const [panelData, setPanelData] = useState(null);

  const openPanel = (customer) => {
    setPanelData(customer);
  };

  const closePanel = () => {
    setPanelData(null);
  };

  return (
    <DetailPanelContext.Provider
      value={{
        panelData,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </DetailPanelContext.Provider>
  );
};

export const useDetailPanel = () => {
  const context = useContext(DetailPanelContext);

  if (!context) {
    throw new Error(
      "useDetailPanel must be used inside a <DetailPanelProvider>"
    );
  }

  return context;
};
