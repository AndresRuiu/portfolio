import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ImageMigrationStatus {
  filename: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
  url?: string;
}

/**
 * Componente para migrar imágenes del proyecto al Storage de Supabase
 * Mantiene la estructura de carpetas organizadas
 */
export function ImageMigrationHelper() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [migrationStatus, setMigrationStatus] = useState<ImageMigrationStatus[]>([]);

  // Mapeo de archivos y sus rutas de destino en Supabase
  const imagesToMigrate = [
    {
      filename: 'andrea-gabinete.png',
      localPath: '/img/andrea-gabinete.png',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/andrea-gabinete.png'
    },
    {
      filename: 'saguir-correa.png',
      localPath: '/img/saguir-correa.png',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/saguir-correa.png'
    },
    {
      filename: 'resired.webp',
      localPath: '/img/resired.webp',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/resired.webp'
    },
    {
      filename: 'gimnasio-palermo.webp',
      localPath: '/img/gimnasio-palermo.webp',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/gimnasio-palermo.webp'
    },
    {
      filename: 'dogtor-veterinaria.webp',
      localPath: '/img/dogtor-veterinaria.webp',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/dogtor-veterinaria.webp'
    },
    {
      filename: 'ristretto-cafe.webp',
      localPath: '/img/ristretto-cafe.webp',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/ristretto-cafe.webp'
    },
    {
      filename: 'cv-generator.webp',
      localPath: '/img/cv-generator.webp',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/cv-generator.webp'
    },
    {
      filename: 'selector-agentes.webp',
      localPath: '/img/selector-agentes.webp',
      bucket: 'portfolio-images',
      supabasePath: 'proyectos/selector-agentes.webp'
    },
    {
      filename: 'certificado-rolling.png',
      localPath: '/certificados/certificado-rolling.png',
      bucket: 'certificates',
      supabasePath: 'certificado-rolling.png'
    }
  ];

  const uploadImageToSupabase = async (imageData: typeof imagesToMigrate[0]) => {
    try {
      // Simular carga desde archivo local (en producción, usarías fetch o FileReader)
      const response = await fetch(imageData.localPath);
      if (!response.ok) {
        throw new Error(`No se pudo cargar la imagen: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Subir al bucket de Supabase
      const { error } = await supabase.storage
        .from(imageData.bucket)
        .upload(imageData.supabasePath, blob, {
          cacheControl: '3600',
          upsert: true // Sobreescribir si ya existe
        });

      if (error) {
        throw error;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(imageData.bucket)
        .getPublicUrl(imageData.supabasePath);

      return {
        success: true,
        url: publicUrl,
        message: 'Imagen subida exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

  const handleMigrateImages = async () => {
    setIsUploading(true);
    setProgress(0);
    
    // Inicializar estado
    const initialStatus: ImageMigrationStatus[] = imagesToMigrate.map(img => ({
      filename: img.filename,
      status: 'pending'
    }));
    setMigrationStatus(initialStatus);

    let completed = 0;
    const total = imagesToMigrate.length;

    for (let i = 0; i < imagesToMigrate.length; i++) {
      const imageData = imagesToMigrate[i];
      
      // Actualizar estado a 'uploading'
      setMigrationStatus(prev => prev.map((item, index) => 
        index === i ? { ...item, status: 'uploading' } : item
      ));

      // Subir imagen
      const result = await uploadImageToSupabase(imageData);
      
      // Actualizar estado con resultado
      setMigrationStatus(prev => prev.map((item, index) => 
        index === i ? {
          ...item,
          status: result.success ? 'success' : 'error',
          message: result.message,
          url: result.url
        } : item
      ));

      completed++;
      setProgress((completed / total) * 100);
      
      // Pequeña pausa entre subidas
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsUploading(false);
    
    const successCount = migrationStatus.filter(item => item.status === 'success').length;
    const errorCount = total - successCount;
    
    if (errorCount === 0) {
      toast.success(`🎉 Todas las imágenes (${successCount}) se migraron exitosamente`);
    } else {
      toast.warning(`⚠️ ${successCount} imágenes migradas, ${errorCount} con errores`);
    }
  };

  const getStatusIcon = (status: ImageMigrationStatus['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ImageMigrationStatus['status']) => {
    const variants = {
      pending: 'secondary',
      uploading: 'default',
      success: 'default',
      error: 'destructive'
    } as const;
    
    const colors = {
      pending: 'bg-gray-100 text-gray-600',
      uploading: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status === 'pending' && 'Pendiente'}
        {status === 'uploading' && 'Subiendo...'}
        {status === 'success' && 'Completado'}
        {status === 'error' && 'Error'}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Migración de Imágenes a Supabase Storage
          </CardTitle>
          <CardDescription>
            Este helper te permitirá migrar todas las imágenes de tu portfolio al Storage de Supabase,
            manteniendo la estructura de carpetas organizadas.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Imágenes a migrar</h3>
                <p className="text-sm text-gray-600">
                  {imagesToMigrate.length} imágenes en total
                </p>
              </div>
              
              <Button
                onClick={handleMigrateImages}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? 'Migrando...' : 'Iniciar Migración'}
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>

          {migrationStatus.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Estado de la migración:</h4>
              <div className="space-y-2">
                {migrationStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-medium text-sm">{item.filename}</p>
                        {item.message && (
                          <p className="text-xs text-gray-500">{item.message}</p>
                        )}
                        {item.url && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Ver imagen ↗
                          </a>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📁 Estructura en Supabase:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>portfolio-images/</strong></div>
              <div className="ml-4">└── proyectos/ (8 imágenes de proyectos)</div>
              <div><strong>certificates/</strong></div>
              <div className="ml-4">└── certificado-rolling.png</div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">⚠️ Instrucciones importantes:</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Asegúrate de que las imágenes estén en la carpeta public/ de tu proyecto</li>
              <li>• Las URLs generadas reemplazarán automáticamente las rutas locales</li>
              <li>• Las imágenes se organizarán por carpetas en Supabase Storage</li>
              <li>• Puedes ejecutar la migración múltiples veces (sobrescribirá archivos existentes)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ImageMigrationHelper;