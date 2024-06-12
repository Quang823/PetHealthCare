import { ToastContainer, toast } from 'react-toastify';
import { useContext, useEffect } from 'react';
import './App.scss';
import Container from 'react-bootstrap/esm/Container';
import { Routes, Route } from 'react-router-dom'
import { UserContext } from './Context/UserContext';
import CustomerLayout from './CustomerLayout';
import AdminLayout from './AdminLayout';
import HomePage from './Components/Home/HomePage';
import AdminPage from './Components/Admin/Admin';
import './ToastifyCustom.css';
import AppRoute from './Routes/AppRoute';
function App() {
  const { user, loginContext } = useContext(UserContext);
  console.log("user", user)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(localStorage.getItem("email"), localStorage.getItem("token"))
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/admin" element={
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        } />
        <Route path="/" element={
          <CustomerLayout>
            <Container>
              <AppRoute></AppRoute>
            </Container>
          </CustomerLayout>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
