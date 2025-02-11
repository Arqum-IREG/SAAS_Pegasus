import {FormEvent, useContext, useState} from "react";
import {getApiConfiguration} from "../api/utils.tsx";
import {ApiApi} from "api-client";
import {AuthContext} from "../auth/authcontext.tsx";
import {useNavigate} from "react-router-dom";

const getClient = () => {
  return new ApiApi(getApiConfiguration());
};

export default function SignupPage() {
  const {setUserDetails} = useContext(AuthContext);
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string[]}>({});
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({}); // Clear any previous errors
    setGeneralErrors([]);
    const client = getClient();
    // todo: the backend serializer requires two passwords, but we'll just make them the same.
    const credentials = {email, password1: password, password2: password};
    // After registration, we need to login to get the JWT
    client.apiAuthRegisterCreate({register: credentials})
      .then(() => {
        // Registration successful, now login
        return client.apiAuthLoginCreate({
          login: {email, password}
        });
      })
      .then(data => {
        if (data.status === "success" && data.jwt) {
          setUserDetails(data.jwt);
          return navigate('/dashboard/profile/');
        } else if (data.status === "otp_required" && data.tempOtpToken) {
          localStorage.setItem('tempOtpToken', data.tempOtpToken);
          return navigate('/login/otp/');
        }
      })
      .catch(error => {
        console.error('Error during signup/login:', error);
        if (error.response) {
          // Handle API error responses
          error.response.json().then((errorData: any) => {
            const newFieldErrors: {[key: string]: string[]} = {};
            const newGeneralErrors: string[] = [];

            if (typeof errorData === 'string') {
              newGeneralErrors.push(errorData);
            } else {
              Object.entries(errorData).forEach(([key, errors]) => {
                const errorList = Array.isArray(errors) ? errors : [errors];
                if (key === 'email' || key === 'password1') {
                  newFieldErrors[key] = errorList.map(err => `${err}`);
                } else {
                  errorList.forEach(err => {
                    newGeneralErrors.push(`${err}`);
                  });
                }
              });
            }

            setFieldErrors(newFieldErrors);
            setGeneralErrors(newGeneralErrors);
          }).catch(() => {
            setGeneralErrors(["There was a problem signing up. Please try again."]);
          });
        } else {
          setGeneralErrors(["Network error. Please check your connection and try again."]);
        }
      });
  }

  return (
    <div className="flex justify-center min-h-screen my-8 ">
      <div className="w-96 px-4 py-4">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign Up
          </h2>
          <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="email">
                Email
              </label>
              <input type="email" id="email"
                     className={`input input-bordered w-full ${fieldErrors.email ? 'input-error' : ''}`}
                     placeholder="name@example.com" required
                     onChange={(e) => changeEmail(e.target.value)}
                     value={email}
                     name={'email'}/>
              {fieldErrors.email && (
                <div className="text-xs text-red-500 mt-1">
                  {fieldErrors.email.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label font-bold" htmlFor="password">
                Password
              </label>
              <input type="password" id="password"
                     className={`input input-bordered w-full ${fieldErrors.password1 ? 'input-error' : ''}`}
                     required
                     onChange={(e) => changePassword(e.target.value)}
                     value={password}
                     name={'password'}/>
              {fieldErrors.password1 && (
                <div className="text-xs text-red-500 mt-1">
                  {fieldErrors.password1.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>
            {generalErrors.length > 0 && (
              <div className="text-xs text-red-500 mt-2">
                {generalErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
            <div className="mt-2">
              <button type="submit"
                      className="btn btn-primary btn-block">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
