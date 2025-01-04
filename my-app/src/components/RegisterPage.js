import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Screenshot 2025-01-02 222219.png"; 
import img1 from "../components/Screenshot 2025-01-02 221216.png"; // Adjust the path based on your folder structure
import '../Styles/Login.css';
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '',sport:'' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, formData);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after showing success message
    } catch (error) {
      setError(error.response?.data?.message || 'Error registering user');
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
        <div className="left">
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
        <button className="hamburger">
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

        <div className="login-container">
          <div className="login-form">
            <h2>Register</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
               <input
                type="text"
                name="sport"
                placeholder="sport"
                value={formData.sport}
                onChange={handleChange}
                required
              />
              <button type="submit">Register</button>
            </form>
            
            <p className="signup-link">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
          <div className="login-image">
            <img src={img1} alt="Logo"  />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
