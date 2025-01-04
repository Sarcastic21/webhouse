import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Screenshot 2025-01-02 222219.png";
import '../Styles/HomePage.css';
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const HomePage = () => {
  const [user, setUser] = useState(null); // To store user data
  const [cards, setCards] = useState([]);  // Store fetched cards
  const [filteredCards, setFilteredCards] = useState([]); // Store filtered cards
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [searchQuery, setSearchQuery] = useState(''); // Store the search query
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const sidebarRef = useRef(null); // Reference to the sidebar
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Use the environment variable for API base URL

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
        const response = await axios.get(`${API_BASE_URL}/api/cardshome`);
        const sortedCards = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setCards(sortedCards); // Set fetched cards to state in sorted order
        setFilteredCards(sortedCards); // Initially set filtered cards to all cards
      } catch (err) {
        setError('Error fetching cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards(); // Fetch cards when the component mounts
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem('email'); // Get email from session storage
      if (!email) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/account?email=${email}`);
        setUser(response.data); // Set user data to state
      } catch (err) {
        setError('Error fetching user data');
      }
    };

    fetchUserData(); // Fetch user data
  }, [API_BASE_URL]);

  useEffect(() => {
    const filterCards = () => {
      const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

      const normalizedSearchQuery = normalizeString(searchQuery);

      if (!normalizedSearchQuery) {
        setFilteredCards(cards);
      } else {
        const filtered = cards.filter(card =>
          (card.name && normalizeString(card.name).includes(normalizedSearchQuery)) ||
          (card.category && normalizeString(card.category).includes(normalizedSearchQuery))
        );
        setFilteredCards(filtered);
      }
    };

    filterCards();
  }, [searchQuery, cards]);

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
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    className="search-bar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                <button
                        className="sidebar-account-button"
                        onClick={() => navigate("/account")}
                    >
                        NEW + 
                        </button>
                    <div className="card-list">
                        {filteredCards.map((card, index) => (
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
