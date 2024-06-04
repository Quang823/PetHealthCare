import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import logo from '../Assets/v186_574.png';
import './Header.scss';
const Header = (props) => {
    const { logout, user } = useContext(UserContext);
    const [hideHeader, setHideHeader] = useState(false);



    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Sucess")
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
                                    {/* <NavLink to="/users" className="nav-link" >Manage User</NavLink> */}
                                    <NavLink to="/" className="nav-link">ABOUT</NavLink>
                                    <NavLink to="/" className="nav-link">PET SERVICE</NavLink>
                                    <NavLink to="/" className="nav-link">CONTACT US</NavLink>
                                </>
                            )}
                        </Nav>
                        <Nav >
                            {user && user.email && <span className='nav-link'>Welcome {user.email} </span>}
                            <NavDropdown title="Setting" id="basic-nav-dropdown">
                                {user && user.auth === true ? <NavDropdown.Item onClick={() => handleLogout()} >
                                    Logout
                                </NavDropdown.Item> : <NavLink to="/login" className="dropdown-item">Login</NavLink>}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>)

}
export default Header;