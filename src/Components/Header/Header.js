import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import logo from '../../Assets/v186_574.png';
import { MdPets } from "react-icons/md";
import './Header.scss';
import { jwtDecode } from "jwt-decode";
const Header = (props) => {
    const { logout, user } = useContext(UserContext);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Kiểm tra xem token có tồn tại và là chuỗi hợp lệ không
        const token = localStorage.getItem('token');

        if (user && token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken && decodedToken.User) {
                    setUserName(decodedToken.User.map.name); // Cập nhật tên người dùng từ token giải mã
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [user]);
    useEffect(() => {
        // Kiểm tra xem token có tồn tại và là chuỗi hợp lệ không
        const user = localStorage.getItem('user');

        if (user) {
            try {
                if (user && user.name) {
                    setUserName(user.name); // Cập nhật tên người dùng từ token giải mã
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [user]);


    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Sucess")
    }
    const handleManageAccount = () => {
        navigate("/manageAcc");
    }
    const handleBookingHistory = () => {
        navigate("/booking-history");
    }
    const location = useLocation();
    return (
        <>
            <Navbar expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand href="/">
                        <div className='logo-Tittle'>
                            <div className='logo-container'>
                                <img src={logo}
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
                                    {/* <NavLink to="/users" className="nav-link" >Manage Pet</NavLink> */}
                                    <NavLink to="/about" className="nav-link">About</NavLink>
                                    <NavLink to="/allservices" className="nav-link">Service</NavLink>
                                    <NavLink to="/pets" className="nav-link">Manage Pet</NavLink>
                                    <NavLink to="/booking" className="nav-link">Booking</NavLink>
                                    <NavLink to="/contact" className="nav-link">Contact</NavLink>
                                    <NavLink to="/feedback" className="nav-link">Feedback</NavLink>

                                </>
                            )}
                        </Nav>

                        <Nav>
                            {user && user.auth === true && <span className='nav-link'> <MdPets className='icon' /> Welcome {userName} </span>}
                            <NavDropdown title="Option" id="basic-nav-dropdown">

                                {user && user.auth === true ? (


                                    <>
                                        <NavDropdown.Item onClick={() => handleManageAccount()}>
                                            Manage Account
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => handleBookingHistory()}>
                                            Booking History
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => handleLogout()}>
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
        </>)

}
export default Header;