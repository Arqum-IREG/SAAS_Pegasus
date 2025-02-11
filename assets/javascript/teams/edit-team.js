'use strict';
import React from "react";
import {createRoot} from "react-dom/client";
import {getApiConfiguration} from "../api";
import EditTeamApplication from "./EditApp";
import {TeamFromJSON, TeamsApi} from "api-client";

const domContainer = document.querySelector('#manage-team-content');

// we have to call TeamFromJSON to map snake_case properties to camelCase used by the API client
const team = TeamFromJSON(JSON.parse(document.getElementById('team').textContent));
const user = JSON.parse(document.getElementById('user-details').textContent);
const apiUrls = JSON.parse(document.getElementById('api-urls').textContent);
const serverUrl = JSON.parse(document.getElementById('server-url').textContent);
const apiClient = new TeamsApi(getApiConfiguration(serverUrl));

const root = createRoot(domContainer);
root.render(
  <EditTeamApplication
    client={apiClient}
    team={team}
    apiUrls={apiUrls}
    user={user}
  />,
);
