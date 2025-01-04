import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../components/Screenshot 2025-01-02 222219.png";
import "../Styles/Dertail.css";
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const DetailPage = () => {
  const [user, setUser] = useState(null);
  const [card, setCard] = useState(null);
  const [relatedCards, setRelatedCards] = useState([]);
  const [creator, setCreator] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCard, setLoadingCard] = useState(true);
  const { id } = useParams();
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
    const fetchCardDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cards/${id}`);
        setCard(response.data.card);
        setRelatedCards(response.data.relatedCards);

        const creatorResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${response.data.card.creatorId}`);
        setCreator(creatorResponse.data);
      } catch (err) {
        console.error('Error fetching card details:', err);
      } finally {
        setLoadingCard(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem('email');
      if (!email) {
        setLoadingUser(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/account?email=${email}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  if (loadingUser || loadingCard) {
    return <div>Loading...</div>;
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
        <div className='margin'>
          <div className='First'>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
              <h1>{card.name}</h1>
              <img
                src={card.image}
                alt={card.name}
                style={{ width: '100%', maxWidth: '500px', height: 'auto', marginBottom: '20px' }}
              />
            </div>
            <div style={{ marginTop: '30px' }}>
              <div className='Creater-profile-view'>
              <h2>
  Creator: <span className="span">{creator.name.charAt(0).toUpperCase() + creator.name.slice(1)}</span>
</h2>
              <button
                className='Creater'
                onClick={() => navigate(`/user/${creator._id}`)}
              >
                View Creator's Profile
              </button>
              </div>
              <p className='detailsof'>{card.details}</p>
              <button 
                className="link-website"
                onClick={() => window.open(card.link, '_blank')}
              >
                Go to Website
              </button>
              <button
                className="link-website"
                onClick={() => window.open(card.Github, '_blank')}
              >
                View Code on GitHub
              </button>
            </div>
          </div>

          
        <div className="user-cards2">
  <h2>More - </h2>
  {relatedCards.length > 0 ? (
    <div className="cards-container">
      {relatedCards.map((relatedCard) => (
        <div key={relatedCard._id} className="card2">
          <h3 className="card-title">{relatedCard.name}</h3>
          <img
            className="card-image"
            src={relatedCard.image}
            alt={relatedCard.name}
            onClick={() => navigate(`/card/${relatedCard._id}`)} // Navigate on image click
            style={{ cursor: "pointer" }} // Indicate clickable image
          />
         
        </div>
      ))}
    </div>
  ) : (
    <p className="no-cards-message">No related cards found.</p>
  )}
</div>

</div>

        </div>
    </>
  );
};

export default DetailPage;
