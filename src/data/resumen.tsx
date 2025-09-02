import { HomeIcon, NotebookIcon, Sparkles, GraduationCap } from "lucide-react";

// DEPRECADO: Este archivo ahora está migrado a Supabase
// Usar usePortfolioCompleto() desde @/hooks/usePortfolioSupabase
// Este archivo se mantiene temporalmente para compatibilidad hacia atrás

export const DATOS = {
  nombre: "Andrés Ruiu",	
  iniciales: "AR",
  url: "https://andresruiu.com",
  ubicacion: "San Miguel de Tucumán, Tucumán, Argentina",
  description: "Desarrollador Full Stack especializado en crear soluciones digitales que impulsan el crecimiento empresarial. Combino expertise técnico con visión estratégica para desarrollar aplicaciones web modernas y escalables. Actualmente liderando el desarrollo de múltiples proyectos empresariales en producción.",
  resumen: 
  "Desarrollador Full Stack con sólida formación académica y experiencia práctica comprobada en proyectos reales. Mi background en ingeniería me aporta una perspectiva analítica única para resolver problemas complejos y diseñar arquitecturas eficientes. Especializado en el stack moderno de JavaScript/TypeScript, he desarrollado aplicaciones completas para diversos sectores empresariales, desde plataformas de gestión hasta portales médicos. Próximo a graduarme como Técnico Universitario en Programación (UTN-FRT), busco oportunidades que me permitan aplicar mi experiencia en desarrollo full stack y contribuir al crecimiento tecnológico de organizaciones innovadoras.",
  urlAvatar: "/yo.webp",
  habilidades: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Nest.js",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Prisma",
    "Tailwind CSS",
    "shadcn/ui",
    "Zustand",
    "Auth.js",
    "Strapi",
    "Python",
    "Vercel",
    "Git & GitHub",
    "APIs",
    "Responsive Design"
  ],
  navegacion: [
    { href: "/", icon: HomeIcon, label: "Inicio" },
    { href: "/proyectos", icon: Sparkles, label: "Proyectos" },
    { href: "/servicios", icon: NotebookIcon, label: "Servicios" },
    { href: "/educacion", icon: GraduationCap, label: "Educación" },
  ],
  contacto: {
    email: "andresruiu@gmail.com",
    tel: "3865351958",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/AndresRuiu",
        icon: "github",
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/andrés-ruiu-b941a1103",
        icon: "linkedin",
        navbar: true,
      },
      email: {
        name: "Enviar Correo",
        url: "#",
        icon: "email",
        navbar: false,
      },
    },
  },
  servicios: [
    {
      titulo: "Desarrollo Frontend",
      descripcion: "Creo sitios web modernos que se ven geniales en cualquier dispositivo",
      icono: "🎨",
      tecnologias: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      incluye: [
        "Diseño responsivo para móvil y desktop",
        "Optimización para buscadores (SEO)",
        "Animaciones suaves y atractivas",
        "Conexión con APIs externas",
        "Código limpio y documentado"
      ],
      entregables: "Sitio web funcionando + código fuente + hosting configurado"
    },
    {
      titulo: "Desarrollo Backend",
      descripcion: "Construyo la parte invisible que hace funcionar tu aplicación",
      icono: "⚙️",
      tecnologias: ["Node.js", "NestJS", "MySQL", "MongoDB"],
      incluye: [
        "API completa para tu aplicación",
        "Base de datos bien organizada",
        "Sistema de usuarios y permisos",
        "Documentación fácil de entender",
        "Pruebas automatizadas básicas"
      ],
      entregables: "API funcionando + base de datos + documentación + servidor configurado"
    },
    {
      titulo: "Landing Pages",
      descripcion: "Páginas web que convierten visitantes en clientes de forma efectiva",
      icono: "📱",
      tecnologias: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
      incluye: [
        "Diseño enfocado en conversiones",
        "Formularios de contacto funcionales",
        "Optimización de velocidad de carga",
        "Integración con Google Analytics",
        "Adaptado a móviles perfectamente"
      ],
      entregables: "Landing page completa + hosting + formularios configurados"
    },
    {
      titulo: "Desarrollo Full Stack",
      descripcion: "La solución completa: desde la idea hasta la aplicación funcionando",
      icono: "🚀",
      tecnologias: ["React", "Next.js", "Node.js", "PostgreSQL"],
      incluye: [
        "Aplicación web completa y funcional",
        "Panel de administración sencillo",
        "Base de datos optimizada",
        "Hosting gratuito por 6 meses",
        "Soporte y actualizaciones (2 meses)"
      ],
      entregables: "Aplicación completa + código fuente + hosting + soporte inicial"
    }
  ],
  educacion: [
    {
      institucion: "Universidad Tecnológica Nacional - FRT",
      href: "https://www.frt.utn.edu.ar",
      titulo: "Estudios parciales en Ingeniería Civil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/UTN_logo.jpg",
      inicio: "2019",
      fin: "2022",
      descripcion: "Cursé tres años de Ingeniería Civil donde desarrollé habilidades analíticas y de resolución de problemas que ahora aplico en la programación.",
      estado: "Incompleto"
    },
    {
      institucion: "RollingCode School",
      href: "https://web.rollingcodeschool.com",
      titulo: "Curso Desarrollo Web Full Stack",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScahs7MB8GcE6Msj8AMnb5g16itCpVylxQRA&s",
      inicio: "Febrero 2023",
      fin: "Agosto 2023",
      descripcion: "Bootcamp intensivo donde aprendí las bases del desarrollo web moderno: HTML, CSS, JavaScript, React, Node.js y MongoDB.",
      estado: "Completado"
    },
    {
      institucion: "Universidad Tecnológica Nacional - FRT",
      href: "https://www.frt.utn.edu.ar",
      titulo: "Tecnicatura Universitaria en Programación",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/UTN_logo.jpg",
      inicio: "2023",
      fin: "2024",
      descripcion: "Carrera universitaria enfocada en programación y desarrollo de software. Actualmente en el último año.",
      estado: "En curso"
    }
  ],
  certificados: [
    {
      titulo: "Desarrollo Web Full Stack",
      institucion: "RollingCode School",
      fecha: "Agosto 2023",
      imagen: "/certificados/certificado-rolling.png",
      enlace: "#",
      tecnologias: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
      descripcion: "Certificado de finalización del bootcamp de desarrollo web full stack"
    }
  ],
  testimonios: [
    {
      nombre: "Jose Correa",
      cargo: "Bioquímico",
      empresa: "Laboratorio Saguir Correa",
      imagen: "/testimonios/jose-correa.webp",
      rating: 5,
      fecha: "Marzo 2025",
      texto: "Andrés desarrolló nuestra landing page con un resultado excepcional. El sitio es rápido, moderno y ha mejorado significativamente nuestra presencia online. Su atención al detalle y capacidad de traducir nuestras necesidades en código es impresionante.",
      proyecto: "Landing Page - Laboratorio Saguir Correa"
    }
  ],
  proyectos: [
    {
      titulo: "Andrea Buadas Gabinete - Catálogo Digital de Estética",
      fechas: "Enero 2025 - Presente",
      activo: true,
      descripcion: "Plataforma digital completa para un centro de estética y belleza que incluye catálogo de servicios y productos, sistema de reservas, integración con WhatsApp para consultas, y panel de administración con CMS. El proyecto consta de un frontend moderno desarrollado en Next.js con una experiencia de usuario elegante y un backend robusto construido con Strapi. Implementa funcionalidades avanzadas como gestión de contenido dinámico, sistema de favoritos, formularios de reserva multi-paso, y optimización SEO para búsquedas locales. Es uno de mis proyectos más ambiciosos y técnicamente desafiantes, combinando desarrollo full-stack con diseño UX/UI enfocado en conversión.",
      tecnologias: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Shadcn/ui",
        "Strapi",
        "MySQL",
        "Zustand",
        "React Hook Form",
        "Zod",
        "Radix UI",
        "Embla Carousel",
        "WhatsApp Integration",
        "SEO Optimization"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "#",
          icon: "website",
        }
      ],
      imagen: "/img/andrea-gabinete.png",
    },
    {
      titulo: "Laboratorio Saguir Correa - Portal Médico",
      fechas: "Marzo 2025 - Presente",
      activo: true,
      descripcion: "Desarrollo integral de un portal web para el prestigioso Laboratorio de Análisis Clínicos Saguir Correa. El proyecto incluye un sitio web corporativo moderno con secciones institucionales, catálogo completo de servicios médicos, portal de pacientes para consulta de resultados clínicos, sistema de autenticación seguro, formularios de contacto integrados con EmailJS, y optimización avanzada para motores de búsqueda. Implementé un diseño responsive y elegante que refleja la profesionalidad del laboratorio, utilizando las últimas tecnologías web y mejores prácticas de desarrollo. El portal cuenta con funcionalidades de accesibilidad, animaciones suaves, y una arquitectura escalable que permite futuras expansiones.",
      tecnologias: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "NextAuth.js",
        "EmailJS",
        "Motion",
        "Radix UI",
        "Lucide React",
        "Vercel Analytics",
        "SEO Optimization",
        "Responsive Design"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "https://laboratoriosaguircorrea.com.ar",
          icon: "website",
        }
      ],
      imagen: "/img/saguir-correa.png",
    },
    {
      titulo: "Resired - Plataforma de Gestión de Consorcios",
      fechas: "Junio 2024 - Julio 2024",
      activo: false,
      descripcion: "Innovadora plataforma web diseñada para revolucionar la gestión de consorcios mediante la integración de inteligencia artificial. El sistema permite a administradores e inquilinos gestionar eficientemente tareas cotidianas como el manejo de expensas, comunicaciones internas, reserva de espacios comunes y mantenimiento de instalaciones. Desarrollé un asistente de IA conversacional que proporciona respuestas instantáneas a consultas frecuentes, automatiza la generación de informes y facilita la toma de decisiones administrativas. La plataforma incluye un dashboard intuitivo, sistema de notificaciones en tiempo real, gestión de documentos digitales y herramientas de comunicación integradas que mejoran significativamente la experiencia tanto de administradores como residentes.",
      tecnologias: [
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Tailwind CSS",
        "Shadcn UI",
        "OpenAI API",
        "Vercel",
        "Auth.js"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "https://consorcio-web-theta.vercel.app",
          icon: "website",
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/consorcio-web",
          icon: "github",
        }
      ],
      imagen: "/img/resired.webp",
      video: "",
    },
    {
      titulo: "Gimnasio Palermo - Sistema de Gestión Integral",
      fechas: "Octubre 2024 - Presente",
      activo: false,
      descripcion: "Completa modernización y rediseño del sistema de gestión para Gimnasio Palermo, transformando un sistema legacy en una solución tecnológica moderna y eficiente. Desarrollé una aplicación de escritorio multiplataforma utilizando Electron que integra gestión de membresías, control de acceso, seguimiento de rutinas personalizadas, manejo de pagos y facturación, y sistema de reportes analíticos. El proyecto incluye una interfaz web complementaria para que los socios puedan consultar sus rutinas, horarios de clases y estado de pagos. Implementé una arquitectura robusta con base de datos optimizada, API RESTful con NestJS, y un sistema de notificaciones automáticas que mejora significativamente la operación diaria del gimnasio y la experiencia de los usuarios.",
      tecnologias: [
        "Electron",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "MySQL",
        "NestJS",
        "JWT Authentication",
        "Prisma ORM",
        "Node.js"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "https://gimnasio-palermo.vercel.app",
          icon: "website",
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/proyecto_gimnasio",
          icon: "github",
        }
      ],
      imagen: "/img/gimnasio-palermo.webp",
      video: "",
    },
    {
      titulo: "Dogtor - Plataforma Veterinaria Digital",
      fechas: "Agosto 2023",
      activo: false,
      descripcion: "Plataforma web integral desarrollada como proyecto final del bootcamp en RollingCode School, diseñada para revolucionar la experiencia de atención veterinaria. El sistema permite a los propietarios crear perfiles detallados para sus mascotas, incluyendo historial médico, vacunas, y datos importantes. Los usuarios pueden agendar citas online, recibir recordatorios automáticos, y acceder a un portal personalizado donde consultar el historial de consultas y tratamientos de sus mascotas. Implementé un sistema de gestión para veterinarios que incluye calendario de citas, fichas médicas digitales, y herramientas de comunicación con los propietarios. Este proyecto marcó mi transición hacia el desarrollo profesional y demostró mi capacidad para trabajar en equipo en un entorno ágil.",
      tecnologias: [
        "React",
        "Vite",
        "CSS Modules",
        "JavaScript",
        "Bootstrap",
        "Local Storage",
        "Responsive Design"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "https://dogtor.netlify.app",
          icon: "website",
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/agustincolo/ProyectoFinal-G2",
          icon: "github",
        }
      ],
      imagen: "/img/dogtor-veterinaria.webp",
      video: "",
    },
    {
      titulo: "Ristretto Coffee Shop - Experiencia Digital Inmersiva",
      fechas: "Octubre 2023 - Noviembre 2023",
      activo: false,
      descripcion: "Elegante landing page diseñada para transformar la presencia digital de una cafetería tradicional en una experiencia web moderna y atractiva. El proyecto se enfoca en crear una atmósfera visual que refleje la calidez y el ambiente acogedor de una cafetería artesanal. Implementé un diseño responsive que destaca la marca, muestra el menú de manera atractiva, e incluye información de ubicación y horarios. Utilicé imágenes generadas por IA de alta calidad para crear un catálogo visual consistente y profesional que presenta los productos de café de manera apetitosa. El sitio incluye animaciones suaves, efectos de hover interactivos, y una paleta de colores cálidos que evocan la experiencia sensorial del café, logrando aumentar significativamente el engagement y las visitas al local físico.",
      tecnologias: [
        "HTML5",
        "Tailwind CSS",
        "JavaScript",
        "CSS Animations",
        "Responsive Design",
        "AI Generated Content",
        "Performance Optimization"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "https://ristretto-coffee.netlify.app",
          icon: "website",
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/coffee-shop",
          icon: "github",
        }
      ],
      imagen: "/img/ristretto-cafe.webp",
      video: "",
    },
    {
      titulo: "CV Generator - Creador de Currículos Profesionales",
      fechas: "Diciembre 2024",
      activo: false,
      descripcion: "Aplicación web integral y sofisticada para la creación, personalización y gestión de currículos profesionales de alta calidad. La plataforma ofrece una experiencia de usuario excepcional que permite a profesionales de cualquier sector diseñar CVs impactantes y competitivos. Desarrollé un sistema completo que incluye múltiples plantillas prediseñadas, editor visual en tiempo real, gestión avanzada de secciones personalizables, sistema de temas con paletas de colores profesionales, y funcionalidad de exportación a PDF de alta resolución. La aplicación implementa guardado automático en localStorage, historial de versiones, preview interactivo, y herramientas de optimización que sugieren mejoras en el contenido. Incluye características como importación de datos desde LinkedIn, sistema de puntuación de CV, y templates específicos por industria que ayudan a los usuarios a destacar en procesos de selección.",
      tecnologias: [
        "React",
        "TypeScript",
        "Tailwind CSS", 
        "Framer Motion",
        "React PDF",
        "React Router",
        "Shadcn UI",
        "Local Storage",
        "PDF Generation"
      ],
      enlaces: [
        {
          tipo: "Sitio Web",
          href: "https://cv-generator-virid.vercel.app",
          icon: "website",
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/cv-generator",
          icon: "github",
        }
      ],
      imagen: "/img/cv-generator.webp",
      video: "",
    },
    {
      titulo: "Selector de Agentes - Herramienta de Análisis de IA",
      fechas: "Noviembre 2024",
      activo: false,
      descripcion: "Aplicación de escritorio especializada desarrollada en Python para la exploración, análisis y selección inteligente de agentes de inteligencia artificial. La herramienta está diseñada para profesionales y desarrolladores que necesitan evaluar y comparar diferentes modelos de IA para sus proyectos específicos. Implementé un sistema robusto de carga dinámica de datos que se conecta con APIs externas para obtener información actualizada sobre diversos agentes de IA, incluyendo sus capacidades, rendimiento, y casos de uso óptimos. La aplicación incluye un sistema avanzado de caché de imágenes para mejorar la performance, filtros de búsqueda personalizables, comparación lado a lado de agentes, y herramientas de análisis que ayudan a tomar decisiones informadas. La interfaz gráfica intuitiva permite una navegación fluida entre diferentes categorías de agentes y proporciona métricas detalladas de cada modelo.",
      tecnologias: [
        "Python",
        "PySide6",
        "Qt Framework",
        "HTTP Requests",
        "Magic Loops API",
        "Caching System",
        "JSON Processing",
        "Threading"
      ],
      enlaces: [
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/selector-agentes",
          icon: "github",
        }
      ],
      imagen: "/img/selector-agentes.webp",
    }
  ]
} as const;

// IMPORTANTE: Para obtener datos actualizados desde Supabase, usar:
// import { usePortfolioCompleto } from '@/hooks/usePortfolioSupabase'
// const portfolioData = usePortfolioCompleto()

// Este hook reemplaza completamente el uso de DATOS hardcodeados
// y obtiene la información personal desde la tabla 'perfil' en Supabase