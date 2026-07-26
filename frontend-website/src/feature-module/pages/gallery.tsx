import React from "react";
import { Link } from "react-router-dom";
import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";
import { all_routes } from "../router/all_routes";

const Gallery = () => {
  const routes = all_routes;

  const imageItems = [
    { img: "/assets/img/gallery/gallery4/gallery-01.png" },
    { img: "/assets/img/gallery/gallery4/gallery-02.png" },
    { img: "/assets/img/gallery/gallery4/gallery-03.png" },
    { img: "/assets/img/gallery/gallery4/gallery-04.png" },
    { img: "/assets/img/gallery/gallery4/gallery-05.png" },
    { img: "/assets/img/gallery/gallery4/gallery-06.png" },
    { img: "/assets/img/gallery/gallery4/gallery-07.png" },
    { img: "/assets/img/gallery/gallery4/gallery-08.png" },
    { img: "/assets/img/gallery/gallery4/gallery-09.png" },
    { img: "/assets/img/gallery/gallery4/gallery-10.png" },
    { img: "/assets/img/gallery/gallery4/gallery-11.png" },
    { img: "/assets/img/gallery/gallery4/gallery-12.png" },
  ];

  return (
    <div className="main-wrapper gallery-page innerpagebg">
      {/* Breadcrumb */}
      <div className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round" />
        <div className="container">
          <h1 className="text-white">Gallery</h1>
          <ul>
            <li>
              <Link to={routes.home}>Home</Link>
            </li>
            <li>Gallery</li>
          </ul>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="content gallery-blk">
        <div className="container">
          <div className="row">
            {imageItems.map((item, index) => (
              <div
                className="grid-item gallery-widget-item col-lg-4 col-md-6 col-sm-6 col-12"
                key={index}
              >
                {/* <Link to="#" data-fancybox="gallery4" > */}
                <SlideshowLightbox>
                  <img
                    src={item.img}
                    className="img-fluid img-gallerys"
                    alt="Gallery"
                  />
                </SlideshowLightbox>
                {/* </Link> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  
  );
};

export default Gallery;
