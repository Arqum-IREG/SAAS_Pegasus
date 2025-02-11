'use strict';
import React from "react";
import {createRoot} from "react-dom/client";
import {getApiConfiguration} from "../api";
import TeamApplication from "./App";
import {BrowserRouter} from "react-router-dom";
import {TeamsApi} from "api-client";

const domContainer = document.querySelector('#team-content');
const apiUrls = JSON.parse(document.getElementById('api-urls').textContent);
const user = JSON.parse(document.getElementById('user-details').textContent);
const apiClient = new TeamsApi(getApiConfiguration(SERVER_URL_BASE));

const root = createRoot(domContainer);
root.render(
  <BrowserRouter basename={urlBase}>
    <TeamApplication
      client={apiClient}
      urlBase={urlBase}
      apiUrls={apiUrls}
      user={user}
    />
  </BrowserRouter>
);
