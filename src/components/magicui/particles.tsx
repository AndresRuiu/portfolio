"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Extend Window interface for timeout properties
declare global {
  interface Window {
    particleResizeTimeout?: NodeJS.Timeout;
  }
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  smooth: number;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  size?: number;
  fullPage?: boolean; // New prop for full page coverage
}

export default function Particles({
  className,
  quantity = 50,
  staticity = 50,
  ease = 50,
  refresh,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  size = 2,
  fullPage = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    
    // Add event listeners - only for actual window resize, NOT scroll
    const handleResize = () => {
      clearTimeout(window.particleResizeTimeout);
      window.particleResizeTimeout = setTimeout(initCanvas, 150);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.particleResizeTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullPage]);

  useEffect(() => {
    onMouseMove();
  }, []);

  useEffect(() => {
    initCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.current.x - rect.left - w / 2;
      const y = mousePosition.current.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      
      // For full page coverage, use viewport dimensions only (fixed positioning)
      if (fullPage) {
        canvasSize.current.w = window.innerWidth;
        canvasSize.current.h = window.innerHeight;
      } else {
        canvasSize.current.w = canvasContainerRef.current.offsetWidth;
        canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      }
      
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = canvasSize.current.w + "px";
      canvasRef.current.style.height = canvasSize.current.h + "px";
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const canvas = canvasSize.current;
    const canvasW = canvas.w;
    const canvasH = canvas.h;

    // Enhanced particle positioning for better distribution
    const x = Math.random() * canvasW;
    const y = Math.random() * canvasH; // Always use canvas height (viewport for fullPage)
    
    const translateX = 0;
    const translateY = 0;
    
    // Varied particle sizes for visual interest
    const sizeVariation = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
    const particleSize = size * sizeVariation;
    
    const alpha = 0;
    // Enhanced alpha for better visibility based on size
    const baseAlpha = 0.3 + (sizeVariation * 0.4); // Larger particles more visible
    const targetAlpha = parseFloat((Math.random() * baseAlpha + 0.2).toFixed(2));
    
    // Enhanced movement for full page coverage
    const moveMultiplier = fullPage ? 0.3 : 0.6;
    const dx = (Math.random() - 0.5) * moveMultiplier + vx;
    const dy = (Math.random() - 0.5) * moveMultiplier + vy;
    
    const magnetism = 0.1 + Math.random() * 0.3;
    const smooth = 0.03 + Math.random() * 0.12;

    return {
      x,
      y,
      translateX,
      translateY,
      size: particleSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      smooth,
    };
  };

  const drawCircle = (circle: Circle, update = false) => {
    const { x, y, translateX, translateY, size, alpha } = circle;
    if (context.current) {
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      
      // Enhanced color handling with better visibility and theme support
      let fillColor = color;
      let rgb: number[] = [107, 114, 128]; // Default gray
      
      if (color.startsWith('hsl(')) {
        // Convert HSL to RGB for canvas
        const hslMatch = color.match(/hsl\(([^)]+)\)/);
        if (hslMatch) {
          const [h, s, l] = hslMatch[1].split(',').map(v => parseFloat(v));
          rgb = hslToRgb(h, s, l);
        }
      } else if (color.startsWith('#')) {
        // Hexadecimal color
        rgb = hexToRgb(color);
      } else if (color.startsWith('rgb')) {
        // RGB color
        const rgbMatch = color.match(/rgb\(([^)]+)\)/);
        if (rgbMatch) {
          rgb = rgbMatch[1].split(',').map(v => parseInt(v.trim()));
        }
      }
      
      // Enhanced alpha calculation for better visibility
      const enhancedAlpha = Math.max(alpha * 0.8, 0.1); // Minimum visibility
      fillColor = `rgba(${rgb.join(', ')}, ${enhancedAlpha})`;
      
      // Add subtle glow effect for better visibility
      context.current.shadowColor = fillColor;
      context.current.shadowBlur = size * 0.5;
      context.current.fillStyle = fillColor;
      context.current.fill();
      
      // Reset shadow
      context.current.shadowColor = 'transparent';
      context.current.shadowBlur = 0;
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  // Función para convertir HSL a RGB
  const hslToRgb = (h: number, s: number, l: number): number[] => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  // Función para convertir hexadecimal a RGB
  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [107, 114, 128]; // Color por defecto gris
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 && remapped < 1 ? remapped : value;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];

      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 50, 0, 1).toFixed(2) // Aumentado el rango de 20 a 50
      );

      if (remapClosestEdge < 1) {
        circle.alpha += 0.03; // Más rápido para aparecer
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha -= circle.smooth * 0.5; // Más lento para desaparecer
        if (circle.alpha < 0.1) { // Mínimo de opacidad más alto
          circle.alpha = 0.1;
        }
      }

      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        drawCircle(circleParams());
      } else {
        drawCircle(circle, true);
      }
    });
    requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mousePosition.current.x = e.clientX;
    mousePosition.current.y = e.clientY;
  };

  return (
    <div 
      className={cn(
        fullPage 
          ? "fixed inset-0 pointer-events-none z-0" 
          : "absolute inset-0", 
        className
      )} 
      ref={canvasContainerRef}
      style={fullPage ? { 
        width: '100vw', 
        height: '100vh',
        top: 0,
        left: 0,
        position: 'fixed'
      } : undefined}
    >
      <canvas
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        className={cn(
          "w-full h-full",
          fullPage && "pointer-events-none"
        )}
        style={fullPage ? {
          width: '100vw',
          height: '100vh'
        } : undefined}
      />
    </div>
  );
}
