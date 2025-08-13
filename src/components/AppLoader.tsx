import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Rocket, Zap } from 'lucide-react';

interface AppLoaderProps {
  isLoading?: boolean;
  minLoadTime?: number; // Tiempo mínimo de loading para evitar flashes
}

export const AppLoader: React.FC<AppLoaderProps> = ({ 
  isLoading = true, 
  minLoadTime = 1000 
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { icon: Code2, text: "Cargando componentes...", color: "text-blue-500" },
    { icon: Zap, text: "Optimizando rendimiento...", color: "text-yellow-500" },
    { icon: Rocket, text: "Preparando experiencia...", color: "text-green-500" },
  ];

  useEffect(() => {
    if (!isLoading) {
      // Esperar tiempo mínimo antes de ocultar el loader
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, minLoadTime);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [isLoading, minLoadTime]);

  // Simulación de progreso realista
  useEffect(() => {
    if (!showLoader) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Progreso más lento al final para simular carga realista
        const increment = prev < 50 ? 8 : prev < 80 ? 4 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [showLoader]);

  // Cambio de pasos basado en el progreso
  useEffect(() => {
    if (progress < 30) setCurrentStep(0);
    else if (progress < 70) setCurrentStep(1);
    else setCurrentStep(2);
  }, [progress]);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      >
        {/* Fondo con gradiente animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
          animate={{ 
            background: [
              "linear-gradient(45deg, rgb(59 130 246 / 0.05), transparent, rgb(168 85 247 / 0.05))",
              "linear-gradient(135deg, rgb(168 85 247 / 0.05), transparent, rgb(59 130 246 / 0.05))",
              "linear-gradient(225deg, rgb(59 130 246 / 0.05), transparent, rgb(168 85 247 / 0.05))",
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Contenedor principal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center space-y-8 p-8"
        >
          {/* Logo/Icono principal */}
          <motion.div
            className="relative"
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            
            {/* Anillos animados alrededor del logo */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-secondary/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Andrés Ruiu
            </h1>
            <p className="text-muted-foreground text-sm">Desarrollador Full Stack</p>
          </motion.div>

          {/* Paso actual con icono animado */}
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`${loadingSteps[currentStep].color}`}
            >
              {React.createElement(loadingSteps[currentStep].icon, { className: "w-5 h-5" })}
            </motion.div>
            <span className="text-sm text-muted-foreground">
              {loadingSteps[currentStep].text}
            </span>
          </motion.div>

          {/* Barra de progreso moderna */}
          <div className="w-80 max-w-sm space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              {/* Fondo con shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Barra de progreso principal */}
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Efecto de brillo en la barra */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-50, 100] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Puntos de carga decorativos */}
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary/40 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ 
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Partículas flotantes de fondo */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

// Hook para manejar el estado de loading de la app
export const useAppLoader = (initialLoading = true) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const finishLoading = () => {
    setIsLoading(false);
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  return {
    isLoading,
    finishLoading,
    startLoading,
  };
};

export default AppLoader;