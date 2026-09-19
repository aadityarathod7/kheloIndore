import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { all_routes } from "../router/all_routes";
import "./about-us.scss";

const AboutUs = () => {
  const routes = all_routes;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Khelo Indore";
  }, []);

  return (
    <main className="ki-about-page">
      <section className="ki-about-hero">
        <div className="container ki-about-hero-grid">
          <div>
            <p className="ki-about-eyebrow">ABOUT KHELO INDORE</p>
            <h1>Sport, made easier for <span>Indore.</span></h1>
            <p className="ki-about-lead">Find the right venue, coach, or trainer in one place—then spend less time searching and more time playing.</p>
            <div className="ki-about-actions">
              <Link to={routes.blogListSidebarLeft} className="ki-about-primary">Explore venues <i className="feather-arrow-right" /></Link>
              <Link to={routes.contactUs} className="ki-about-secondary">Talk to us</Link>
            </div>
            <div className="ki-about-proof" aria-label="Khelo Indore community highlights">
              <div><strong>50+</strong><span>venues</span></div>
              <div><strong>500+</strong><span>experts</span></div>
              <div><strong>10K+</strong><span>athletes</span></div>
            </div>
          </div>
          <div className="ki-about-hero-media">
            <ImageWithBasePath src="/assets/img/aboutus/banner-02.jpg" alt="Athletes enjoying sport" />
            <div className="ki-about-float-card"><i className="feather-heart" /><span>Built for every<br /><strong>kind of player</strong></span></div>
          </div>
        </div>
      </section>

      <section className="ki-about-intro">
        <div className="container ki-about-intro-grid">
          <p className="ki-about-section-label">OUR PURPOSE</p>
          <div className="ki-about-purpose-copy"><h2>Sport should be simple to access—and joyful to return to.</h2><p>From a quick evening court booking to ongoing coaching, Khelo Indore makes it easier to find the right place, person, and time for your sport.</p><p>It also gives venues, coaches, and trainers a clear way to reach more people in their local community.</p></div>
        </div>
      </section>

      <section className="ki-about-how">
        <div className="container"><div className="ki-about-heading"><p className="ki-about-section-label">ONE PLATFORM, MORE POSSIBILITIES</p><h2>Everything you need to get moving.</h2></div><div className="ki-about-feature-grid"><article><i className="feather-map-pin" /><h3>Discover places to play</h3><p>Browse venues by sport, location, and availability, then book a time that works for you.</p></article><article><i className="feather-users" /><h3>Learn from experts</h3><p>Find coaches and trainers for every stage of your sporting journey.</p></article><article><i className="feather-calendar" /><h3>Plan with confidence</h3><p>Keep bookings, sessions, and memberships organised in one easy experience.</p></article></div></div>
      </section>

      <section className="ki-about-values">
        <div className="container ki-about-values-grid"><div className="ki-about-values-media"><ImageWithBasePath src="/assets/img/aboutus/banner-03.jpg" alt="A racket and shuttlecock ready for play" /></div><div><p className="ki-about-section-label">WHAT GUIDES US</p><h2>Local at heart. Open to everyone.</h2><ul><li><i className="feather-check" /><span><strong>Community first</strong> — stronger sporting communities begin with easier connections.</span></li><li><i className="feather-check" /><span><strong>Clear and reliable</strong> — honest information and straightforward booking.</span></li><li><i className="feather-check" /><span><strong>Progress for all</strong> — whether you are starting out, training seriously, or sharing your expertise.</span></li></ul></div></div>
      </section>

      <section className="ki-about-cta"><div className="container"><div><p className="ki-about-eyebrow">READY WHEN YOU ARE</p><h2>Find the sport that fits your day.</h2></div><div className="ki-about-actions"><Link to={routes.blogListSidebarLeft} className="ki-about-light">Browse venues <i className="feather-arrow-right" /></Link><Link to={routes.coachesGrid} className="ki-about-outline">Meet coaches</Link></div></div></section>
    </main>
  );
};

export default AboutUs;
