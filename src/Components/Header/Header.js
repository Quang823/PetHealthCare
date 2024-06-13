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
                    setUserName(decodedToken.User.name); // Cập nhật tên người dùng từ token giải mã
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [user]);
    // useEffect(() => {
    //     // Kiểm tra xem user có tồn tại và có thông tin token không
    //     const token = localStorage.getItem('token');
    //     if (user && token) {

    //         const decodedToken = jwtDecode(token);
    //         const userName = decodedToken.User.name;

    //         // Lấy tên người dùng từ thông tin giải mã
    //         if (decodedToken && userName) {
    //             setUserName(userName);
    //         }
    //     }
    // }, [user]);

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Sucess")
    }
    const handleManageAccount = () => {
        navigate("/manageAcc");
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
                                    <NavLink to="/" className="nav-link">HOME</NavLink>
                                    {/* <NavLink to="/users" className="nav-link" >Manage Pet</NavLink> */}
                                    <NavLink to="/about" className="nav-link">ABOUT</NavLink>
                                    <NavLink to="/service" className="nav-link">SERVICE</NavLink>
                                    <NavLink to="/pets" className="nav-link">MANAGE PET</NavLink>
                                    <NavLink to="/booking" className="nav-link">BOOKING</NavLink>
                                    <NavLink to="/contact" className="nav-link">CONTACT</NavLink>

                                </>
                            )}
                        </Nav>

                        <Nav>
                            {user && user.auth === true && <span className='nav-link'> <MdPets className='icon' /> WELCOME {userName} </span>}
                            <NavDropdown title="Setting" id="basic-nav-dropdown">

                                {user && user.auth === true ? (


                                    <>
                                        <NavDropdown.Item onClick={() => handleManageAccount()}>
                                            Manage Account
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => handleLogout()}>
                                            <div className='Logout'>Logout</div>
                                        </NavDropdown.Item>
                                    </>
                                ) : (
                                    <NavLink to="/login" className="dropdown-item">Login</NavLink>
                                )}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>)

}
export default Header;