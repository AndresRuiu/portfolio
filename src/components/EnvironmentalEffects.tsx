import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

interface EnvironmentalEffectsProps {
  intensity?: number;
  enableDistortionField?: boolean;
  enableQuantumFluctuations?: boolean;
  enableEnergyWaves?: boolean;
}

export default function EnvironmentalEffects({
  intensity = 0.5,
  enableDistortionField = true,
  enableQuantumFluctuations = true,
  enableEnergyWaves = false
}: EnvironmentalEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quantumDotsRef = useRef<HTMLDivElement[]>([]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Crear campo de distorsión
  useGSAP(() => {
    if (!enableDistortionField || prefersReducedMotion || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    // Crear grid de distorsión
    const gridSize = 20;
    const distortionField = document.createElement('div');
    distortionField.className = 'distortion-field';
    distortionField.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: ${intensity * 0.3};
    `;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const dot = document.createElement('div');
        dot.className = 'distortion-dot';
        dot.style.cssText = `
          position: absolute;
          width: 2px;
          height: 2px;
          background: hsl(var(--primary));
          border-radius: 50%;
          left: ${(j / gridSize) * 100}%;
          top: ${(i / gridSize) * 100}%;
          opacity: 0.1;
          transition: all 0.3s ease;
        `;
        
        distortionField.appendChild(dot);

        // Animación de distorsión individual
        gsap.to(dot, {
          x: gsap.utils.random(-10, 10),
          y: gsap.utils.random(-10, 10),
          scale: gsap.utils.random(0.5, 2),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: gsap.utils.random(0, 2)
        });
      }
    }

    container.appendChild(distortionField);
    // distortionFieldRef.current = distortionField; // Read-only, mantener referencia en variable local

    // Efecto de ondas al mover el mouse
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const distanceX = (clientX - centerX) / centerX;
      const distanceY = (clientY - centerY) / centerY;
      
      gsap.to(distortionField, {
        rotationX: distanceY * 5,
        rotationY: distanceX * 5,
        duration: 1,
        ease: "power2.out"
      });
      
      // Crear ondas de distorsión
      const dots = distortionField.querySelectorAll('.distortion-dot');
      dots.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        const dotCenterX = rect.left + rect.width / 2;
        const dotCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          (clientX - dotCenterX) ** 2 + (clientY - dotCenterY) ** 2
        );
        
        if (distance < 100) {
          const waveStrength = (100 - distance) / 100;
          gsap.to(dot, {
            scale: 1 + waveStrength * intensity,
            opacity: 0.1 + waveStrength * 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (distortionField.parentNode) {
        distortionField.parentNode.removeChild(distortionField);
      }
    };
  }, [enableDistortionField, intensity, prefersReducedMotion, isMobile]);

  // Crear fluctuaciones cuánticas
  useGSAP(() => {
    if (!enableQuantumFluctuations || prefersReducedMotion || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    // Crear partículas cuánticas
    const particleCount = 15;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'quantum-particle';
      particle.style.cssText = `
        position: fixed;
        width: ${gsap.utils.random(1, 3)}px;
        height: ${gsap.utils.random(1, 3)}px;
        background: hsl(var(--primary));
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        opacity: ${intensity * 0.6};
        box-shadow: 0 0 ${gsap.utils.random(5, 15)}px hsl(var(--primary));
      `;

      // Posición inicial aleatoria
      gsap.set(particle, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight)
      });

      container.appendChild(particle);
      particles.push(particle);
      quantumDotsRef.current.push(particle);

      // Animación de fluctuación cuántica
      const tl = gsap.timeline({ repeat: -1 });
      
      tl.to(particle, {
        x: `+=${gsap.utils.random(-200, 200)}`,
        y: `+=${gsap.utils.random(-200, 200)}`,
        duration: gsap.utils.random(3, 8),
        ease: "power2.inOut"
      });
      
      tl.to(particle, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: "power2.in"
      });
      
      tl.set(particle, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight),
        opacity: intensity * 0.6,
        scale: 1
      });

      // Efecto de túnel cuántico aleatorio
      gsap.delayedCall(gsap.utils.random(5, 15), () => {
        gsap.to(particle, {
          x: gsap.utils.random(0, window.innerWidth),
          y: gsap.utils.random(0, window.innerHeight),
          duration: 0.1,
          ease: "power4.out"
        });
      });
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [enableQuantumFluctuations, intensity, prefersReducedMotion, isMobile]);

  // Crear ondas de energía
  useGSAP(() => {
    if (!enableEnergyWaves || prefersReducedMotion || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const waveContainer = document.createElement('div');
    waveContainer.className = 'energy-waves';
    waveContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      pointer-events: none;
      z-index: 1;
    `;

    // Crear múltiples ondas concéntricas
    for (let i = 0; i < 5; i++) {
      const wave = document.createElement('div');
      wave.className = 'energy-wave';
      wave.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border: 2px solid hsl(var(--primary));
        border-radius: 50%;
        opacity: ${(5 - i) * 0.1 * intensity};
      `;

      waveContainer.appendChild(wave);

      // Animación de expansión de onda
      gsap.to(wave, {
        scale: 10 + i * 2,
        opacity: 0,
        duration: 4 + i * 0.5,
        ease: "power2.out",
        repeat: -1,
        delay: i * 0.5
      });
    }

    container.appendChild(waveContainer);
    // energyWaveRef.current = waveContainer; // Read-only, mantener referencia local

    return () => {
      if (waveContainer.parentNode) {
        waveContainer.parentNode.removeChild(waveContainer);
      }
    };
  }, [enableEnergyWaves, intensity, prefersReducedMotion, isMobile]);

  // Efecto de pulso ambiental
  useGSAP(() => {
    if (prefersReducedMotion || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    // Crear pulso de fondo sutil
    gsap.to(container, {
      filter: `brightness(${1 + intensity * 0.1}) saturate(${1 + intensity * 0.2})`,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });

  }, [intensity, prefersReducedMotion, isMobile]);

  if (prefersReducedMotion || isMobile) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="environmental-effects"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}