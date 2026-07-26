import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { useLocation } from "react-router";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  return (
    <div>
      {isLoading && (
        <div
          id="global-loader"
          style={{
            opacity: 0.8,
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <div
            className="loader-img"
            style={{
              width: "80px", // Adjust size here
              height: "80px", // Adjust size here
            }}
          >
            <ImageWithBasePath
              src="../../../assets/img/Animation-loader.gif"
              className="img-fluid"
              alt="loader"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
