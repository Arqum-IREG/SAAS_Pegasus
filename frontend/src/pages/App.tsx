import {useContext, useState} from 'react'
import pegasusLogo from '/rocket-laptop.svg'
import './App.css'
import {AuthContext} from "../auth/authcontext.tsx";
import {Link} from "react-router-dom";

function App() {
  const { token, user, isAuthenticated, isLoading } = useContext(AuthContext);
  return (
    <>
      <div className="flex justify-center items-center h-screen m-8">
        <div className="flex flex-col gap-y-12">
          <div className="flex justify-end">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              user ? (
                <div>Hi {user!.getDisplayName}! <Link to="/dashboard/profile">Visit your profile</Link></div>
              ) : (
                <div className={"flex gap-x-8 justify-center"}>
                  <Link to="/signup">Sign Up</Link>
                  <Link to="/login">Login</Link>
                </div>
              )
            )
            }
          </div>
          <div className="flex justify-center">
            <img src={pegasusLogo} className="my-8" alt="Pegasus logo"/>
          </div>
          <h1>Vite + React + Pegasus</h1>
          <p className="edit-guidance">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </>
  )
}

export default App
