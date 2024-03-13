import { useState } from "react";

const useCustomContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    setVisible(true);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return { handleContextMenu, visible, position };
};

export default useCustomContextMenu;
