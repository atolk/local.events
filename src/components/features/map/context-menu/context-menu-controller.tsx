"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMap, useMapEvents } from "react-leaflet";
import styles from "./context-menu.module.css";
import { SetUserHomeAction } from "./actions/set-user-home-action";

type MenuState = { x: number; y: number; lat: number; lng: number };

function clampMenuPosition(
  x: number,
  y: number,
  menuWidth: number,
  menuHeight: number,
  containerWidth: number,
  containerHeight: number
) {
  let nextX = x;
  let nextY = y;
  if (nextX + menuWidth > containerWidth) {
    nextX = Math.max(0, containerWidth - menuWidth);
  }
  if (nextY + menuHeight > containerHeight) {
    nextY = Math.max(0, containerHeight - menuHeight);
  }
  return { x: nextX, y: nextY };
}

export function ContextMenuController() {
  const map = useMap();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenu(null);
  }, []);

  useMapEvents({
    contextmenu(e) {
      e.originalEvent.preventDefault();
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();
      setMenu({
        x: e.originalEvent.clientX - rect.left,
        y: e.originalEvent.clientY - rect.top,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
    movestart: closeMenu,
    zoomstart: closeMenu,
  });

  useLayoutEffect(() => {
    if (!menu || !menuRef.current) {
      return;
    }
    const container = map.getContainer();
    const el = menuRef.current;
    const { x, y } = clampMenuPosition(
      menu.x,
      menu.y,
      el.offsetWidth,
      el.offsetHeight,
      container.clientWidth,
      container.clientHeight
    );
    if (x !== menu.x || y !== menu.y) {
      setMenu((prev) => (prev ? { ...prev, x, y } : null));
    }
  }, [map, menu]);

  useEffect(() => {
    if (!menu) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }
      setMenu(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(null);
      }
    };

    const handleScroll = () => {
      setMenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [menu]);

  if (!menu) {
    return null;
  }

  const container = map.getContainer();
  const latlng = { lat: menu.lat, lng: menu.lng };

  return createPortal(
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ left: menu.x, top: menu.y }}
      role="menu"
      aria-label="Контекстное меню карты"
    >
      <SetUserHomeAction latlng={latlng} onClose={closeMenu} />
    </div>,
    container
  );
}
