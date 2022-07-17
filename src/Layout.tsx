import {
    HashRouter,
    Routes,
    Route, Navigate,
} from "react-router-dom";
import BasicLayout from "./components/BasicLayout";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import CreateEmployee from "./components/CreateEmployee";
import ReservationList from "./components/ReservationList";
import ReservationDetail from "./components/ReservationDetail";

const Layout = () => {
    return <HashRouter>
        <Routes>
          <Route index element={<Navigate to='reservations'/>} />
            <Route path="login" element={<LoginForm/>}/>
            <Route path="register" element={<RegisterForm role={'Guest'}/>}/>
            <Route path="/" element={<BasicLayout/>}>
                <Route path="createEmployee" element={<CreateEmployee/>}/>
                <Route path="reservations" element={<ReservationList />}>
                    <Route path=":id" element={<ReservationDetail />} />
                </Route>
            </Route>
        </Routes>
    </HashRouter>
}
export default  Layout
