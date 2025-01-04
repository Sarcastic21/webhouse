import React, { useEffect,useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Screenshot 2025-01-02 222219.png";
import '../Styles/HomePage.css';
import { FaHome, FaUser, FaComment, FaBars } from 'react-icons/fa'; // Import the required icons

const HomePage = () => {
    const [user, setUser] = useState(null); // To store user data
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [messages, setMessages] = useState([]); // Store chat messages
    const [newMessage, setNewMessage] = useState(''); // Input for a new message
    const navigate = useNavigate();
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

    // Fetch user data and chat messages
    useEffect(() => {
        const fetchUserData = async () => {
            const email = sessionStorage.getItem('email');
            if (!email) {
                setUser(null);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/users/account?email=${email}`);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user data');
            }
        };

       
            const fetchMessages = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/chat/messages');
                    setMessages(response.data);
                } catch (err) {
                    console.error('Error fetching messages');
                }
            };
        
          

        fetchUserData();
        fetchMessages();
    }, []);

    // Handle sending new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
    
        try {
            const response = await axios.post('http://localhost:5000/api/chat/messages', {
                name: user?.name || 'Anonymous',
                message: newMessage,
                creatorId: user?._id, // Include the creatorId of the logged-in user
            });
            setMessages([...messages, response.data]); // Update messages
            setNewMessage(''); // Clear input
        } catch (err) {
            console.error('Error sending message');
        }
    };

    // Navigate to creator profile
    const handleCreatorClick = (creatorId) => {
        console.log("Creator ID:", creatorId);
        navigate(`/user/${creatorId}`);
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

                {/* Main content */}
                <div className="right">
                    <div className="chat-room">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className="message">
                                    <strong
            className="message-sender"
            onClick={() => handleCreatorClick(msg.creatorId._id || msg.creatorId.id)} // Use the correct property
        >
                                        {msg.name}:
                                    </strong> 
                                    {msg.message}
                                </div>
                            ))}
                        </div>
                        <div className="message-input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
