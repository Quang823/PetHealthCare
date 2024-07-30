import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { useAuth, UserContext } from '../../Context/UserContext';
import logo from '../../Assets/v186_574.png';
import { MdPets } from "react-icons/md";
import './Header.scss';
import {jwtDecode} from "jwt-decode";

const Headerfake = (props) => {
    const { logout, user } = useAuth();
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (user && token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken && decodedToken.User) {
                    setUserName(decodedToken.User.map.name);
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [user]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser && parsedUser.name) {
                    setUserName(parsedUser.name);
                }
            } catch (error) {
                console.error('Invalid user data:', error);
            }
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Success");
    };

    const handleManageAccount = () => {
        navigate("/manageAcc");
    };

    const handleBookingHistory = () => {
        navigate("/booking-history");
    };

    const handleRefundBooking = () => {
        navigate("/refundbooking");
    };

    const handleNavClick = (path) => {
        if (user && user.auth === true) {
            navigate(path);
        } else {
            toast.warn("You must be logged in to access this page.");
        }
    };

    return (
        <>
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand href="/">
                        <div className='logo-Tittle'>
                            <div className='logo-container'>
                                <img
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className='d-inline-block align-top'
                                    alt='React Bootstrap logo'
                                />
                            </div>
                            <span className='Title'>Pet Health Care</span>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {location.pathname !== '/login' && (
                                <>
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                    <NavLink to="/aboutfake" className="nav-link">About</NavLink>
                                    <Nav.Link onClick={() => handleNavClick("/pets")}>Manage Pet</Nav.Link>
                                    <Nav.Link onClick={() => handleNavClick("/booking")}>Booking</Nav.Link>
                                    <NavLink to="/contactfake" className="nav-link">Contact</NavLink>
                                    <Nav.Link onClick={() => handleNavClick("/feedback")}>Feedback</Nav.Link>
                                    <Nav.Link onClick={() => handleNavClick("/wallet")}>Wallet</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav>
                            {user && user.auth === true && (
                                <span className='nav-link'>
                                    <MdPets className='icon' /> Welcome {userName}
                                </span>
                            )}
                            <NavDropdown title="Option" id="basic-nav-dropdown">
                                {user && user.auth === true ? (
                                    <>
                                        <NavDropdown.Item onClick={handleManageAccount}>
                                            Manage Account
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleBookingHistory}>
                                            Booking History
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleRefundBooking}>
                                            Refund Booking
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleLogout}>
                                            <div className='Logout'>Logout</div>
                                        </NavDropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/login" className="dropdown-item">Login</NavLink>
                                        <NavLink to="/register" className="dropdown-item">Register</NavLink>
                                    </>
                                )}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Headerfake;
