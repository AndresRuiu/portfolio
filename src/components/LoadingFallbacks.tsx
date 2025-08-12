import { motion } from 'framer-motion';

export const ProjectsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 w-full">
    {Array.from({ length: 3 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative"
      >
        <div className="relative h-full bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-lg">
          {/* Image skeleton */}
          <div className="relative h-48 sm:h-52 bg-muted/30 loading-shimmer" />
          
          {/* Content skeleton */}
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg w-9 h-9 loading-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-muted/40 rounded loading-shimmer" />
                <div className="h-4 bg-muted/30 rounded w-24 loading-shimmer" />
              </div>
            </div>
            
            {/* Tech badges skeleton */}
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-muted/30 rounded loading-shimmer" />
              ))}
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="h-8 w-20 bg-muted/30 rounded-lg loading-shimmer" />
              <div className="h-8 w-24 bg-muted/30 rounded-lg loading-shimmer" />
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export const ServicesSkeleton = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="text-center mb-16">
      <div className="h-12 bg-muted/40 rounded mx-auto mb-6 w-48 loading-shimmer" />
      <div className="h-6 bg-muted/30 rounded mx-auto max-w-2xl loading-shimmer" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
          className="relative w-full"
        >
          <div className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
            {/* Header skeleton */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl w-12 h-12 bg-muted/40 rounded loading-shimmer" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-muted/40 rounded loading-shimmer" />
                <div className="h-4 bg-muted/30 rounded loading-shimmer" />
                <div className="h-4 bg-muted/30 rounded w-3/4 loading-shimmer" />
              </div>
            </div>

            {/* Technologies skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-4 bg-muted/30 rounded w-24 loading-shimmer" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-muted/30 rounded loading-shimmer" />
                ))}
              </div>
            </div>

            {/* Includes skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-4 bg-muted/30 rounded w-20 loading-shimmer" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-green-500/20 rounded-full mt-0.5" />
                    <div className="h-4 bg-muted/30 rounded flex-1 loading-shimmer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Button skeleton */}
            <div className="h-12 bg-primary/20 rounded-xl loading-shimmer" />
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted/40 rounded w-48 loading-shimmer" />
          <div className="w-10 h-10 bg-muted/30 rounded-full loading-shimmer" />
        </div>
        
        <div className="h-64 bg-muted/30 rounded-xl loading-shimmer" />
        
        <div className="space-y-3">
          <div className="h-6 bg-muted/40 rounded loading-shimmer" />
          <div className="h-4 bg-muted/30 rounded loading-shimmer" />
          <div className="h-4 bg-muted/30 rounded w-3/4 loading-shimmer" />
        </div>
        
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-primary/20 rounded loading-shimmer" />
          <div className="h-10 w-32 bg-muted/30 rounded loading-shimmer" />
        </div>
      </div>
    </motion.div>
  </div>
);