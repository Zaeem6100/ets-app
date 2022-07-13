import {NextPage} from "next";
import {PropsWithChildren} from "react";
import {setToken} from "../lib/auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

const DashboardLayout: NextPage = ({children}: PropsWithChildren<any>) => {
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
          <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
        </div>
        <div className="navbar-end">
          <button onClick={() => {
            setToken();
            router.push('/');
          }} className="btn btn-primary space-x-0 sm:space-x-2">
            <span className='hidden sm:block'>Logout</span>
            <FontAwesomeIcon icon={faArrowRightFromBracket}/>
          </button>
        </div>
      </div>
    );
  }
}

export default DashboardLayout;