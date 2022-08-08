import { useState, useEffect } from "react";

export const useComponentBoundingRect = (componentRef) => {
  const [boundingRect, setBoundingRect] = useState();

  const getPosition = () => {
    setBoundingRect(
      componentRef.current.getBoundingClientRect()
    );
  };

  useEffect(() => {
    window.addEventListener("resize", getPosition, true);

    return () => {
      window.removeEventListener("resize", getPosition, true);
    };
  }, []);
  

  useEffect(() => {
    getPosition();
  }, []);

  return [ boundingRect ];
}