import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Screenshot 2025-01-02 222219.png"; 
import '../Styles/Account.css';
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const AccountPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null); // To store user data
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    details: '',
    link: '',
    category: '',
    Github: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]); // To store cards of the logged-in user

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  // Handle form submission to post a new card
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = sessionStorage.getItem('email'); // Get email from session storage
    if (!email) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/cards`, {
        ...formData,
        creatorId: user._id, // Send creatorId (user's ID) along with card data
        email, // Send email along with card data
      });
      setCards([...cards, response.data]); // Add the new card to the state
      setFormData({
        name: '',
        image: '',
        details: '',
        link: '',
        category: '',
        Github: '',
      }); // Reset form
    } catch (err) {
      setError('Error posting new card');
    }
  };

  const categories = ['UI/UX', 'Web Design', 'App Design', '3D Model'];

  // Fetch user data and their cards
  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem('email'); // Get email from session storage
      if (!email) {
        navigate('/login'); // If not logged in, redirect to login page
      }

      try {
        // Fetch user data
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/account?email=${email}`);
        setUser(response.data); // Set user data to state

        // Fetch cards for this user
        const cardsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/cards?email=${email}`);
        setCards(cardsResponse.data); // Set the user's cards to the state
      } catch (err) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // Fetch user data and cards
  }, [navigate]);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();

    // Redirect to login page
    navigate('/');
  };

  // Loading, error, and user details display logic
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                <div className={`left ${isSidebarActive ? 'active' : ''}`}>
        <div className="detail">
          {/* Display the first letter as a logo */}
          <div className="logo2">
            {user ? user.name.charAt(0).toUpperCase() : "N"}
          </div>
          {/* Display the rest of the name */}
          <p className="Name">
            {user ? user.name : "Name"}
          </p>
        </div>
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
        <button 
        onClick={handleLogout} 
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#f44336', // Red color
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Logout
      </button>
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
<div className='right'>
<div className="account-container">
  <h1 className="account-title">My Account</h1>

  {/* Displaying User Details */}
  {user && (
    <div className="user-details">
      <div className="detail-item">
        <span className="label">Name:</span>
        <span className="value">{user.name}</span>
      </div>
      <div className="detail-item">
        <span className="label">Email:</span>
        <span className="value">{user.email}</span>
      </div>
      <div className="detail-item">
        <span className="label">Mobile:</span>
        <span className="value">{user.mobile}</span>
      </div>
    </div>
  )}
</div>




      {/* Logout Button */}
     

      <div className="form-container">
      <button
        className="toggle-button"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Close Form" : "Add Website"}
      </button>

      {showForm && (
        <div className="form-wrapper">
          <h2 className="form-title">Add a new website</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="form-label">Name:</label>
            <input
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <label className="form-label">Image URL:</label>
            <input
              className="form-input"
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              required
            />
            <label className="form-label">Details:</label>
            <textarea
              className="form-textarea"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              required
            ></textarea>
            <label className="form-label">Link:</label>
            <input
              className="form-input"
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              required
            />
            <label className="form-label">Category:</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="" disabled selected>
                Select a Category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label className="form-label">Github code Link</label>
            <input
              className="form-input"
              type="text"
              value={formData.Github}
              onChange={(e) =>
                setFormData({ ...formData, Github: e.target.value })
              }
              required
            />
            <button className="form-button" type="submit">
              Post Card
            </button>
          </form>
          {error && <div className="form-error">{error}</div>}
        </div>
      )}
    </div>
    <div className="user-cards1">

        <h2>Your Posts</h2>
        <div className="cards-container1">

        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card._id} className="card1"
            onClick={() => navigate(`/card/${card._id}`)}
             >

              <h3 className='card-title2'>{card.name}</h3>
              <img
              className="card-image1"
              src={card.image}
              alt={card.name}
            />            
              
           
            </div>

          ))
        ) : (
          
          <p>You have no cards yet.</p>
        )}
      </div>
      </div>

    </div>
    </div>
    </>

  );
};

export default AccountPage;
