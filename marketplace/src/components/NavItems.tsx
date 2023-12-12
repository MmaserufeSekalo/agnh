"use client";

import { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { PRODUCT_CATEGORIES } from "@/config";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";


const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  //close the menu bar with esc key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handler);

    //clean up function
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);
   const isAnyOpen = activeIndex !== null;

   const navRef = useRef<HTMLDivElement | null>(null);

   //what should happen when we click outside the navbar
     useOnClickOutside(navRef, () => setActiveIndex(null));

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {/**map over the product categories in the ../config/conindex.ts */}
      {PRODUCT_CATEGORIES.map((category, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null);
          } else {
            setActiveIndex(i);
          }
        };

        const close = () => setActiveIndex(null);

        const isOpen = i === activeIndex;

        return (
          <NavItem
            category={category}
            close={close}
            handleOpen={handleOpen}
            isOpen={isOpen}
            key={category.value}
            isAnyOpen={isAnyOpen}
          />
        );
      })}
    </div>
  );
};
export default NavItems;
