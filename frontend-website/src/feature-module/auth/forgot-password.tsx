import React, { useEffect } from 'react'
import { all_routes } from '../router/all_routes'
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath';

const ForgotPassword = () => {
    const routes=all_routes;
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
  return (
    <div className='main-wrapper authendication-pages'>
	<div className="content blur-ellipses">
  <div className="container">
    <div className="row">
      <div className="col-md-6 col-lg-6 mx-auto vph-100 d-flex align-items-center">
        <div className="forgot-password w-100">
          <header className="text-center forgot-head-title">
            <Link to={routes.home}>
              <ImageWithBasePath src="assets/img/logo-black.svg" className="img-fluid" alt="Logo" />
            </Link>
          </header>
          <div className="shadow-card">
            <h2>Forgot Password</h2>
            <p>Enter Registered Email</p>								
            {/* Login Form */}
            <form action="login">
              <div className="form-group">
                <div className="group-img">
                  <i className="feather-mail" />
                  <input type="text" className="form-control" placeholder="Email" />
                </div>
              </div>
              <Link to={routes.login} className="btn btn-secondary w-100 d-inline-flex justify-content-center align-items-center">Submit<i className="feather-arrow-right-circle ms-2" /></Link>									
            </form>
            {/* /Login Form */}
          </div>
          <div className="bottom-text text-center">
            <p>Remember Password? <Link to={routes.login}>Sign In!</Link></p>
          </div>
        </div>
      </div>
    </div>
  </div>	
</div>
</div>
)
}

export default ForgotPassword