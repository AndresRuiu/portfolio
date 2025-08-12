import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useNavigation';

const ScrollProgress = () => {
  const scrollProgress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollProgress > 0.01 ? 1 : 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
        style={{
          scaleX: scrollProgress,
          transformOrigin: '0%'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
