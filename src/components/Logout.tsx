import { PoweroffOutlined } from '@ant-design/icons';
// import { useApolloClient } from '@apollo/client';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  // const client = useApolloClient();
  const handleLogout = () => {
    window.localStorage.clear();
    // client.resetStore().then(() => {
    setTimeout(() => { navigate('/', { replace: true }); }, 1000);
  };
  return <Button onClick={handleLogout} type="primary" shape="circle" icon={<PoweroffOutlined />} size="large" />;
}

export default Logout;
