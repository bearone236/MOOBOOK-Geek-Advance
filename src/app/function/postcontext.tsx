'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PoseContextType {
  pose: string;
  setPose: React.Dispatch<React.SetStateAction<string>>;
  resetPose: () => void;
}

export const PoseContext = createContext<PoseContextType | undefined>(undefined);

export const usePose = (): PoseContextType => {
  const context = useContext(PoseContext);
  if (!context) {
    throw new Error('usePose must be used within a PoseProvider');
  }
  return context;
};

interface PoseProviderProps {
  children: ReactNode;
}

export const PoseProvider: React.FC<PoseProviderProps> = ({ children }) => {
  const [pose, setPose] = useState<string>('');

  const resetPose = () => {
    setPose('');
    console.log(pose);
    console.log("リセットされました")
    console.log("-------------------------------")
  };

  const contextValue: PoseContextType = {
    pose,
    setPose,
    resetPose,
  };

  return <PoseContext.Provider value={contextValue}>{children}</PoseContext.Provider>;
};
