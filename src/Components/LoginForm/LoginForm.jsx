import { set } from "lodash";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './LoginForm.scss';
import { FaUser } from "react-icons/fa";
import logo from '../../Assets/v186_574.png';
import video from '../../Assets/7515875-hd_1080_1920_30fps.mp4';
import { loginApi } from '../../Service/UserService';
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import instance from "../../Service/axios";
const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const { loginContext } = useContext(UserContext);
    const registerLink = (event) => {
        event.preventDefault();
        navigate('/register');
    }

    // const homePageLink = (event) => {
    //     event.preventDefault();
    //     navigate('/');
    // }


    const handleBack = () => {
        navigate("/")
    }

    // useEffect(() => {
    //     let token = localStorage.getItem("token");
    //     if (token) {
    //         navigate("/");
    //     }
    // }, [])

    // const handleLogin = async () => {
    //     if (!email || !password) {

    //         toast.error("Email/Password is required!");
    //         return;
    //     }

    //     let res = await loginApi(email, password);
    //     console.log("test", res)
    //     if (res && res.token) {
    //         localStorage.setItem("token", res.token);
    //         navigate('/');
    //         toast.success("Login sucessfull")
    //     } else {
    //         if (res && res.status === 400) {
    //             toast.error(res.data.error)
    //         }
    //     }
    // }
    // const handleLogin = async () => {
    //     if (!email || !password) {

    //         toast.error("Email/Password is required!");
    //         return;
    //     }

    //     let res = await loginApi(email, password);
    //     console.log("test", res)
    //     if (res && res.token) {

    //         loginContext(email, res.email)

    //         navigate('/');

    //         toast.success("Login sucessfull")

    //     } else {
    //         if (res && res.status === 400) {
    //             toast.error(res.data.error)
    //         }
    //     }

    // }
    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email/Password is required!");
            return;
        }

        try {
            let res = await instance.post('/api/login', {
                email: email,
                password: password,
            });
            console.log("test", res);

            // Check if the API call was successful and returned a valid token
            if (res && res.token) {
                loginContext(email, res.token); // Pass email and token
                navigate('/');
                toast.success("Login successful");
            } else {
                toast.error("Login failed. Please check your email and password.");
            }
        } catch (error) {
            // Handle failed login with appropriate message
            if (error.status === 400) {
                toast.error(error.data.error);
            } else {
                toast.error(error.message || "An unexpected error occurred. Please try again.");
            }
            console.error("Login error:", error);
        }
    };

    // const handleLogin = async () => {
    //     if (!email || !password) {

    //         toast.error("Email/Password is required!");
    //         return;
    //     }

    //     let res = await loginApi(email, password);
    //     console.log("test", res)
    //     if (res && res.token) {

    //         loginContext(email, res.token)

    //         navigate('/');

    //         toast.success("Login success")

    //     } else {
    //         if (res && res.status === 400) {
    //             toast.error(res.data.error)
    //         }
    //     }
    // }

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
                        <h3>Welcome back</h3>
                        <div className="wrapper">

                            <h1>Login</h1>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                                <FaUser className="icon" />
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
                                <a href="#">Forgot Password?</a>
                            </div>

                            <button className={email && password ? "active" : ""

                            }


                                // onClick={() => handleLogin()}
                                onClick={() => handleLogin()}

                            >
                                <i className="fas fa-sync fa-spin">
                                </i>Login</button>

                            {/* <div className="back">
                                <i className="fa-solid fa-arrow-left"></i>
                                <span onClick={() => handleBack()}>Go back</span>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginForm;
