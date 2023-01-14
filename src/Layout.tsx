import {
  HashRouter,
  Routes,
  Route, Navigate,
} from 'react-router-dom';
import BasicLayout from './components/BasicLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Chats from './components/Chats';
import Messages from './components/Messages';

function Layout() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Navigate to="chats" />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm roleName="User" />} />
        <Route path="/" element={<BasicLayout />}>
          <Route path="chats" element={<Chats />}>
            <Route path=":id" element={<Messages />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
export default Layout;
