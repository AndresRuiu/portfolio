import { HomeIcon, NotebookIcon, Sparkles, GraduationCap } from "lucide-react";

export const DATOS = {
  nombre: "Andrés Ruiu",	
  iniciales: "AR",
  url: "",
  ubicacion: "San Miguel de Tucumán, Tucumán, Argentina",
  description: "Desarrollador FullStack apasionado por la tecnología. Transformando ideas en soluciones digitales innovadoras, con un enfoque en crear aplicaciones que realmente marquen la diferencia",
  resumen: 
  "Al final de 2022, decidí dejar atrás mis estudios en Ingeniería Civil para dedicarme por completo a mi verdadera pasión: la programación. Actualmente estoy en el último año de la Tecnicatura Universitaria en Programación en la UTN - FRT. A lo largo de mi camino, he explorado diversas tecnologías y he participado en proyectos emocionantes que me han permitido crecer como desarrollador. Siempre estoy buscando aprender algo nuevo y aplicar mis habilidades para crear soluciones innovadoras que impacten positivamente en el mundo digital",
  urlAvatar: "/yo.webp",
  habilidades: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Electron",
    "NestJs",
    "MySQL",
    "MongoDB"
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
      titulo: "Landing Page - Laboratorio Saguir Correa",
      fechas: "Marzo 2025 - Junio 2025",
      activo: true,
      descripcion: "Desarrollo de una landing page completa para el Laboratorio de Análisis Clínicos Saguir Correa, incluyendo secciones de historia, servicios, contacto y visualización de resultados clínicos. El proyecto se mantiene activo con actualizaciones y mejoras continuas para optimizar la experiencia del usuario y la funcionalidad del sitio.",
      tecnologias: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Framer Motion",
        "Responsive Design",
        "SEO"
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
      titulo: "Resired",
      fechas: "Junio 2024 - Julio 2024",
      activo: true,
      descripcion: "Una plataforma web para gestión de consorcios que incluye un asistente de inteligencia artificial para facilitar tareas a administradores e inquilinos. Este proyecto me permitió aplicar tecnologías como Next.js y MongoDB.",
      tecnologias: [
        "Next.js",
        "TypeScript",
        "MongoDB",
        "Tailwind CSS",
        "Shadcn UI",
        "OpenAI",
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
      titulo: "Gimnasio Palermo",
      fechas: "Octubre 2024 - Presente",
      activo: true,
      descripcion: "Modernización de un sistema de gestión para un gimnasio local, mejorando su interfaz y optimizando su base de datos. Este proyecto me ha desafiado a utilizar nuevas tecnologías como Electron y React.",
      tecnologias: [
        "Electron",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "MySQL",
        "NestJs",
        "Trello"
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
      titulo: "Dogtor - Veterinaria",
      fechas: "Agosto 2023",
      activo: false,
      descripcion: "Un sitio web desarrollado durante mi curso en RollingCode, donde los usuarios pueden crear perfiles para sus mascotas y reservar turnos.",
      tecnologias: [
        "React",
        "Vite",
        "CSS",
        "Trello",
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
      titulo: "Ristretto Coffee Shop",
      fechas: "Octubre 2023 - Noviembre 2023",
      activo: false,
      descripcion: "Landing page para cafetería diseñada para modernizar un sitio tradicional, utilizando imágenes generadas por IA como ejemplos de café.",
      tecnologias: [
        "HTML",
        "Tailwind CSS",
        "JavaScript",
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
      titulo: "CV Generator",
      fechas: "Diciembre 2024",
      activo: true,
      descripcion: "Una aplicación web integral para la generación y personalización de currículos profesionales. El proyecto ofrece una experiencia de usuario intuitiva que permite a los usuarios diseñar, editar y exportar sus CVs de manera completamente personalizada. Desarrollé características avanzadas como guardado automático en localStorage, selección de paletas de color, vista previa en tiempo real, y exportación a PDF. La aplicación está construida con React y Tailwind CSS, implementando animaciones con Framer Motion para mejorar la interactividad y la experiencia de usuario.",
      tecnologias: [
        "React",
        "TypeScript",
        "Tailwind CSS", 
        "Framer Motion",
        "React PDF",
        "React Router",
        "Shadcn UI"
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
      titulo: "Selector de Agentes",
      fechas: "Noviembre 2024",
      activo: true,
      descripcion: "Una aplicación de escritorio desarrollada con PySide6 para explorar y seleccionar agentes, con carga dinámica de datos y caché de imágenes.",
      tecnologias: [
        "Python",
        "PySide6",
        "Requests",
        "Magic Loops API"
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