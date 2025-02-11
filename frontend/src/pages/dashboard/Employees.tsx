import React, {useContext} from "react";
import {AuthContext} from "../../auth/authcontext.tsx";
import {PegasusApi} from "api-client";
import EmployeeApplication from "../../../../assets/javascript/pegasus/examples/react/App.jsx";
import {getApiConfiguration} from "../../api/utils.tsx";
import emptyImage from '/undraw_empty.svg'

export default function EmployeeApp() {
  const {token} = useContext(AuthContext);
  const client = new PegasusApi(getApiConfiguration(token));

  return (
    <EmployeeApplication client={client} urlBase="/dashboard/employees" emptyImage={emptyImage}/>
  );
}
