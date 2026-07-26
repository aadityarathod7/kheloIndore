import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";

const BlogGridSidebarLeft = () => {
  const routes = all_routes;
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <div>
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb breadcrumb-list mb-0">
          <span className="primary-right-round" />
          <div className="container">
            <h1 className="text-white">Blog Grid Sidebar</h1>
            <ul>
              <li>
                <Link to={routes.home}>Home</Link>
              </li>
              <li>Blog Grid Sidebar</li>
            </ul>
          </div>
        </div>
        {/* /Breadcrumb */}
        {/* Page Content */}
        <div className="content blog-grid">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-4 blog-sidebar theiaStickySidebar">
              <div className="stickybar">
                <div className="card">
                  <h4>Search</h4>
                  <form className="">
                    <div className="blog-search">
                      <input
                        type="text"
                        className="form-control"
                        id="search"
                        placeholder="Enter Keyword"
                      />
                      <i className="feather-search" />
                    </div>
                  </form>
                </div>
                <div className="card">
                  <h4>Latest Posts</h4>
                  <ul className="latest-posts">
                    <li>
                      <div className="post-thumb">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            src="assets/img/blog/latestpost-01.jpg"
                            alt="Post"
                          />
                        </Link>
                      </div>
                      <div className="post-info">
                        <p>Sarah</p>
                        <h6>
                          <Link to={routes.blogDetails}>
                            These 15 Cabin Wedding Venues Have All the Rustic
                            Vibes
                          </Link>
                        </h6>
                      </div>
                    </li>
                    <li>
                      <div className="post-thumb">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            src="assets/img/blog/latestpost-02.jpg"
                            alt="Post"
                          />
                        </Link>
                      </div>
                      <div className="post-info">
                        <p>Kim Forrest</p>
                        <h6>
                          <Link to={routes.blogDetails}>
                            23 Super-Chic Blazer Dresses for Your Home Game
                          </Link>
                        </h6>
                      </div>
                    </li>
                    <li>
                      <div className="post-thumb">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            src="assets/img/blog/latestpost-03.jpg"
                            alt="Post"
                          />
                        </Link>
                      </div>
                      <div className="post-info">
                        <p>Jessica Estrada</p>
                        <h6>
                          <Link to={routes.blogDetails}>
                            The Prettiest Floral Bats for a Rage Look
                          </Link>
                        </h6>
                      </div>
                    </li>
                    <li>
                      <div className="post-thumb">
                        <Link to={routes.blogDetails}>
                          <ImageWithBasePath
                            className="img-fluid"
                            src="assets/img/blog/latestpost-04.jpg"
                            alt="Post"
                          />
                        </Link>
                      </div>
                      <div className="post-info">
                        <p>Naoimh</p>
                        <h6>
                          <Link to={routes.blogDetails}>
                            31 Beautiful Courts Around the World
                          </Link>
                        </h6>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="card">
                  <h4>Categories</h4>
                  <ul className="categories">
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          Rules in Game <span>(100)</span>
                        </Link>
                      </h6>
                    </li>
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          Badminton <span>(10)</span>
                        </Link>
                      </h6>
                    </li>
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          Bats <span>(20)</span>
                        </Link>
                      </h6>
                    </li>
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          New Game <span>(45)</span>
                        </Link>
                      </h6>
                    </li>
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          Event <span>(25)</span>
                        </Link>
                      </h6>
                    </li>
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          Rackets <span>(15)</span>
                        </Link>
                      </h6>
                    </li>
                    <li>
                      <h6>
                        <Link to="#">
                          {" "}
                          New Courts <span>(121)</span>
                        </Link>
                      </h6>
                    </li>
                  </ul>
                </div>
                <div className="card tags-card">
                  <h4>Tags</h4>
                  <ul className="tags clearfix">
                    <li>
                      <Link to="#" className="tag">
                        Rackets
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="tag">
                        New Game
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="tag">
                        Dresses
                      </Link>
                    </li>
                  </ul>
                </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-8 col-lg-8">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    {/* Blog */}
                    <div className="featured-venues-item">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-07.jpg"
                              className="img-fluid"
                              alt="Venue"
                            />
                          </Link>
                          <div className="fav-item-venues news-sports">
                            <span className="tag tag-blue">Badminton</span>
                            <div className="list-reviews coche-star">
                              <Link
                                to="#"
                                className={`fav-icon ${selectedItems[1] ? "selected" : ""}`}
                                key={1}
                                onClick={() => handleItemClick(1)}
                              >
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-01.jpg"
                                  alt="User"
                                />
                                Orlando Waters
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                15 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title blog-title">
                            <Link to={routes.blogDetails}>
                              Mastering the Badminton Basics: A Guide for
                              Beginners
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <Link to="#">
                                  <i className="feather-heart" />
                                  45
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <i className="feather-message-square" />
                                  40
                                </Link>
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              10 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Blog */}
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    {/* Blog */}
                    <div className="featured-venues-item">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-08.jpg"
                              className="img-fluid"
                              alt="Venue"
                            />
                          </Link>
                          <div className="fav-item-venues news-sports">
                            <span className="tag tag-blue">
                              Sports Activites
                            </span>
                            <div className="list-reviews coche-star">
                              <Link to="#" className={`fav-icon ${selectedItems[2] ? "selected" : ""}`}
                              key={2}
                              onClick={() => handleItemClick(2)}>
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-06.jpg"
                                  alt="User"
                                />
                                Claire Nichols
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                16 Jun 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title blog-title">
                            <Link to={routes.blogDetails}>
                              Unleashing Your Badminton Potential: Tips for
                              Skill Development
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <Link to="#">
                                  <i className="feather-heart" />
                                  32
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <i className="feather-message-square" />
                                  21
                                </Link>
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              5 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Blog */}
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    {/* Blog */}
                    <div className="featured-venues-item">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-09.jpg"
                              className="img-fluid"
                              alt="Venue"
                            />
                          </Link>
                          <div className="fav-item-venues news-sports">
                            <span className="tag tag-blue">Rules of Game</span>
                            <div className="list-reviews coche-star">
                              <Link to="#"  className={`fav-icon ${selectedItems[3] ? "selected" : ""}`}
                              key={3}
                              onClick={() => handleItemClick(3)}>
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="assets/img/profiles/user-04.jpg"
                                  alt="User"
                                />
                                Joanna Le
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                17 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title blog-title">
                            <Link to={routes.blogDetails}>
                              Lorem Ipsum is simply dummy text of the printing{" "}
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <Link to="#">
                                  <i className="feather-heart" />
                                  55
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <i className="feather-message-square" />
                                  32
                                </Link>
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              4 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Blog */}
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                    {/* Blog */}
                    <div className="featured-venues-item">
                      <div className="listing-item">
                        <div className="listing-img">
                          <Link to={routes.blogDetails}>
                            <ImageWithBasePath
                              src="assets/img/venues/venues-15.jpg"
                              className="img-fluid"
                              alt="Venue"
                            />
                          </Link>
                          <div className="fav-item-venues news-sports">
                            <span className="tag tag-blue">Badminton</span>
                            <div className="list-reviews coche-star">
                              <Link to="#" className={`fav-icon ${selectedItems[4] ? "selected" : ""}`}
                              key={4}
                              onClick={() => handleItemClick(4)}>
                                <i className="feather-heart" />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="listing-content news-content">
                          <div className="listing-venue-owner">
                            <div className="navigation">
                              <Link to="#">
                                <ImageWithBasePath
                                  src="assets/img/profiles/avatar-02.jpg"
                                  alt="User"
                                />
                                Andrew
                              </Link>
                              <span>
                                <i className="feather-calendar" />
                                17 May 2023
                              </span>
                            </div>
                          </div>
                          <h3 className="listing-title blog-title">
                            <Link to={routes.blogDetails}>
                              Lorem Ipsum is simply dummy text of the printing{" "}
                            </Link>
                          </h3>
                          <div className="listing-button read-new">
                            <ul className="nav">
                              <li>
                                <Link to="#">
                                  <i className="feather-heart" />
                                  55
                                </Link>
                              </li>
                              <li>
                                <Link to="#">
                                  <i className="feather-message-square" />
                                  32
                                </Link>
                              </li>
                            </ul>
                            <span>
                              <ImageWithBasePath
                                src="assets/img/icons/clock.svg"
                                alt="Icon"
                              />
                              4 Min To Read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Blog */}
                  </div>
                </div>
                {/*Pagination*/}
                <div className="blog-pagination">
                  <nav>
                    <ul className="pagination justify-content-center pagination-center">
                      <li className="page-item previtem">
                        <Link className="page-link" to="#">
                          <i className="feather-chevrons-left" />
                        </Link>
                      </li>
                      <li className="page-item previtem">
                        <Link className="page-link" to="#">
                          <i className="feather-chevron-left" />
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link className="page-link active" to="#">
                          1
                        </Link>
                      </li>
                      <li className="page-item active">
                        <Link className="page-link" to="#">
                          2
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link className="page-link" to="#">
                          3
                        </Link>
                      </li>
                      <li className="page-item nextlink">
                        <Link className="page-link" to="#">
                          {" "}
                          <i className="feather-chevron-right" />
                        </Link>
                      </li>
                      <li className="page-item nextlink">
                        <Link className="page-link" to="#">
                          {" "}
                          <i className="feather-chevrons-right" />
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
                {/*Pagination*/}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
};

export default BlogGridSidebarLeft;
