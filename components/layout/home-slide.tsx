import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { Tv, Subtitles, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

const SkeletonSlide = () => {
  return (
    <div className="w-full h-64 rounded-lg bg-muted-foreground animate-pulse">
      <div className="h-full w-full flex flex-col justify-end p-6">
        <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-16 bg-muted rounded w-3/5"></div>
      </div>
    </div>
  );
};

interface HomeCarouselProps {
  data: any[];
  loading: boolean;
  error?: string | null;
}

export const HomeCarousel = ({ data, loading, error }: HomeCarouselProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const validData = data.filter(
    (item: any) =>
      item.title && item.title.english && item.description && item.cover !== item.image
  );

  const handlePlayButtonClick = (id: string) => {
    router.push(`/watch/${id}`);
  };

  const handleDetailsClick = (id: string) => {
    router.push(`/details/${id}`);
  };

  const handleNext = () => {
    // Clear autoplay when user manually navigates
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
    setCurrentIndex((prev) => (prev + 1) % validData.length);
    // Restart autoplay after manual navigation
    setTimeout(() => {
      if (validData.length > 0) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % validData.length);
        }, 5000);
        setAutoplayInterval(interval);
      }
    }, 1000);
  };

  const handlePrevious = () => {
    // Clear autoplay when user manually navigates
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
    setCurrentIndex((prev) => (prev - 1 + validData.length) % validData.length);
    // Restart autoplay after manual navigation
    setTimeout(() => {
      if (validData.length > 0) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % validData.length);
        }, 5000);
        setAutoplayInterval(interval);
      }
    }, 1000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (validData.length > 0) {
      // Clear any existing interval
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % validData.length);
      }, 5000);
      setAutoplayInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [validData.length, currentIndex]); // Add currentIndex to dependencies

  if (loading) return <SkeletonSlide />;

  if (validData.length === 0) {

    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        No content available
      </div>
    );
  }

  const currentItem = validData[currentIndex];

  // Generate theme-oriented gradient based on current theme
  const getThemeGradient = () => {
    if (theme === 'light') {
      return 'from-orange-200/60 via-yellow-100/40 to-transparent';
    } else {
      return 'from-purple-900/50 via-blue-900/30 to-transparent';
    }
  };

  const getThemeOverlay = () => {
    if (theme === 'light') {
      return 'bg-gradient-to-br from-orange-100/20 via-yellow-50/15 to-amber-100/10';
    } else {
      return 'bg-gradient-to-br from-purple-950/30 via-blue-950/20 to-indigo-950/15';
    }
  };

  // Function to darken a color for light mode
  const getDarkenedColor = (color: string) => {
    if (!color) return color;
    
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken by reducing each RGB component by 40%
    const darkenFactor = 0.6;
    const newR = Math.floor(r * darkenFactor);
    const newG = Math.floor(g * darkenFactor);
    const newB = Math.floor(b * darkenFactor);
    
    // Convert back to hex
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  };

  const getTitleColor = () => {
    if (theme === 'light' && currentItem.color) {
      return getDarkenedColor(currentItem.color);
    }
    return currentItem.color;
  };

  return (
    <div className="relative w-full">
      <div className="relative md:h-96 h-72 w-full rounded-lg overflow-hidden bg-black/5">
        <img
          src={currentItem.cover}
          alt={currentItem.title.english || currentItem.title.romaji + " Banner Image"}
          className="absolute w-full h-full object-cover"
          loading="eager"
        />
        {/* Theme-oriented gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getThemeGradient()}`}></div>
        {/* Additional theme-based overlay for better blending */}
        <div className={`absolute inset-0 ${getThemeOverlay()}`}></div>
        {/* Shadow/blur effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>

        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="pl-6 mt-auto">
            <Card className="flex flex-row items-center gap-1 px-1 py-1 rounded-full w-fit border-1 backdrop-blur-sm">
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20 !shadow-none">
                <Tv className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{currentItem.type}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20">
                <Subtitles className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{currentItem.totalEpisodes}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{currentItem.rating}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-[6px] rounded-full py-1 bg-background/20">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{currentItem.duration} mins</span>
              </Badge>
            </Card>
          </div>

          <div className="p-6 flex md:flex-row flex-col justify-between items-start md:items-end text-start">
            <div className="max-w-5xl">
              <h2 className="md:text-4xl text-2xl left-0 font-bold text-shadow"
              style={{color: getTitleColor()}}
              >
                {currentItem.title.english}
              </h2>
              <div className="dark:text-white/80  text-sm mt-2 max-h-16 overflow-hidden">
                <div className="line-clamp-2 hidden md:block" dangerouslySetInnerHTML={{ __html: currentItem.description }} />
              </div>
            </div>
            <div className="right-6 bottom-4 flex items-end justify-end space-x-4 mt-4 md:mt-0">
              {/* <Button
                onClick={() => handleDetailsClick(currentItem.id)}
                variant="outline"
                className="flex items-center gap-2 border-1 shadow-sm"
              >
                <BiInfoCircle />
                DETAILS
              </Button> */}

              <Button
                onClick={() => handlePlayButtonClick(currentItem.id)}
                variant="default"
                className="flex items-center gap-2 border-1 shadow-sm"
              >
                <FaPlay />
                WATCH NOW
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex space-x-2">
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrevious();
            }} 
            size="icon" 
            variant="secondary" 
            className="bg-muted border-2 hover:bg-muted/80 transition-colors z-20"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#983D70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }} 
            size="icon" 
            variant="secondary" 
            className="bg-muted border-2 hover:bg-muted/80 transition-colors z-20"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#983D70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
