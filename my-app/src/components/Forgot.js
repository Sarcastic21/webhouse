import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Screenshot 2025-01-02 222219.png";
import '../Styles/Login.css';
import img1 from "../components/Screenshot 2025-01-02 221216.png"; // Adjust the path based on your folder structure
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const Forgot = () => {
  const [formData, setFormData] = useState({ mobile: '', sport: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sidebarRef = useRef(null); // Reference to the sidebar

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState); // Toggle the sidebar state
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarActive(false); // Close the sidebar if clicked outside
    }
  };

  useEffect(() => {
    if (isSidebarActive) {
      document.addEventListener('mousedown', handleClickOutside); // Use 'mousedown' for better responsiveness
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup
    };
  }, [isSidebarActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      // Request to verify the user's mobile number and favorite sport
      const verifyResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/verify-sport`, formData);

      if (verifyResponse.data.success) {
        // If verification is successful, proceed to update the password
        const updateResponse = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/update-password`, {
          mobile: formData.mobile,
          newPassword: formData.newPassword,
        });

        setMessage(updateResponse.data.message);
        setTimeout(() => {
          navigate('/login'); // Redirect to login after success
        }, 2000);
      } else {
        setError('Mobile number and sport do not match.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <>
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <button
          className="account-button"
          onClick={() => navigate("/account")}
        >
          Account
        </button>
      </nav>

      <div className="main">
        {/* Left Sidebar */}
        <div
          ref={sidebarRef}
          className={`left ${isSidebarActive ? 'active' : ''}`}
        >
          <ul>
            <li onClick={() => navigate('/')}>Home</li>
            <li onClick={() => navigate('/account')}>Account</li>
            <li>My Files</li>
            <hr />
            <li>CATEGORY</li>
            <li onClick={() => navigate('/uiux')}>UI/UX</li>
            <li onClick={() => navigate('/3d')}>3D</li>
            <li onClick={() => navigate('/webdesign')}>Web Design</li>
            <li onClick={() => navigate('/appdesign')}>App Design</li>
            <li onClick={() => navigate('/chats')}>Chat Room</li>
          </ul>
        </div>

        {/* Mobile Hamburger Icon */}
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Footer Navigation for Mobile View */}
        <div className="footer-nav">
          <ul>
            <li onClick={() => navigate('/')} className="footer-nav-item">
              <FaHome className="footer-nav-icon" />
            </li>
            <li onClick={() => navigate('/account')} className="footer-nav-item">
              <FaUser className="footer-nav-icon" />
            </li>
            <li onClick={() => navigate('/chats')} className="footer-nav-item">
              <FaComment className="footer-nav-icon" />
            </li>
            <li className="footer-nav-item">
              <div className="dropdown">
                <FaBars className="footer-nav-icon" />
                <div className="dropdown-content">
                  <ul>
                    <li onClick={() => navigate('/uiux')}>UI/UX</li>
                    <li onClick={() => navigate('/3d')}>3D</li>
                    <li onClick={() => navigate('/webdesign')}>Web Design</li>
                    <li onClick={() => navigate('/appdesign')}>App Design</li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Forgot Password Form */}
        <div className="login-container">
      <div className="login-form">
            <h2>Forgot Password</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="sport"
                placeholder="Enter your favorite sport"
                value={formData.sport}
                onChange={handleChange}
                required
              />
              {formData.mobile && formData.sport && (
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              )}
              <button type="submit">Reset Password</button>
            </form>
            <p className="back-to-login">
              <a href="/login">Back to Login</a>
            </p>
          </div>
          <div className="forgot-image">
            <img src={img1} alt="Forgot Password Illustration" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
