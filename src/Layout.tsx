import {
  HashRouter,
  Routes,
  Route, Navigate,
} from 'react-router-dom';
import BasicLayout from './components/BasicLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import CreateEmployee from './components/CreateEmployee';
import ReservationList from './components/ReservationList';
import ReservationDetail from './components/ReservationDetail';
import Chats from './components/Chats';
import Messages from './components/Messages';

function Layout() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Navigate to="reservations" />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm roleName="Guest" />} />
        <Route path="/" element={<BasicLayout />}>
          <Route path="createEmployee" element={<CreateEmployee />} />
          <Route path="reservations" element={<ReservationList />}>
            <Route path=":id" element={<ReservationDetail />} />
          </Route>
          <Route path="chats" element={<Chats />}>
            <Route path=":id" element={<Messages />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
export default Layout;
