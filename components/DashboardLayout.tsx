import {NextPage} from "next";
import {createRef, useEffect, useState} from "react";
import {Badge, Button, Drawer, Indicator, Menu, Navbar} from "react-daisyui";
import {useRouter} from "next/router";
import {getPayload} from "../lib/auth";

const DashboardLayout: NextPage = ({children}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const router = useRouter();
  const header = createRef();
  const role = getPayload()?.role;

  const items = {
    "admin": [
      {
        "href": "/admin",
        "label": "Dashboard",
        "icon": "fa-solid fa-house",
      }
    ],
    "teacher": [],
    "student": [],
  };

  useEffect(() => {
    setHeaderHeight(header.current.clientHeight);
  }, [header])

  return (
    <>
      <div>
        <Navbar ref={header} className='fixed top-0 left-0 z-50 bg-white shadow-md'>
          <Navbar.Start>
            <Button onClick={() => setDrawerOpen(!drawerOpen)} color="ghost" shape="circle" tabIndex={0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </Button>
          </Navbar.Start>
          <Navbar.Center>
            <Button color="ghost" className="normal-case text-xl">
              daisyUI
            </Button>
          </Navbar.Center>
          <Navbar.End className="navbar-end">
            <Button color="ghost" shape="circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
            <Button color="ghost" shape="circle">
              <Indicator item={<Badge size="xs" color="primary"/>}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </Indicator>
            </Button>
          </Navbar.End>
        </Navbar>
        <Drawer style={{paddingTop: headerHeight}} open={drawerOpen} onClickOverlay={() => setDrawerOpen(!drawerOpen)}
                side={<DrawerSide/>}>
          {children}
        </Drawer>
      </div>
    </>
  );

  function DrawerSide() {
    return (
      <div className='h-full max-w-xs w-full shadow-lg bg-white'>
        <Menu>
          {
            items[role].map((item, index) => (
              <Menu.Item key={index} href={item.href}>
                <a className={router.pathname === item.href ? 'active' : ''}>
                  {item.label}
                </a>
              </Menu.Item>
            ))
          }
        </Menu>
      </div>
    );
  }
}

export default DashboardLayout;