import React from 'react'
import ImageWithBasePath from '../../core/data/img/ImageWithBasePath'
import { Link } from 'react-router-dom'
import { all_routes } from '../router/all_routes'

const CoachChat = () => {
  const routes = all_routes;
  return (
    
   <div>
  {/* Breadcrumb */}
  <section className="breadcrumb breadcrumb-list mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Chat</h1>
      <ul>
        <li><Link to="index">Home</Link></li>
        <li>Chat</li>
      </ul>
    </div>
  </section>
  {/* /Breadcrumb */}
  {/* Dashboard Menu */}
  <div className="dashboard-section coach-dash-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-menu coaurt-menu-dash">
                <ul>
                  <li>
                    <Link to={routes.coachDashboard}>
                      <ImageWithBasePath
                        src="assets/img/icons/dashboard-icon.svg"
                        alt="Icon"
                      />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.allCourt} className="active">
                      <ImageWithBasePath
                        src="assets/img/icons/court-icon.svg"
                        alt="Icon"
                      />
                      <span> Courts</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.coachRequest}>
                      <ImageWithBasePath
                        src="assets/img/icons/request-icon.svg"
                        alt="Icon"
                      />
                      <span>Requests</span>
                      <span className="court-notify">03</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.coachBooking}>
                      <ImageWithBasePath
                        src="assets/img/icons/booking-icon.svg"
                        alt="Icon"
                      />
                      <span>Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.coachChat}>
                      <ImageWithBasePath
                        src="assets/img/icons/chat-icon.svg"
                        alt="Icon"
                      />
                      <span>Chat</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.coachEarning}>
                      <ImageWithBasePath
                        src="assets/img/icons/invoice-icon.svg"
                        alt="Icon"
                      />
                      <span>Earnings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.coachWallet}>
                      <ImageWithBasePath
                        src="assets/img/icons/wallet-icon.svg"
                        alt="Icon"
                      />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={routes.coachProfile}>
                      <ImageWithBasePath
                        src="assets/img/icons/profile-icon.svg"
                        alt="Icon"
                      />
                      <span>Profile Setting</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  {/* /Dashboard Menu */}
  {/* Page Content */}
  <div className="content court-bg">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="chat-window">
            {/* Chat Left */}
            <div className="chat-cont-left">
              <form className="chat-search">
                <div className="form-custom">
                  <input type="text" className="form-control" placeholder="Search" />
                </div>
              </form>
              <div className="chat-users-list">
                <h3>Contacts</h3>
                <div className="chat-scroll">
                  <Link to="#" className="media">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-online">
                        <ImageWithBasePath src="assets/img/profiles/avatar-01.jpg" alt="User" className="avatar-img " />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach Issac Hendry</div>
                        <div className="user-last-chat"><i className="feather-check" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">2 min</div>
                        <div className="badge badge-success badge-pill">15</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" className="media active">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-online">
                        <ImageWithBasePath src="assets/img/profiles/avatar-02.jpg" alt="User" className="avatar-img" />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach John Portone</div>
                        <div className="user-last-chat"><i className="fa-solid fa-check-double" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">8:01 PM</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" className="media read-chat">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-online">
                        <ImageWithBasePath src="assets/img/profiles/avatar-03.jpg" alt="User" className="avatar-img" />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach Louie Noguera </div>
                        <div className="user-last-chat"><i className="fa-solid fa-check-double" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">7:30 PM</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" className="media read-chat">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-online">
                        <ImageWithBasePath src="assets/img/profiles/avatar-04.jpg" alt="User" className="avatar-img" />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach Michael Chambliss</div>
                        <div className="user-last-chat"><i className="fa-solid fa-check-double" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">6:59 PM</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" className="media read-chat">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-online">
                        <ImageWithBasePath src="assets/img/profiles/avatar-05.jpg" alt="User" className="avatar-img" />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach Nick Minot</div>
                        <div className="user-last-chat"><i className="fa-solid fa-check-double" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">11:21 AM</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" className="media read-chat">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-online">
                        <ImageWithBasePath src="assets/img/profiles/avatar-06.jpg" alt="User" className="avatar-img" />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach Peanut</div>
                        <div className="user-last-chat"><i className="fa-solid fa-check-double" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">10:05 AM</div>
                      </div>
                    </div>
                  </Link>
                  <Link to="#" className="media read-chat">
                    <div className="media-img-wrap">
                      <div className="avatar avatar-offline">
                        <ImageWithBasePath src="assets/img/profiles/avatar-08.jpg" alt="User" className="avatar-img" />
                        <span className="green-active" />
                      </div>
                    </div>
                    <div className="media-body">
                      <div>
                        <div className="user-name">Coach Hess</div>
                        <div className="user-last-chat"><i className="fa-solid fa-check-double" /> Hi!!!</div>
                      </div>
                      <div>
                        <div className="last-chat-time block">Yesterday</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            {/* /Chat Left */}
            {/* Chat Right */}
            <div className="chat-cont-right">
              <div className="chat-header">
                <Link id="back_user_list" to="#" className="back-user-list">
                  <i className="feather-chevrons-left" />
                </Link>
                <div className="media">
                  <div className="media-img-wrap">
                    <div className="avatar avatar-online">
                      <ImageWithBasePath src="assets/img/profiles/avatar-02.jpg" alt="User" className="avatar-img rounded-circle" />
                      <span className="green-active" />
                    </div>
                  </div>
                  <div className="media-body">
                    <div className="user-name">Coach Issac Hendry</div>
                  </div>
                </div>
                <div className="chat-options">
                  <div className="dropdown dropdown-action table-drop-action">
                    <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-ellipsis-v" /></Link>
                    <div className="dropdown-menu dropdown-menu-end">
                      <Link className="dropdown-item" to="#"><i className="feather feather-archive" />Achive</Link>
                      <Link className="dropdown-item" to="#"><i className="feather feather-mic-off" />Muted</Link>
                      <Link className="dropdown-item" to="#"><i className="feather feather-trash" />Delete</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-body">
                <div className="chat-scroll">
                  <ul className="list-unstyled">
                    <li className="media received">
                      <div className="avatar">
                        <ImageWithBasePath src="assets/img/profiles/avatar-03.jpg" alt="User" className="avatar-img rounded-circle" />
                      </div>
                      <div className="media-body">
                        <div className="msg-box">
                          <div>
                            <p>I Just Booked you for a single lesson ?</p>
                            <ul className="chat-msg-info">
                              <li>
                                <div className="chat-time">
                                  <span>8:30 AM</span>
                                  <span className="msg-seen"><i className="fa-solid fa-check-double" /></span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="chat-date">Today</li>
                    <li className="media received">
                      <div className="avatar">
                        <ImageWithBasePath src="assets/img/profiles/avatar-03.jpg" alt="User" className="avatar-img rounded-circle" />
                      </div>
                      <div className="media-body">
                        <div className="msg-box">
                          <div>
                            <p>Can you please Come with Players on same day??</p>
                            <ul className="chat-msg-info">
                              <li>
                                <div className="chat-time">
                                  <span>8:30 AM</span>
                                  <span className="msg-seen"><i className="fa-solid fa-check-double" /></span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="media sent">
                      <div className="media-body">
                        <div className="msg-box">
                          <div>
                            <p>Can you please Come with Players on same day??</p>
                            <div className="chat-msg-actions dropdown">
                              <Link to="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fe fe-elipsis-v" />
                              </Link>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item" to="#">Delete</Link>
                              </div>
                            </div>
                            <ul className="chat-msg-info">
                              <li>
                                <div className="chat-time">
                                  <span>8:30 AM</span>
                                  <span className="msg-seen"><i className="fa-solid fa-check-double" /></span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="avatar">
                        <ImageWithBasePath src="assets/img/profiles/avatar-02.jpg" alt="User" className="avatar-img rounded-circle" />
                      </div>
                    </li>
                    <li className="media received">
                      <div className="avatar">
                        <ImageWithBasePath src="assets/img/profiles/avatar-03.jpg" alt="User" className="avatar-img rounded-circle" />
                      </div>
                      <div className="media-body">
                        <div className="msg-box">
                          <div>
                            <p>I Just Booked you for a single lesson ?</p>
                            <ul className="chat-msg-info">
                              <li>
                                <div className="chat-time">
                                  <span>8:30 AM</span>
                                  <span className="msg-seen"><i className="fa-solid fa-check-double" /></span>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="chat-footer">
                <div className="form-custom">
                  <div className="input-group-prepend">
                    <i className="feather-paperclip" />
                  </div>
                  <div className="send-blk">
                    <input type="text" className="input-msg-send form-control" />
                    <div className="input-group-append">
                      <button type="button" className="btn msg-send-btn"><i className="feather-send" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Chat Right */}
          </div>
        </div>		
      </div>
    </div>
  </div>
  {/* /Page Content */}
</div>



  )
}

export default CoachChat