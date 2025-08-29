import React from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Project } from '@/types';

interface SearchCommandProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTech: string | null;
  setSelectedTech: (tech: string | null) => void;
  showActiveOnly: boolean;
  setShowActiveOnly: (show: boolean) => void;
  clearFilters: () => void;
  allTechnologies: string[];
  filteredProjects: Project[];
  allProjects: Project[]; // Todos los proyectos sin filtrar
  totalProjects: number;
  activeProjects: number;
  onProjectClick: (project: Project) => void;
}

const SearchCommand: React.FC<SearchCommandProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTech,
  showActiveOnly,
  allTechnologies,
  filteredProjects,
  allProjects,
  totalProjects,
  activeProjects,
  onProjectClick
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelectProject = (project: Project) => {
    onProjectClick(project);
    setOpen(false);
  };

  // Generar predicciones usando todos los proyectos y tecnologías de la base de datos
  const generateWordPredictions = (currentTerm: string) => {
    if (!currentTerm || currentTerm.length < 1) return [];
    
    const suggestions = new Set<string>();
    const term = currentTerm.toLowerCase().trim();
    
    // Usar TODOS los proyectos de la base de datos para generar sugerencias
    allProjects.forEach(project => {
      // Agregar nombres de proyectos completos que coincidan
      if (project.titulo.toLowerCase().includes(term)) {
        suggestions.add(project.titulo);
      }
      
      // Agregar tecnologías que coincidan exactamente
      project.tecnologias.forEach(tech => {
        if (tech.toLowerCase().includes(term)) {
          suggestions.add(tech);
        }
      });
      
      // Agregar palabras individuales de títulos
      project.titulo.toLowerCase().split(' ').forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 2 && cleanWord.startsWith(term) && cleanWord !== term) {
          suggestions.add(cleanWord);
        }
      });
    });
    
    // También incluir todas las tecnologías disponibles (prioridad alta)
    allTechnologies.forEach(tech => {
      if (tech.toLowerCase().includes(term)) {
        suggestions.add(tech);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  };

  // Ya no necesitamos filtrado personalizado aquí,
  // usamos directamente los filteredProjects que vienen de la página principal
  const getSearchResults = () => {
    return searchTerm ? filteredProjects : [];
  };

  const wordPredictions = generateWordPredictions(searchTerm);
  const searchFilteredProjects = getSearchResults();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="h-8 px-2 bg-background hover:bg-muted/50 border transition-all duration-200"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="start" sideOffset={4}>
        <Command className="w-full">
          <CommandInput
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          
          <CommandList className="max-h-64">
            {/* Predicciones de palabras */}
            {wordPredictions.length > 0 && (
              <CommandGroup heading="Sugerencias">
                {wordPredictions.map((word) => (
                  <CommandItem
                    key={word}
                    onSelect={() => setSearchTerm(word)}
                    className="cursor-pointer"
                  >
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{word}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Resultados de proyectos - Solo 3 y solo si hay búsqueda activa */}
            {searchTerm && searchFilteredProjects.length > 0 && (
              <CommandGroup heading={`Proyectos ${searchFilteredProjects.length > 3 ? '(primeros 3)' : `(${searchFilteredProjects.length})`}`}>
                {searchFilteredProjects.slice(0, 3).map((project, index) => (
                  <CommandItem
                    key={`${project.titulo}-${index}`}
                    onSelect={() => handleSelectProject(project)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{project.titulo}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tecnologias.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-1.5 py-0.5 bg-muted/40 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                          {project.tecnologias.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-muted/40 text-xs rounded opacity-70">
                              +{project.tecnologias.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      {project.activo && (
                        <div className="w-2 h-2 bg-green-500 rounded-full ml-3 flex-shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                ))}
                {searchFilteredProjects.length > 3 && (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t">
                    Y {searchFilteredProjects.length - 3} proyectos más en la galería
                  </div>
                )}
              </CommandGroup>
            )}

            {/* Estado sin resultados */}
            {searchTerm && searchFilteredProjects.length === 0 && (
              <CommandEmpty>
                <div className="flex flex-col items-center py-6 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No se encontraron proyectos con "{searchTerm}"
                  </p>
                </div>
              </CommandEmpty>
            )}
            
            {/* Stats en la parte inferior - Solo si hay búsqueda o filtros */}
            {(searchTerm || selectedTech || showActiveOnly) && (
              <div className="border-t p-3 bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {searchTerm ? searchFilteredProjects.length : filteredProjects.length} de {totalProjects} proyectos
                  </span>
                  <span>{activeProjects} activos</span>
                </div>
              </div>
            )}
            
            {/* Estado inicial sin búsqueda */}
            {!searchTerm && !selectedTech && !showActiveOnly && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Escribe para buscar proyectos o tecnologías</p>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchCommand;