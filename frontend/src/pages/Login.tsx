import {FormEvent, useContext, useState} from "react";
import {ApiApi} from "api-client";
import {getApiConfiguration} from "../api/utils";
import {AuthContext} from "../auth/authcontext";
import { useNavigate } from "react-router-dom";


const getClient = () => {
  return new ApiApi(getApiConfiguration());
};

export default function LoginPage() {
  const { setUserDetails } = useContext(AuthContext);
  const [ email, changeEmail ] =  useState('');
  const [ password, changePassword ] =  useState('');
  const [ loginError, setLoginError ] =  useState('');
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getClient();
    const credentials = {email, password};
    client.apiAuthLoginCreate({login: credentials}).then(data => {
      if (data.status === "success" && data.jwt) {
        setUserDetails(data.jwt);
        return navigate('/');
      } else if (data.status === "otp_required" && data.tempOtpToken) {
        localStorage.setItem('tempOtpToken', data.tempOtpToken);
        return navigate('/login/otp/');
      }
    }).catch(error => {
      error.response.json().then((error: any) => {
        console.error(error);
        setLoginError("There was a problem logging in. Please try again.");
      });
    });
  }

  return (
    <div className="flex justify-center min-h-screen my-8 ">
      <div className="w-96 px-4 py-4">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign In
          </h2>
          <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="email">
                Email
              </label>
              <input type="email" id="email"
                     className="input input-bordered w-full"
                     placeholder="name@example.com" required
                     onChange={(e) => changeEmail(e.target.value)}
                     value={email}
                     name={'email'}/>
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="password">
                Password
              </label>
              <input type="password" id="password"
                     className="input input-bordered w-full"
                     required
                     onChange={(e) => changePassword(e.target.value)}
                     value={password}
                     name={'password'}/>
            </div>
            {loginError ? (
                <p className={"text-xs text-red-500 mt-2"}>{loginError} </p>
            ) : ""}
            <div className="mt-2">
              <button type="submit"
                      className="btn btn-primary btn-block">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
