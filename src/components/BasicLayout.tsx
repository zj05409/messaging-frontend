import {
    Outlet, useNavigate,
} from "react-router-dom";
import Logout from "./Logout";
import {useEffect} from "react";
import {Layout} from "antd";

const { Header, Content } = Layout;

const BasicLayout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const hasLogin = Boolean(localStorage.getItem('reservation-user-token'))
        if (!hasLogin) {
            navigate('/login', {replace: true})
        }
    }, [])


    return <Layout>
      <Header style={{backgroundColor: 'lightgray'}}>
        <div style={{
          display: "flex",
          justifyContent: 'space-between',
          alignItems: 'center'
        }
        }>
          <div>reservation app</div>
          <Logout/>
        </div>
      </Header>
      <Content style={{padding: '30px'}}><Outlet/></Content>
    </Layout>

}
export default  BasicLayout
