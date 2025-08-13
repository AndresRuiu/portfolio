import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  // autoPlay?: boolean; // No usar autoplay por UX
  muted?: boolean;
  loop?: boolean;
  onExpand?: () => void;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className,
  // autoPlay = false,
  muted = true,
  loop = true,
  onExpand,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Control de visibilidad de controles
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (isHovered || !isPlaying) {
      setShowControls(true);
      if (timer) clearTimeout(timer);
    } else {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isHovered, isPlaying]);

  // Actualizar progreso del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const updateDuration = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('waiting', () => setIsLoading(true));
    video.addEventListener('canplay', () => setIsLoading(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('waiting', () => setIsLoading(true));
      video.removeEventListener('canplay', () => setIsLoading(false));
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !containerRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio * 100);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Detectar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black/90 rounded-lg group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleFullscreen}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop={loop}
        muted={isMuted}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          >
            {/* Top controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              {title && (
                <h3 className="text-white font-medium text-sm bg-black/40 px-2 py-1 rounded">
                  {title}
                </h3>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExpand}
                  className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white border-0"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Center play button (only when paused) */}
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Button
                  variant="ghost"
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-full bg-black/60 hover:bg-black/80 text-white border-0"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Progress bar */}
              <div 
                className="w-full h-1 bg-white/20 rounded-full cursor-pointer group/progress"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-white rounded-full transition-all duration-150 group-hover/progress:bg-blue-400"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="h-8 w-8 text-white hover:bg-white/20 border-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={restart}
                    className="h-8 w-8 text-white hover:bg-white/20 border-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white hover:bg-white/20 border-0"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>

                  {/* Volume slider */}
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFullscreen}
                    className="h-8 w-8 text-white hover:bg-white/20 border-0"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS personalizado para el slider se manejará via Tailwind */}
    </motion.div>
  );
};

export default VideoPlayer;