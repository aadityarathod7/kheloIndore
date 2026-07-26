import React from 'react'
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from '../router/all_routes';

const OurTeams = () => {
  const routes = all_routes;
  return (
    <div>
        <>
  {/* Breadcrumb */}
  <section className="breadcrumb breadcrumb-list mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Our Teams</h1>
      <ul>
        <li>
          <Link to={routes.home}>Home</Link>
        </li>
        <li>Our Teams</li>
      </ul>
    </div>
  </section>
  {/* /Breadcrumb */}
  {/* Page Content */}
  <div className="content">
    <div className="container">
      <section className="ourteam">
        <div className="row">
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-01.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Caterine</h4>
                  <h6>Chief Executive Officer</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Caterine</h4>
                  <h6>Chief Executive Officer</h6>
                </div>
                <p>
                  Results-driven CEO, Ms. Caterine, fosters innovation and
                  drives growth with proven success. Her strategic vision,
                  collaborative leadership, and financial acumen consistently
                  deliver excellence, value, and strong stakeholder
                  relationships.
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-02.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Anto</h4>
                  <h6>Marketing Manager</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Anto</h4>
                  <h6>Marketing Manager</h6>
                </div>
                <p>
                  Mr. Anto, our Marketing Manager, passionately drives impactful
                  marketing campaigns, expanding the reach of badminton. With
                  expertise in brand management and digital marketing, he
                  elevates our presence and engages our target audience.
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-03.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Anto</h4>
                  <h6>Marketing Manager</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Anto</h4>
                  <h6>Marketing Manager</h6>
                </div>
                <p>
                  Mr. Anto, our Marketing Manager, passionately drives impactful
                  marketing campaigns, expanding the reach of badminton. With
                  expertise in brand management and digital marketing, he
                  elevates our presence and engages our target audience.
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-04.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Aravin</h4>
                  <h6>Finance Head</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Aravin</h4>
                  <h6>Finance Head</h6>
                </div>
                <p>
                  it to make a type specimen book. It has survived not only five
                  centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged. It was popularised in the
                  1960s with the release of Letraset sheets containing Lorem
                  Ipsum passages, and more recently with desktop publishing
                  software like Aldus PageMaker including versions of Lorem
                  Ipsum
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-05.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Lucas Finn</h4>
                  <h6>Team Leader</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Lucas Finn</h4>
                  <h6>Team Leader</h6>
                </div>
                <p>
                  it to make a type specimen book. It has survived not only five
                  centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged. It was popularised in the
                  1960s with the release of Letraset sheets containing Lorem
                  Ipsum passages, and more recently with desktop publishing
                  software like Aldus PageMaker including versions of Lorem
                  Ipsum
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-06.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Anto</h4>
                  <h6>Marketing Manager</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Anto</h4>
                  <h6>Marketing Manager</h6>
                </div>
                <p>
                  Mr. Anto, our Marketing Manager, passionately drives impactful
                  marketing campaigns, expanding the reach of badminton. With
                  expertise in brand management and digital marketing, he
                  elevates our presence and engages our target audience.
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-07.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Andrew</h4>
                  <h6>Designer</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Andrew</h4>
                  <h6>Designer</h6>
                </div>
                <p>
                  Mr. Andrew is a skilled badminton designer known for
                  transforming courts, creating striking packaging, designing
                  stylish apparel, and developing captivating tournament
                  branding.
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 team-item">
            <div className="info text-center">
              <div className="wrap">
                <div className="prfile-pic">
                  <ImageWithBasePath
                    src="assets/img/aboutus/team-08.jpg"
                    className="img-fluid"
                    alt="Team"
                  />
                </div>
                <div className="short-info">
                  <h4>Hendrita</h4>
                  <h6>Developer</h6>
                </div>
              </div>
              <div className="more">
                <div className="short-info">
                  <h4>Hendrita</h4>
                  <h6>Developer</h6>
                </div>
                <p>
                  it to make a type specimen book. It has survived not only five
                  centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged. It was popularised in the
                  1960s with the release of Letraset sheets containing Lorem
                  Ipsum passages, and more recently with desktop publishing
                  software like Aldus PageMaker including versions of Lorem
                  Ipsum
                </p>
                <ul className="social-medias d-inline-flex">
                  <li className="facebook">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="instagram">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                  <li className="twitter">
                    <Link to="#">
                      <i className="fa-brands fa-twitter" />
                    </Link>
                  </li>
                  <li className="pinterest">
                    <Link to="#">
                      <i className="fa-brands fa-pinterest" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  {/* /Page Content */}
</>

    </div>
  )
}

export default OurTeams