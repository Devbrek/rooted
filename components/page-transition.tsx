"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Remonte le contenu à chaque changement de route (clé = pathname), ce qui
// relance l'animation CSS "page-fade-in" (globals.css) sans JavaScript
// supplémentaire ni gestion manuelle d'état.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade-in">
      {children}
    </div>
  );
}
