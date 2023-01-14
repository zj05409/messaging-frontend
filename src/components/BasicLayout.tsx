import {
  Link,
  Outlet, useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Layout } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
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
          <div>
            <Link to="/chats">
              <Button type="primary" shape="circle" icon={<HomeOutlined />} size="large" />
            </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;Gradual Community
          </div>
          <Logout />
        </div>
      </Header>
      <Content style={{ padding: '0px', height: '100%' }}><Outlet /></Content>
    </Layout>
  );
}
export default BasicLayout;
