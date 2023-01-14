import {
  Outlet, useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from 'antd';
import Logout from './Logout';

const { Header, Content } = Layout;

function BasicLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const hasLogin = Boolean(localStorage.getItem('messaging-user-token'));
    if (!hasLogin) {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ backgroundColor: '#0C0D12' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
        }}
        >
          <div>Gradual Community</div>
          <Logout />
        </div>
      </Header>
      <Content style={{ padding: '0px', height: '100%' }}><Outlet /></Content>
    </Layout>
  );
}
export default BasicLayout;
