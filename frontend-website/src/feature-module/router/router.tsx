import React from "react";
import { publicRoutes, withoutHeaderRoutes } from "./router.link";
import { Outlet, Route, Routes } from "react-router-dom";
import Header from "../common/header";
import Footer from "../common/footer";
import Loader from "../loader/loader";
import Progress from "../common/progressbar";
import ProtectedRoute from "./ProtectedRoute";

const AllRoutes = () => {
  const HeaderLayout = () => (
    <>
      <Header />
      <Outlet />
      <Footer />
      {/* <Loader/> */}
    </>
  );

  return (
    <>
      <Routes>
        <Route path={"/"} element={<HeaderLayout />}>
          {publicRoutes.map((route: any, idx) => (
            <Route
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
              key={idx}
            />
          ))}
        </Route>
        <Route path={"/"}>
          {withoutHeaderRoutes.map((route: any, idx) => (
            <Route
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
              key={idx}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};
export default AllRoutes;
