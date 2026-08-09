/* eslint-disable */
import React, { useEffect, useState } from "react";
import AllRoutes from "./router/router";
import useAutoLogout from "../utils/autoLogout";

const Feature = () => {
  // Auto-logout after 15 minutes of inactivity
  useAutoLogout();
  const [base, setBase] = useState("");
  const [page, setPage] = useState("");
  const [last, setLast] = useState("");
  const currentPath = window.location.pathname;

  useEffect(() => {
    setBase(currentPath.split("/")[1]);
    setPage(currentPath.split("/")[2]);
    setLast(currentPath.split("/")[3]);
  }, []);

  return (
    <>
      <div
        className={`main-wrapper
        ${
        page === "add-court" ? "add-court venue-coach-details" : 
        page === "coach-detail" ? "venue-coach-details coach-detail" :
        page === "lesson-timedate" ? "coach lessons" :
        page === "lesson-type" ? "coach lessons" :
        // page === "forgot-password" ? "authendication-pages" :
        page === "gallery" ? "gallery-page innerpagebg" :
        page === "invoice" ? "invoice-page innerpagebg" :
        page === "venue-details" ? "venue-coach-details" : ""
      }`
      }
      >
        <AllRoutes />
      </div>
    </>
  );
};

export default Feature;
