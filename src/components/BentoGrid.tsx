import React from 'react';
import { motion } from 'framer-motion';
import type { Project, BentoGridItem } from '../types';
import { 
  Code2, 
  Rocket, 
  Palette, 
  Database, 
  Globe, 
  Smartphone,
  GitBranch,
  Coffee,
  Clock,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DATOS } from '@/data/resumen';

interface BentoCardProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ className, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ 
      duration: 0.5, 
      delay,
      type: "spring",
      stiffness: 100,
      damping: 10
    }}
    className={cn(
      "relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300",
      className
    )}
  >
    {children}
  </motion.div>
);

// Componente para el grid principal
export const BentoGrid: React.FC = () => {
  const stats = {
    projectsCount: DATOS.proyectos.length,
    activeProjects: DATOS.proyectos.filter((p: Project) => p.activo).length,
    technologiesCount: Array.from(new Set(DATOS.proyectos.flatMap((p: Project) => p.tecnologias))).length,
    experienceYears: new Date().getFullYear() - 2022, // Desde que empezaste programación
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {/* Card principal - Presentación */}
      <BentoCard className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-slate-500/10" delay={0.1}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Andrés Ruiu</h3>
                <p className="text-muted-foreground">Desarrollador Full Stack</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Transformando ideas en experiencias digitales excepcionales. 
              Especializado en desarrollo web moderno con React, TypeScript y Node.js.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Disponible para proyectos
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Proyectos activos */}
      <BentoCard className="bg-gradient-to-br from-green-500/20 to-emerald-500/10" delay={0.2}>
        <div className="text-center">
          <Rocket className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.activeProjects}
          </div>
          <p className="text-sm text-muted-foreground">Proyectos Activos</p>
        </div>
      </BentoCard>

      {/* Total de proyectos */}
      <BentoCard className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10" delay={0.3}>
        <div className="text-center">
          <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.projectsCount}
          </div>
          <p className="text-sm text-muted-foreground">Proyectos Totales</p>
        </div>
      </BentoCard>

      {/* Stack tecnológico */}
      <BentoCard className="lg:col-span-2 bg-gradient-to-br from-purple-500/20 to-pink-500/10" delay={0.4}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-6 h-6 text-purple-500" />
            <h3 className="font-semibold">Stack Tecnológico</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Frontend</h4>
              <div className="space-y-1">
                <div className="text-sm">React & TypeScript</div>
                <div className="text-sm">Next.js & Tailwind</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Backend</h4>
              <div className="space-y-1">
                <div className="text-sm">Node.js & Express</div>
                <div className="text-sm">MongoDB & PostgreSQL</div>
              </div>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Tecnologías dominadas */}
      <BentoCard className="bg-gradient-to-br from-orange-500/20 to-red-500/10" delay={0.5}>
        <div className="text-center">
          <Database className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats.technologiesCount}+
          </div>
          <p className="text-sm text-muted-foreground">Tecnologías</p>
        </div>
      </BentoCard>

      {/* Años de experiencia */}
      <BentoCard className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10" delay={0.6}>
        <div className="text-center">
          <Clock className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.experienceYears}+
          </div>
          <p className="text-sm text-muted-foreground">Años Programando</p>
        </div>
      </BentoCard>

      {/* Enfoque en calidad */}
      <BentoCard className="lg:col-span-2 bg-gradient-to-br from-teal-500/20 to-green-500/10" delay={0.7}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-teal-500" />
            <h3 className="font-semibold">Enfoque en Calidad</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-teal-500" />
              <span className="text-sm">Clean Code</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-500" />
              <span className="text-sm">Responsive Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-500" />
              <span className="text-sm">UX/UI Focused</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <span className="text-sm">Performance</span>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Disponibilidad */}
      <BentoCard className="lg:col-span-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/10" delay={0.8}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold">¿Trabajamos juntos?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Siempre abierto a nuevos desafíos y oportunidades de colaboración.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Disponible inmediatamente
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="text-6xl"
            >
              👋
            </motion.div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};

// Bento Grid más compacto para secciones específicas
export const BentoGridCompact: React.FC<{
  title?: string;
  items: BentoGridItem[];
}> = ({ title, items }) => {
  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <BentoCard 
            key={item.title}
            className={cn("text-center", item.gradient)}
            delay={index * 0.1}
          >
            <item.icon className="w-6 h-6 mx-auto mb-2 text-current opacity-80" />
            <div className="text-xl font-bold mb-1">{item.value}</div>
            <div className="text-xs font-medium mb-1">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;