import {faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {THEMES, useTheme} from "../lib/theme";

export default function ThemeChanger() {
  const [currentTheme, setTheme] = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-square">
        <FontAwesomeIcon icon={faCog}/>
      </label>
      <ul tabIndex={0} className="dropdown-content h-64 overflow-y-scroll menu p-2 shadow bg-base-200 rounded-box w-52">
        {
          THEMES.map((theme, index) => (
            <li key={index} onClick={() => setTheme(theme)}>
              <a className={`capitalize ${theme === currentTheme && 'active'}`}>{theme}</a>
            </li>
          ))
        }
      </ul>
    </div>
  );
}