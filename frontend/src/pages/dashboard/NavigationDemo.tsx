import {Route, Link, useLocation, Routes, Outlet} from 'react-router-dom';
import React from "react";


const Tab1 = () => {
  return (
    <>
      <h2 className="font-bold text-2xl">Tab 1</h2>
      <p className="mt-2">
        This is a very simple demo showing how you can add a tab-based UI (including navigation)
        inside your dashboard component.
        Click on <Link className="link" to="../tab2">Tab 2</Link> above to see how it works.

      </p>
      <p className="text-gray-600 text-sm mt-2">
        The source of this page can be found at <code>src/pages/dashboard/NavigationDemo.tsx</code>.
        This is the <code>Tab1</code> component.
      </p>
    </>
  );
}

const Tab2 = () => {
  return (
    <>
      <h2 className="font-bold text-2xl">Tab 2</h2>
        <p className="mt-2">
          This is another tab. Did you notice that the URL also changed? You can refresh the page and you will be taken
          straight back to this tab.
          You can <Link className="link" to="../tab1">go back to Tab 1</Link> and try the same thing.
        </p>
        <p className="text-gray-600 text-sm mt-2">
          The source of this page can be found at <code>src/pages/dashboard/NavigationDemo.tsx</code>.
          This is the <code>Tab2</code> component.
        </p>
    </>
  );
}

const NavigationDemo = () => {
  const {pathname} = useLocation();
  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered">
        <Link to={`tab1`} className={`tab ${pathname.includes("tab1") ? "tab-active" : ""}`}>Tab 1</Link>
        <Link to={`tab2`} className={`tab ${pathname.includes("tab2") ? "tab-active" : ""}`}>Tab 2</Link>
      </div>
      <div className={"my-4"}>
        <Outlet/>
      </div>
    </div>
  );
}

const NavigationDemoRoutes = () => {
  return (
    <Routes>
      <Route path={`tab1`} element={<Tab1 />}>
      </Route>
      <Route path={`tab2`} element={<Tab2 />}>
      </Route>
    </Routes>
  );
};

export {NavigationDemo, NavigationDemoRoutes}

