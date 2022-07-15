import {PropsWithChildren} from "react";
import {setToken} from "../lib/auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import Link from "next/link";
import ThemeChanger from "./ThemeChanger";

export default function DashboardLayout({children}: PropsWithChildren<any>) {
  const router = useRouter();

  return (
    <>
      <div>
        <Navbar/>
        {children}
      </div>
    </>
  );

  function Navbar() {
    return (
      <div className="navbar bg-base-100 shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="navbar-start"/>
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
