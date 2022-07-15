import {useState} from "react";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ThemeChanger() {
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'light');
  const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"];

  function setTheme(name: string) {
    document.body.setAttribute("data-theme", name);
    localStorage.setItem('theme', name);
    setSelectedTheme(name);
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-square">
        <FontAwesomeIcon icon={faCog}/>
      </label>
      <ul tabIndex={0} className="dropdown-content h-64 overflow-y-scroll menu p-2 shadow bg-base-200 rounded-box w-52">
        {
          themes.map((theme, index) => (
            <li key={index} onClick={() => setTheme(theme)}>
              <a className={`capitalize ${theme === selectedTheme && 'active'}`}>{theme}</a>
            </li>
          ))
        }
      </ul>
    </div>
  );
}