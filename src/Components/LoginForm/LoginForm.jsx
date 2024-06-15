import { set } from "lodash";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LoginForm.scss';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import logo from '../../Assets/v186_574.png';
import video from '../../Assets/7515875-hd_1080_1920_30fps.mp4';
import { loginApi } from '../../Service/UserService';
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import { jwtDecode } from "jwt-decode";



const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const { loginContext } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);



    const registerLink = (event) => {
        event.preventDefault();
        navigate('/register');
    }

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleBack = () => {
        navigate("/")
    }
    const handleLogin = async () => {
        setIsLoading(true);
        if (!email || !password) {
            setIsLoading(false);
            toast.error("Email/Password is required!");
            return;
        }

        let res = await loginApi(email, password);
        console.log("test", res.data);

        if (res && res.data && res.status === "ok") {
            const token = res.data; // token được trả về trong res.data.token
            const decodedToken = jwtDecode(token);  // giải mã token


            if (decodedToken && decodedToken.User.role) {
                const role = decodedToken.User.role;
                console.log("check", role)
                loginContext(email, token, role); //  loginContext là hàm để lưu trữ thông tin đăng nhập

                if (role === "Admin") {
                    navigate('/admin'); // Đường dẫn tới trang admin
                } else if (role === "Customer") {
                    navigate('/'); // Đường dẫn tới trang customer
                } else if(role === "Staff"){
                     navigate('/staff')
                }else {
                    navigate('/'); // Điều hướng mặc định
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
                toast.error("Lgoin fail. Please try again!!!");
            }
        }
    };

    return (
        <>
            <div className="login-page flex">
                <div className="container flex">
                    <div className="videoDiv">
                        <video src={video} autoPlay muted loop></video>

                        <div className="textDiv">
                            <h2 className="title">Your pet's happiness is our priority</h2>
                            <p>Furry friends, endless joy</p>
                        </div>
                        <div className="footerDiv flex">
                            <p>
                                Don't have an account?
                                <a className="btn" onClick={registerLink}> Register</a>
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
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                                <MdEmail className="icon" />
                            </div>

                            <div className="input-box">
                                <input
                                    type={IsShowPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <i
                                    className={IsShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                    onClick={() => setIsShowPassword(!IsShowPassword)}
                                ></i>
                            </div>

                            <div className="remember-forgot">
                                <label>
                                    <input type="checkbox" /> Remember me
                                </label>


                                <p className="forgot-password-link" onClick={handleForgotPassword}>
                                    Forgot Password?
                                </p>
                            </div>

                            <button type="submit" className={email && password ? "active" : ""

                            } onClick={() => handleLogin()}>
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
        </>
    )
}

export default LoginForm;