import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Faq = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
   

<div>
  {/* Breadcrumb */}
  <div className="breadcrumb breadcrumb-list mb-0">
    <span className="primary-right-round" />
    <div className="container">
      <h1 className="text-white">Faq</h1>
      <ul>
        <li><Link to="index">Home</Link></li>
        <li>Faq</li>
      </ul>
    </div>
  </div>
  {/* /Breadcrumb */}
  {/* Page Content */}
  <div className="content">
    <div className="container">
      <div className="row">
        <div className="col-12 offset-sm-12 offset-md-1 col-md-10 col-lg-10">
          <div className="ask-questions">
            <div className="faq-info">
              <div className="accordion" id="accordionExample">
                {/* FAQ Item */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <Link to="#" className="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      How can I book a badminton court at Khelo Indore? 
                    </Link>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="accordion-content">
                        <p>Book your KheloIndore badminton court online or contact our customer service for seamless reservations.</p>
                      </div> 
                    </div>
                  </div>
                </div>
                {/* /FAQ Item */}
                {/* FAQ Item */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <Link to="#" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      What is the duration of a badminton court booking? 
                    </Link>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="accordion-content">
                        <p>Book your KheloIndore badminton court online or contact our customer service for seamless reservations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /FAQ Item */}
                {/* FAQ Item */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <Link to="#" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Can I rent badminton equipment at Khelo Indore? 
                    </Link>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="accordion-content">
                        <p>Book your KheloIndore badminton court online or contact our customer service for seamless reservations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /FAQ Item */}
                {/* FAQ Item */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <Link to="#" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      Are there any coaching services available for badminton at Khelo Indore?
                    </Link>
                  </h2>
                  <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="accordion-content">
                        <p>Book your KheloIndore badminton court online or contact our customer service for seamless reservations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /FAQ Item */}
                {/* FAQ Item */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <Link to="#" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                      Can I join badminton leagues or tournaments at Khelo Indore?
                    </Link>
                  </h2>
                  <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="accordion-content">
                        <p>Book your KheloIndore badminton court online or contact our customer service for seamless reservations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /FAQ Item */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Page Content */}
</div>



  
  )
}

export default Faq