import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { DATOS } from '@/data/resumen';
import ContactModal from '@/components/ContactModal';

const Footer: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Obtener la fecha del último commit de la API de GitHub
  useEffect(() => {
    const fetchLastCommitDate = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/AndresRuiu/portfolio/commits/main');
        const data = await response.json();
        
        if (data.commit && data.commit.author && data.commit.author.date) {
          const commitDate = new Date(data.commit.author.date);
          const formattedDate = formatDateInSpanish(commitDate);
          setLastUpdateDate(formattedDate);
        } else {
          // Fallback a fecha actual si no se puede obtener del API
          setLastUpdateDate(formatDateInSpanish(new Date()));
        }
      } catch (error) {
        // Fallback a fecha actual si hay error
        console.error('Error fetching last commit date:', error);
        setLastUpdateDate(formatDateInSpanish(new Date()));
      }
    };

    fetchLastCommitDate();
  }, []);

  const formatDateInSpanish = (date: Date) => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  };

  return (
    <>
      <footer className="w-full bg-background/95 backdrop-blur-sm border-t border-border/50 mt-auto z-30 relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
            {/* Copyright y políticas */}
            <div className="flex flex-col sm:flex-row items-center gap-4 order-2 lg:order-1">
              <span className="text-center sm:text-left">© 2025 {DATOS.nombre}</span>
              <div className="flex items-center gap-3 text-xs">
                <button className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                  Términos y Condiciones
                </button>
                <span className="text-muted-foreground/50">•</span>
                <button className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                  Política de Privacidad
                </button>
              </div>
            </div>

            {/* Información de contacto para páginas secundarias */}
            {!isHomePage && (
              <div className="flex flex-col sm:flex-row items-center gap-4 order-1 lg:order-2">
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg hover:text-foreground transition-all duration-200 group"
                  title="Abrir formulario de contacto"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Contactar</span>
                </button>
                <a 
                  href={`https://wa.me/54${DATOS.contacto.tel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg hover:text-foreground transition-all duration-200 group"
                  title="Contactar por WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium hidden xs:inline">WhatsApp</span>
                  <span className="font-medium xs:hidden">WA</span>
                </a>
              </div>
            )}

            {/* Fecha de última actualización */}
            <div className="text-xs text-muted-foreground/70 order-3">
              Actualizado: {lastUpdateDate || 'Cargando...'}
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        prefilledSubject="Consulta desde el portfolio"
      />
    </>
  );
};

export default Footer;