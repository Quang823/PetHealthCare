import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LoginForm.scss';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import logo from '../../Assets/v186_574.png';
import video from '../../Assets/7515875-hd_1080_1920_30fps.mp4';
import { loginApi } from '../../Service/UserService';
import { toast } from "react-toastify";
import { useAuth, UserContext } from "../../Context/UserContext";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { loginContext } = useAuth();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setEmailError(validateEmail(value) ? "" : "Invalid email format");
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value) ? "" : "Password must be at least 6 characters");
    };

    const registerLink = (event) => {
        event.preventDefault();
        navigate('/register');
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleLogin = async () => {
        setIsLoading(true);
        if (!email || !password) {
            setIsLoading(false);
            toast.error("Email/Password is required!");
            return;
        }

        let res = await loginApi(email, password);

        if (res && res.data && res.status === "ok") {
            const token = res.data; // token returned in res.data
            const decodedToken = jwtDecode(token); // decode token

            if (decodedToken && decodedToken.User.map.role) {
                const role = decodedToken.User.map.role;
                loginContext(email, token, role); // store login info


                if (role === "Admin") {
                    navigate('/testadmin/dashboard'); // admin page
                } else if (role === "Customer") {
                    navigate('/'); // customer page
                } else if (role === "Staff") {
                    navigate('/staff');
                } else if (role === "Veterinarian") {
                    navigate('/doctor');
                } else {
                    navigate('/'); // default page
                }

                toast.success("Login successful");
            } else {
                toast.error("Unable to retrieve user role");
            }
        } else {
            if (res && res.status === 401) {
                toast.error(res.data.error);
                toast.error("Wrong email or password");
            } else {
                toast.error("Login fail. Please try again!!!");
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="login-page flex">
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h3 className="title">Your pet's happiness is our priority</h3>
                        <p>Furry friends, endless joy</p>
                    </div>
                    <div className="footerDiv flex">
                        <p>
                            Don't have an account?
                            <a className="butn" onClick={registerLink}> Register</a>
                        </p>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <div className="logo-container">
                            <img src={logo} alt="Logo image" className="logo" />
                        </div>
                    </div>
                    <h3>Welcome</h3>
                    <div className="wrapper">
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                className={emailError ? 'invalid' : email ? 'valid' : ''}
                            />
                            <MdEmail className="iconv" />
                            {emailError && <p className="errors-messagess">{emailError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={passwordError ? 'invalid' : password ? 'valid' : ''}
                            />
                            <i
                                className={isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setIsShowPassword(!isShowPassword)}
                            ></i>
                            {passwordError && <p className="errors-messagess">{passwordError}</p>}
                        </div>
                        <div className="remember-forgot">
                            {/* <label>
                                <input type="checkbox" /> Remember me
                            </label> */}
                            <p className="forgot-password-link" onClick={handleForgotPassword}>
                                Forgot Password?
                            </p>
                        </div>
                        <button
                            type="submit"
                            className={email && password ? "active" : ""}
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner-container">
                                    <i className="spinner"></i> Login...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
