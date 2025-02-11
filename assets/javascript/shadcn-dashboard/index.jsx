'use strict';
import React from "react";
import {createRoot} from "react-dom/client";
import Dashboard from "./Dashboard";

const domContainer = document.querySelector('#shadcn-demo');


const root = createRoot(domContainer);
root.render(
  <Dashboard />
);
