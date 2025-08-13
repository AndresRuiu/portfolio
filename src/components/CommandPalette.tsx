import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Sun, 
  Moon, 
  Monitor,
  Mail,
  Phone,
  Github,
  Linkedin,
  Download,
  Check
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useNotifications } from '@/hooks/useNotifications';
import { DATOS } from '@/data/resumen';

interface CommandItem {
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  shortcut?: string;
}

interface CommandGroup {
  group: string;
  items: CommandItem[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { success, error } = useNotifications();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      success(`${label} copiado al portapapeles`, text);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      error('Error al copiar', 'No se pudo copiar al portapapeles');
    }
  };

  const commands: CommandGroup[] = [
    // Navegación
    {
      group: 'Navegación',
      items: [
        {
          label: 'Inicio',
          icon: Home,
          action: () => navigate('/'),
          shortcut: '⌘+H',
        },
        {
          label: 'Proyectos',
          icon: Briefcase,
          action: () => navigate('/proyectos'),
          shortcut: '⌘+P',
        },
        {
          label: 'Servicios',
          icon: User,
          action: () => navigate('/servicios'),
          shortcut: '⌘+S',
        },
        {
          label: 'Educación',
          icon: GraduationCap,
          action: () => navigate('/educacion'),
          shortcut: '⌘+E',
        },
      ],
    },
    // Tema
    {
      group: 'Apariencia',
      items: [
        {
          label: 'Tema Claro',
          icon: Sun,
          action: () => {
            setTheme('light');
            success('Tema cambiado', 'Tema claro activado');
          },
        },
        {
          label: 'Tema Oscuro',
          icon: Moon,
          action: () => {
            setTheme('dark');
            success('Tema cambiado', 'Tema oscuro activado');
          },
        },
        {
          label: 'Tema Sistema',
          icon: Monitor,
          action: () => {
            setTheme('system');
            success('Tema cambiado', 'Siguiendo configuración del sistema');
          },
        },
      ],
    },
    // Contacto
    {
      group: 'Contacto',
      items: [
        {
          label: 'Copiar Email',
          icon: copied === 'Email' ? Check : Mail,
          action: () => copyToClipboard(DATOS.contacto.email, 'Email'),
        },
        {
          label: 'Copiar Teléfono',
          icon: copied === 'Teléfono' ? Check : Phone,
          action: () => copyToClipboard(DATOS.contacto.tel, 'Teléfono'),
        },
        {
          label: 'GitHub',
          icon: Github,
          action: () => {
            window.open(DATOS.contacto.social.GitHub.url, '_blank');
            success('Abriendo GitHub', 'Redirigiendo a mi perfil de GitHub');
          },
        },
        {
          label: 'LinkedIn',
          icon: Linkedin,
          action: () => {
            window.open(DATOS.contacto.social.LinkedIn.url, '_blank');
            success('Abriendo LinkedIn', 'Redirigiendo a mi perfil de LinkedIn');
          },
        },
      ],
    },
    // Acciones
    {
      group: 'Acciones',
      items: [
        {
          label: 'Descargar CV',
          icon: Download,
          action: () => {
            const link = document.createElement('a');
            link.href = '/CV-Andres-Ruiu.pdf';
            link.download = 'CV-Andres-Ruiu.pdf';
            link.click();
            success('Descargando CV', 'El archivo se está descargando');
          },
          shortcut: '⌘+D',
        },
      ],
    },
  ];

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Command className="rounded-2xl border shadow-2xl bg-background">
            <Command.Input 
              placeholder="Buscar comandos... (Escape para cerrar)" 
              className="px-4 py-3 text-lg border-none outline-none bg-transparent placeholder:text-muted-foreground"
            />
            <Command.List className="max-h-80 overflow-y-auto">
              <Command.Empty>
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <Search className="w-8 h-8" />
                  <p>No se encontraron comandos</p>
                </div>
              </Command.Empty>
              
              {commands.map((group, groupIndex) => (
                <React.Fragment key={group.group}>
                  <Command.Group>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/50">
                      {group.group}
                    </div>
                    {group.items.map((item, itemIndex) => (
                      <Command.Item
                        key={item.label}
                        onSelect={() => {
                          item.action();
                          onOpenChange(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 data-[selected=true]:bg-accent"
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: itemIndex * 0.03 }}
                          className="flex items-center gap-3 flex-1"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </motion.div>
                        {item.shortcut && (
                          <motion.kbd
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: itemIndex * 0.03 + 0.1 }}
                            className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                          >
                            {item.shortcut}
                          </motion.kbd>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                  {groupIndex < commands.length - 1 && (
                    <div className="border-b border-border/20" />
                  )}
                </React.Fragment>
              ))}
            </Command.List>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook para controlar el Command Palette
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K o Ctrl+K para abrir
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
};