import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBook, faBug,
  faGraduationCap,
  faHouse, faMarker,
  faPeopleGroup
} from "@fortawesome/free-solid-svg-icons";
import {NextRouter, useRouter} from "next/router";
import {setToken} from "../lib/auth";
import {createRef, PropsWithChildren, RefObject} from "react";
import ThemeChanger from "./ThemeChanger";

export default function AdminLayout({children}: PropsWithChildren<any>): JSX.Element {
  const header: RefObject<any> = createRef();
  const router: NextRouter = useRouter();

  const items = [
    {
      "href": "/admin",
      "label": "Dashboard",
      "icon": faHouse,
    },
    {
      "href": "/admin/students",
      "label": "Students",
      "icon": faGraduationCap,
    },
    {
      "href": "/admin/teachers",
      "label": "Teachers",
      "icon": faPeopleGroup,
    },
    {
      "href": "/admin/subjects",
      "label": "Subjects",
      "icon": faBook,
    },
    {
      "href": "/admin/exams",
      "label": "Exams",
      "icon": faMarker,
    },
    {
      "href": "/admin/anomalies",
      "label": "Anomalies",
      "icon": faBug,
    },
  ];

  return (
    <>
      <Navbar/>
      <Drawer>
        {children}
      </Drawer>
    </>
  );

  function Drawer({children}: PropsWithChildren<any>): JSX.Element {
    return (
      <>
        <div>
          <div className="drawer drawer-mobile pt-16">
            <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content">
              {children}
            </div>
            {
              <div className="drawer-side shadow-2xl">
                <label htmlFor='my-drawer' className="drawer-overlay"/>
                <ul className="menu p-4 overflow-y-auto space-y-2 w-64 max-w-full bg-base-100 text-base-content">
                  {
                    items.map((item, index) => (
                      <li key={index}>
                        <Link href={item.href}>
                          <a className={router.pathname === item.href ? 'active' : ''}>
                            <FontAwesomeIcon icon={item.icon} className="mr-2"/>
                            {item.label}
                          </a>
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </>
    );
  }

  function Navbar() {
    return (
      <div ref={header} className="navbar bg-base-100 shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="navbar-start">
          <label htmlFor="my-drawer" tabIndex={0} className="btn btn-ghost btn-circle lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
          </label>
        </div>
        <div className="navbar-center">
          <Link href={"/admin"} passHref>
            <a className="btn btn-ghost no-animation normal-case text-xl">ETS</a>
          </Link>
        </div>
        <div className="navbar-end">
          <ThemeChanger/>
          <button onClick={() => {
            setToken();
            router.push('/');
          }} className="ml-4 btn btn-primary no-animation space-x-0 sm:space-x-2">
            <span className='hidden sm:block'>Logout</span>
            <FontAwesomeIcon icon={faArrowRightFromBracket}/>
          </button>
        </div>
      </div>
    );
  }
}
