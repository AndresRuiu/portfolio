import React from 'react';
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATOS } from "@/data/resumen";
import { cn } from "@/lib/utils";
import { To, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (href: To) => {
    navigate(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-2">
      <Dock>
        {DATOS.navegacion.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <DockIcon>
                <button 
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "hover:bg-accent"
                  )}
                >
                  <item.icon className="size-5" />
                </button>
              </DockIcon>
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.label}</TooltipContent>
          </Tooltip>
        ))}

        <Separator orientation="vertical" className="mx-2 h-8" />

        {Object.entries(DATOS.contacto.social)
          .filter(([, social]) => social.navbar)
          .map(([name, social]) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <DockIcon>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "hover:bg-accent"
                    )}
                  >
                    {React.createElement(social.icon, { className: "size-5" })}
                  </a>
                </DockIcon>
              </TooltipTrigger>
              <TooltipContent side="bottom">{name}</TooltipContent>
            </Tooltip>
          ))}

        <Separator orientation="vertical" className="mx-2 h-8" />

        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon>
              <ModeToggle />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent side="bottom">Theme</TooltipContent>
        </Tooltip>
      </Dock>
    </div>
  );
}