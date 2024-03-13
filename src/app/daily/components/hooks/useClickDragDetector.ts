import { isNil } from "lodash-es";
import { useRef, useState } from "react";

const useClickDragDetector = () => {
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownTimeRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    mouseDownTimeRef.current = new Date().getTime();
  };

  const handleMouseUp = () => {
    const mouseUpTime = new Date().getTime();
    const duration = mouseUpTime - (mouseDownTimeRef.current ?? 0);
    setIsDragging(duration > 200);
  };

  return {
    isDragging,
    setIsDragging,
    handleMouseDown,
    handleMouseUp,
  };
};

export default useClickDragDetector;
