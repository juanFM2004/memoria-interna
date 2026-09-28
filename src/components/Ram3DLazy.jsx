import React, { lazy, Suspense, useEffect, useRef, useState } from "react";

const Ram3DScene = lazy(() => import("./Ram3D.jsx"));

export default function Ram3DLazy({ focus = "all" }) {
  const stage = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!stage.current) return;
    if (!("IntersectionObserver" in window)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHasEntered(true);
    }, { rootMargin: "120px" });

    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={stage} style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0, position: "relative" }}>
    {hasEntered && <Suspense fallback={<div className="ram-stage" aria-label="Cargando modelo 3D"/>}>
      <Ram3DScene focus={focus}/>
    </Suspense>}
  </div>;
}