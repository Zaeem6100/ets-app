import '../globals.css'
import type {AppProps} from 'next/app'
import ValidateRoute from "../components/ValidateRoute";
import LoaderContext from "../context/LoaderContext";
import {useEffect, useState} from "react";
import Head from "next/head";

function MyApp({Component, pageProps}: AppProps) {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      document.body.setAttribute("data-theme", localStorage.getItem('theme') || 'light');
    }
  }, []);

  return <>
    <Head>
      <title>ETS</title>
    </Head>
    <ValidateRoute>
      <LoaderContext.Provider value={{isLoading, setLoading}}>
        {isLoading &&
          <progress className="progress fixed overflow-hidden w-full top-0 left-0 w-full h-1 z-50"/>
        }
        <Component {...pageProps} />
      </LoaderContext.Provider>
    </ValidateRoute>
  </>
}

export default MyApp
