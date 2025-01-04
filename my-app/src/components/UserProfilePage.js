import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../components/Screenshot 2025-01-02 222219.png"; 
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const UserDetailPage = () => {
  const { userId } = useParams(); // Get userId from the URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`);
        setUser(userResponse.data);

        // Fetch user's cards
        const cardsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}/cards`);
        setCards(cardsResponse.data);
      } catch (err) {
        console.error('Error fetching user details or cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      

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
      <div className="user-detail-page">

  
      
      <div className="account-container">
      <h1 className="account-title">PROFILE</h1>  
      <div className="user-details">
  <div className="detail-item">
    <p><span className="label">Name:</span> <span className="value">{user.name}</span></p>
  </div>
  <div className="detail-item">
    <p><span className="label">Email:</span> <span className="value">{user.email}</span></p>
  </div>
  <div className="detail-item">
    <p><span className="label">Mobile:</span> <span className="value">{user.mobile || 'N/A'}</span></p>
  </div>
</div>

  </div>
  <div className="user-cards1">
    <h2>Websites by {user.name}</h2>
    {cards.length > 0 ? (
      <div className="cards-container1">
        {cards.map((card) => (
          <div key={card._id} className="card1">
            <h3 className="card-title2">{card.name}</h3>
            <img
              className="card-image1"
              src={card.image}
              alt={card.name}
              onClick={() => navigate(`/card/${card._id}`)}

              
            />
           
          </div>
        ))}
      </div>
    ) : (
      <p className="no-cards-message">No cards found for this user.</p>
    )}
  </div>
</div>
</div>

    </div>
  );
};

export default UserDetailPage;
