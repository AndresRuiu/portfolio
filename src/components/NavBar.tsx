import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATOS } from "@/data/resumen";
import { cn } from "@/lib/utils";
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-2">
      {/* Desktop version */}
      <motion.div 
        className="hidden md:block"
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto flex h-[58px] gap-1 rounded-2xl border p-2 backdrop-blur-md"
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
        {DATOS.navegacion.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <motion.div
                className="flex cursor-pointer items-center justify-center rounded-full h-10 min-w-[40px]"
                animate={{
                  width: (hoveredItem === item.href || isActive(item.href)) ? "auto" : 40,
                  paddingLeft: (hoveredItem === item.href || isActive(item.href)) ? 16 : 0,
                  paddingRight: (hoveredItem === item.href || isActive(item.href)) ? 16 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center justify-center gap-2 h-full w-full rounded-full hover:bg-accent transition-colors duration-200 px-3",
                    isActive(item.href) && "bg-accent"
                  )}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <AnimatePresence mode="wait">
                    {hoveredItem === item.href || isActive(item.href) ? (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="size-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className={cn("md:hidden", (hoveredItem === item.href || isActive(item.href)) && "hidden")}>{item.label}</TooltipContent>
          </Tooltip>
        ))}

        <Separator orientation="vertical" className="mx-1 h-8" />

        {Object.entries(DATOS.contacto.social)
          .filter(([, social]) => social.navbar)
          .map(([name, social]) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <div className="flex aspect-square cursor-pointer items-center justify-center rounded-full w-10 h-10">
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-full w-full rounded-full hover:bg-accent transition-colors duration-200"
                  >
                    {React.createElement(social.icon, { className: "size-5" })}
                  </a>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{name}</TooltipContent>
            </Tooltip>
          ))}

        <Separator orientation="vertical" className="mx-1 h-8" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex aspect-square cursor-pointer items-center justify-center rounded-full w-10 h-10">
              <ModeToggle />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Theme</TooltipContent>
        </Tooltip>
        </motion.div>
      </motion.div>
      
      {/* Mobile version */}
      <div className="md:hidden">
        <div className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto flex h-[58px] gap-2 rounded-2xl border p-2 backdrop-blur-md">
        {DATOS.navegacion.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <div className="flex aspect-square cursor-pointer items-center justify-center rounded-full w-10 h-10">
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center justify-center h-full w-full rounded-full hover:bg-accent transition-colors duration-200",
                    isActive(item.href) && "bg-accent"
                  )}
                >
                  <item.icon className="size-5" />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.label}</TooltipContent>
          </Tooltip>
        ))}

        <Separator orientation="vertical" className="mx-1 h-8" />

        {Object.entries(DATOS.contacto.social)
          .filter(([, social]) => social.navbar)
          .map(([name, social]) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <div className="flex aspect-square cursor-pointer items-center justify-center rounded-full w-10 h-10">
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-full w-full rounded-full hover:bg-accent transition-colors duration-200"
                  >
                    {React.createElement(social.icon, { className: "size-5" })}
                  </a>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{name}</TooltipContent>
            </Tooltip>
          ))}

        <Separator orientation="vertical" className="mx-1 h-8" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex aspect-square cursor-pointer items-center justify-center rounded-full w-10 h-10">
              <ModeToggle />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">Theme</TooltipContent>
        </Tooltip>
        </div>
      </div>
    </div>
  );
}