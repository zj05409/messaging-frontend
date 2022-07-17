import {
    BrowserRouter,
    Routes,
    Route, Outlet, Navigate,
} from "react-router-dom";
import BasicLayout from "./components/BasicLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CreateEmployee from "./components/CreateEmployee";
import ReservationList from "./components/ReservationList";
import ReservationDetail from "./components/ReservationDetail";

const Layout = () => {
    return <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to='reservations'/>} />
            <Route path="login" element={<LoginForm/>}/>
            <Route path="register" element={<RegisterForm role={'Guest'}/>}/>
            <Route path="/" element={<BasicLayout/>}>
                <Route path="createEmployee" element={<CreateEmployee/>}/>
                <Route path="reservations" element={<ReservationList />}>
                    <Route path=":id" element={<ReservationDetail />} />
                    <Route path="add" element={<div>add</div>} />
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}
export default  Layout
