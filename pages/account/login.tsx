import {NextPage} from "next";
import {FormEvent, useContext, useEffect, useState} from "react";
import axios from "axios";
import {setToken} from "../../lib/auth";
import {useRouter} from "next/router";
import {Transition} from "@headlessui/react";
import LoaderContext from "../../context/LoaderContext";

const LoginPage: NextPage = () => {
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [cnic, password])

  const router = useRouter();
  const {setLoading} = useContext(LoaderContext);

  function formatCnic(cnic: string): string {
    const cnicParts = cnic
      .replace(/\D/g, '')
      .match(/(\d{1,5})(\d{0,7})(\d?)/);

    if (cnicParts) {
      cnic = ""
      if (cnicParts[1]) cnic += cnicParts[1];
      if (cnicParts[2]) cnic += "-" + cnicParts[2];
      if (cnicParts[3]) cnic += "-" + cnicParts[3];
    }
    return cnic;
  }

  function handleLogin(e: FormEvent) {
    setLoading(true);
    axios.post("/api/account/login", {
      cnic: cnic.replace(/\D/g, ''),
      password: password,
    }).then(res => {
      if (res.status === 200) {
        setToken(res.data.token);
        setLoading(false);
        router.push("/");
      }
    }).catch(err => {
      setLoading(false);
      if (err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
    });
    e.preventDefault();
  }

  return (
    <>
      <div className='pt-48 flex items-center justify-center'>
        <form onSubmit={handleLogin} className='card max-w-96 bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title'>Login</h2>
            <div className="form-control pt-8 space-y-4">
              <Transition
                show={error !== ""}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="alert alert-error shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6"
                       fill="none"
                       viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              </Transition>

              <div className='input-group'>
                <span className='w-full'>CNIC</span>
                <input onChange={(e) => setCnic(formatCnic(e.target.value))}
                       value={cnic}
                       minLength={15}
                       maxLength={15}
                       pattern={"^[0-9]{5}-[0-9]{7}-[0-9]$"}
                       type="text"
                       placeholder="35200-2222222-2"
                       required={true}
                       className="input input-bordered"/>
              </div>

              <div className='input-group'>
                <span className='w-full'>Password</span>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  minLength={6}
                  type="password"
                  placeholder="********"
                  required={true}
                  className="input input-bordered"/>
              </div>

              <button type={'submit'} className='btn btn-primary'>Login</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;