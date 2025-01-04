import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin } from "react-icons/fa"; // Icons for social media

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section footer-left">
        <h4>Links</h4>
        <Link to="/">Home</Link>
        <Link to="/account">Account</Link>
        <Link to="/uiux">UI/UX</Link>
        <Link to="/webdesign">Web Design</Link>
        <Link to="/appdesign">App Design</Link>
        <Link to="/3d">3D</Link>
      </div>
      <div className="footer-section footer-center">
        <h4>About</h4>
        <p>
          This platform has been thoughtfully designed to provide you with a seamless way to showcase your website. Whether you're a developer, designer, or business owner, our goal is to make it easier for you to share your work with a broader audience. With an intuitive interface and powerful features, we aim to help you present your website in the best possible light and connect with those who matter most.
        </p>
      </div>
      <div className="footer-section footer-right">
        <h4>Contact</h4>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaInstagram size={20} /> Instagram
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FaLinkedin size={20} /> LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;
