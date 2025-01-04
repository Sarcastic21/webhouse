import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Screenshot 2025-01-02 222219.png"; 
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const HomePage = () => {
  const [user, setUser] = useState(null); // To store user data
  const [cards, setCards] = useState([]);  // Store fetched cards
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const sidebarRef = useRef(null); // Reference to the sidebar
  const navigate = useNavigate();

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
    const fetchCards = async () => {
      try {
        const category = "Web Design";  // Example of hardcoded category, or you can make it dynamic
        // Use the environment variable for the base URL
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categorycards?category=${encodeURIComponent(category)}`);
        
        // Sort cards by 'createdAt' in descending order (latest first)
        const sortedCards = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setCards(sortedCards);  // Set fetched cards to state in sorted order
      } catch (err) {
        setError('Error fetching cards');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCards();  // Fetch cards when the component mounts
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem('email'); // Get email from session storage
      if (!email) {
        setUser(null); 
        return;
      }

      try {
        // Use the environment variable for the base URL
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/account?email=${email}`);
        setUser(response.data); // Set user data to state
      } catch (err) {
        setError('Error fetching user data');
      }
    };

    fetchUserData(); // Fetch user data
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      {/* Navbar */}
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
        {/* Right Section */}
        <div className="right">
          <div className="card-list">
            {cards.map((card, index) => (
              <div
                key={card._id}
                className={`card ${index === 0 ? "first-card" : ""}`}
                onClick={() => navigate(`/card/${card._id}`)}
              >
                <img src={card.image} alt={card.name} />
                <h3>{card.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
