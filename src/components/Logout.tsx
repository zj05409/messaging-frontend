import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };
  return <Button onClick={handleLogout}>Logout</Button>;
}

export default Logout;
