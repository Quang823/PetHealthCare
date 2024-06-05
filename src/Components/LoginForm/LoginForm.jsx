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
import { jwtDecode } from "jwt-decode";
// import jwt_decode from "jwt-decode";


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

    // const handleLogin = async () => {
    //     if (!email || !password) {
            
    //         toast.error("Email/Password is required!");
    //         return;
    //     }
        
    //     let res = await loginApi(email, password);
    //     console.log("test",res)
    //    if (res && res.data && res.status == "ok") {
           
    //         loginContext(email, res.data)
            
    //         navigate('/');

    //         toast.success("Login thanh cong")

    //     } else {
    //         if (res && res.status === 401) {
    //             toast.error(res.data.error)
    //             toast.error("sai mk");
    //         }
    //     }
    // }
    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email/Password is required!");
            return;
        }
    
        let res = await loginApi(email, password);
        console.log("test", res.data);
    
        if (res && res.data && res.status === "ok") {
            const token = res.data; // Giả sử token được trả về trong res.data.token
            const decodedToken = jwtDecode(token);
    
            if (decodedToken && decodedToken.Role) {
                const role = decodedToken.Role;
              console.log("check",role)
                loginContext(email, token, role); // Giả sử loginContext là hàm để lưu trữ thông tin đăng nhập
    
                navigate('/');
    
                toast.success("Login thành công");
            } else {
                toast.error("Không lấy được thông tin vai trò");
            }
        } else {
            if (res && res.status === 401) {
                toast.error(res.data.error);
                toast.error("Sai tài khoản hoặc mật khẩu");
            } else {
                toast.error("Đăng nhập thất bại");
            }
        }
    };
    // }
    // async function handleLogin(email, password) {
    //     let res;
    //     try {
    //         res = await loginApi(email, password);
    //         console.log("test", res);
    //     } catch (error) {
    //         console.error("Error logging in:", error);
    //         toast.error("An error occurred during login");
    //         return;
    //     }
    
    //     if (res && res.data) {
    //         // Decode JWT to get role
    //         try {
    //             const decoded = jwt_decode(res.data);
    //             const role = decoded.role;
    
    //             // Call login context with email and role
    //             loginContext(email, role);
    //             navigate('/');
    //             toast.success("Login successful");
    
    //         } catch (decodeError) {
    //             console.error("Error decoding JWT:", decodeError);
    //             toast.error("An error occurred while decoding the token");
    //         }
    
    //     } else {
    //         if (res && res.status === 400) {
    //             toast.error(res.data.error);
    //         } else {
    //             toast.error("Login failed");
    //         }
    //     }
    // }
    // const handleLogin = async () => {
    //     try {
    //         if (!email || !password) {
    //             toast.error("Email/Password is required!");
    //             return;
    //         }
            
            
    //         let res = await loginApi(email, password);
    //         console.log("test", res);

           
            
    //         if (res && res.data ) {
    //             loginContext(email, res.data);
    //             navigate('/');
    //             toast.success("Login thành công");
    //         } else {
    //             if (res && res.status == "400") {
    //                 toast.error(res.data.error);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         toast.error("Đã xảy ra lỗi khi đăng nhập!");
    //     }
    // };
    


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
                                    onClick={() =>handleLogin()}
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
