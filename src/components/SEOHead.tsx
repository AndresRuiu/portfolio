import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  schemaData?: object;
  noIndex?: boolean;
  lang?: string;
}

// Configuración base del sitio
const SITE_CONFIG = {
  name: 'Andrés Ruiu - Desarrollador Full Stack',
  url: process.env.NODE_ENV === 'production' 
    ? 'https://andres-ruiu.vercel.app' 
    : 'http://localhost:5173',
  description: 'Desarrollador Full Stack especializado en React, TypeScript y Node.js. Portfolio con proyectos web modernos y soluciones tecnológicas innovadoras.',
  author: 'Andrés Ruiu',
  image: '/og-image.jpg',
  twitterHandle: '@andres_ruiu',
  locale: 'es_AR',
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = SITE_CONFIG.description,
  keywords = ['desarrollador', 'full stack', 'react', 'typescript', 'nodejs', 'web', 'portfolio'],
  ogImage = SITE_CONFIG.image,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  schemaData,
  noIndex = false,
  lang = 'es',
}) => {
  // Construir título completo
  const fullTitle = title 
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;

  // URL canónica
  const canonical = canonicalUrl || window.location.href;

  // Imagen OG completa
  const fullOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `${SITE_CONFIG.url}${ogImage}`;

  // Schema.org estructurado
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Andrés Ruiu",
    "jobTitle": "Desarrollador Full Stack",
    "description": description,
    "image": fullOgImage,
    "url": SITE_CONFIG.url,
    "sameAs": [
      "https://linkedin.com/in/andres-ruiu",
      "https://github.com/andres-ruiu",
      "https://twitter.com/andres_ruiu"
    ],
    "knowsAbout": [
      "Desarrollo Web",
      "React",
      "TypeScript", 
      "Node.js",
      "JavaScript",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization", 
      "name": "Universidad Nacional de Tucumán"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AR",
      "addressRegion": "Tucumán"
    }
  };

  const finalSchema = schemaData || defaultSchema;

  return (
    <Helmet>
      {/* Básicos */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={SITE_CONFIG.author} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional meta tags */}
      <meta name="theme-color" content="#0ea5e9" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

// Presets para páginas específicas
export const HomePageSEO: React.FC<Partial<SEOHeadProps>> = (props) => (
  <SEOHead
    title="Portfolio de Desarrollador Full Stack"
    description="¡Hola! Soy Andrés, desarrollador Full Stack especializado en crear experiencias web modernas con React, TypeScript y Node.js. Descubre mis proyectos y servicios."
    keywords={['portfolio', 'desarrollador full stack', 'react', 'typescript', 'nodejs', 'web developer', 'andrés ruiu']}
    ogType="profile"
    {...props}
  />
);

export const ProjectsPageSEO: React.FC<Partial<SEOHeadProps>> = (props) => (
  <SEOHead
    title="Mis Proyectos - Portfolio de Desarrollo"
    description="Explora mi portfolio de proyectos web desarrollados con tecnologías modernas como React, TypeScript, Node.js y más. Aplicaciones reales y soluciones innovadoras."
    keywords={['proyectos web', 'portfolio desarrollo', 'react projects', 'typescript', 'aplicaciones web']}
    {...props}
  />
);

export const ServicesPageSEO: React.FC<Partial<SEOHeadProps>> = (props) => (
  <SEOHead
    title="Servicios de Desarrollo Web"
    description="Ofrezco servicios completos de desarrollo web: desde landing pages hasta aplicaciones complejas. Especializado en React, TypeScript y desarrollo full stack."
    keywords={['servicios desarrollo web', 'desarrollador freelance', 'react developer', 'typescript developer', 'desarrollo full stack']}
    {...props}
  />
);

export const EducationPageSEO: React.FC<Partial<SEOHeadProps>> = (props) => (
  <SEOHead
    title="Mi Formación y Educación"
    description="Conoce mi trayectoria educativa: desde Ingeniería Civil hasta mi transición al desarrollo de software. Certificaciones y cursos especializados en tecnologías web."
    keywords={['formación desarrollador', 'educación programación', 'transición carrera', 'certificaciones desarrollo web']}
    {...props}
  />
);

// Hook para generar SEO dinámico basado en datos
export const useDynamicSEO = (data: {
  type: 'project' | 'service' | 'blog';
  title: string;
  description: string;
  image?: string;
  publishedAt?: string;
}) => {
  const seoProps: SEOHeadProps = {
    title: data.title,
    description: data.description,
    ogImage: data.image,
  };

  if (data.type === 'project') {
    seoProps.keywords = ['proyecto web', 'desarrollo', data.title.toLowerCase()];
    seoProps.schemaData = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": data.title,
      "description": data.description,
      "creator": {
        "@type": "Person",
        "name": "Andrés Ruiu"
      }
    };
  }

  if (data.type === 'blog' && data.publishedAt) {
    seoProps.ogType = 'article';
    seoProps.schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.title,
      "description": data.description,
      "datePublished": data.publishedAt,
      "author": {
        "@type": "Person",
        "name": "Andrés Ruiu"
      }
    };
  }

  return seoProps;
};

export default SEOHead;