import {PropsWithChildren, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getPayload, isAuthenticated} from '../lib/auth';

export default function ValidateRoute({children}: PropsWithChildren) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const authenticationRoutes: string[] = [
    "/account/login",
  ];

  const verifyRoute = (url: string) => {
    const path = url.split('?')[0].replace(/^\/$/, '');
    if (!isAuthenticated() && !authenticationRoutes.includes(path.replace(/\/$/, ''))) {
      setAllowed(false);
      return router.push({pathname: '/account/login'});
    }

    if (isAuthenticated()) {
      const role = getPayload()?.role;

      if (role === 'teacher' && !path.startsWith('/teacher')) {
        return router.push({pathname: '/teacher'});
      }

      if (role === 'student' && !path.startsWith('/student')) {
        return router.push({pathname: '/student'});
      }

      if (role === 'admin' && !path.startsWith('/admin')) {
        return router.push({pathname: '/admin'});
      }
    }

    setAllowed(true);
  }

  useEffect(() => {
    verifyRoute(router.asPath);

    router.events.on('routeChangeStart', () => setAllowed(false));
    router.events.on('routeChangeComplete', verifyRoute)

    return () => {
      router.events.off('routeChangeStart', () => setAllowed(false));
      router.events.off('routeChangeComplete', verifyRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <> {allowed && children} </>;
}