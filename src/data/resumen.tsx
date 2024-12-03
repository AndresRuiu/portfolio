import { Icons } from "@/components/ui/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

// eslint-disable-next-line react-refresh/only-export-components
export const DATOS = {
  nombre: "Andrés Ruiu",	
  iniciales: "AR",
  url: "",
  ubicacion: "San Miguel de Tucumán, Tucumán, Argentina",
  description: "Desarrollador FullStack apasionado por la tecnología. Transformando ideas en soluciones digitales innovadoras, con un enfoque en crear aplicaciones que realmente marquen la diferencia",
  resumen: 
  "Al final de 2022, decidí dejar atrás mis estudios en Ingeniería Civil para dedicarme por completo a mi verdadera pasión: la programación. Actualmente estoy en el último año de la Tecnicatura Universitaria en Programación en la UTN - FRT. A lo largo de mi camino, he explorado diversas tecnologías y he participado en proyectos emocionantes que me han permitido crecer como desarrollador. Siempre estoy buscando aprender algo nuevo y aplicar mis habilidades para crear soluciones innovadoras que impacten positivamente en el mundo digital",
  urlAvatar: "/yo.jpg",
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
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contacto: {
    email: "andresruiu@gmail.com",
    tel: "3865351958",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/AndresRuiu",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/andrés-ruiu-b941a1103",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Enviar Correo",
        url: "#",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  educacion: [
    {
      institucion: "Universidad Tecnológica Nacional - FRT",
      href: "https://www.frt.utn.edu.ar",
      titulo: "Estudios parciales en Ingeniería Civil",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/UTN_logo.jpg",
      inicio: "2019",
      fin: "2022",
    },
    {
      institucion: "RollingCode School",
      href: "https://web.rollingcodeschool.com",
      titulo: "Curso Desarrollo Web Full Stack",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScahs7MB8GcE6Msj8AMnb5g16itCpVylxQRA&s",
      inicio: "Febrero 2023",
      fin: "Agosto 2023",
    },
    {
      institucion: "Universidad Tecnológica Nacional - FRT",
      href: "https://www.frt.utn.edu.ar",
      titulo: "Tecnicatura Universitaria en Programación",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/UTN_logo.jpg",
      inicio: "2023",
      fin: "2024",
    }
  ],
  proyectos: [
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
          icon: <Icons.website className="size-3" />,
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/consorcio-web",
          icon: <Icons.github className="size-3" />,
        }
      ],
      imagen: "/img/resired.png",
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
          icon: <Icons.website className="size-3" />,
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/proyecto_gimnasio",
          icon: <Icons.github className="size-3" />,
        }
      ],
      imagen: "/img/gimnasio-palermo.png",
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
          icon: <Icons.website className="size-3" />,
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/agustincolo/ProyectoFinal-G2",
          icon: <Icons.github className="size-3" />,
        }
      ],
      imagen: "/img/dogtor-veterinaria.png",
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
          icon: <Icons.website className="size-3" />,
        },
        {
          tipo: "Repositorio",
          href: "https://github.com/AndresRuiu/coffee-shop",
          icon: <Icons.github className="size-3" />,
        }
      ],
      imagen: "/img/ristretto-cafe.png",
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
          icon: <Icons.github className="size-3" />,
        }
      ],
      imagen: "/img/selector-agentes.png",
    }
  ]
} as const;