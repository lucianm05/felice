import { createElement, PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  let container = document.getElementById("felice-portal");

  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", "felice-portal");
    document.body.appendChild(container);
  }

  return createPortal(children, container);
};

export default Portal;
