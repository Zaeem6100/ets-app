import {useEffect, useState} from 'react';

export function useTheme(): [string, Function] {
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'light');

  function setTheme(name?: string) {
    if (!name) name = localStorage.getItem('theme') || 'light';
    document.body.setAttribute("data-theme", name);
    document.querySelector("html")?.setAttribute("data-theme", name);
    localStorage.setItem('theme', name);
    setSelectedTheme(name);
  }

  useEffect(() => {
    setTheme();
  }, []);

  return [selectedTheme, setTheme];
}

export const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter"
];
