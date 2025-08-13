import { Icons } from "@/components/ui/icons";
import React from "react";

type IconName = keyof typeof Icons;

export const getIcon = (iconName: string | React.ReactElement, props?: any) => {
  // Si ya es un elemento React, lo devolvemos tal como está
  if (React.isValidElement(iconName)) {
    return iconName;
  }
  
  // Si es string, intentamos resolverlo a un ícono
  if (typeof iconName === 'string' && iconName in Icons) {
    return React.createElement(Icons[iconName as IconName], props);
  }
  
  return null;
};

export const isValidIcon = (iconName: string): iconName is IconName => {
  return iconName in Icons;
};