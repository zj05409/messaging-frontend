import { Avatar, Button, List } from 'antd';
import { useQuery } from '@apollo/client';
import { Link, Outlet } from 'react-router-dom';
import moment from 'moment';
import { ALL_RESERVATIONS, CURRENT_USER } from '../queries';

function ReservationList() {
  const result = useQuery(ALL_RESERVATIONS, { fetchPolicy: 'no-cache' });
  const currentUser = useQuery(CURRENT_USER, { fetchPolicy: 'no-cache' });

  const list = result.data?.listAllReservation || [];
  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>

      {currentUser?.data?.currentUserInfo?.roles?.includes('Guest') && <Link to="new"><Button>Add</Button></Link>}
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item:any) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={(
                <Link to={item._id}>
                  {item.name}
                  {' '}
                  <Button>Edit</Button>
                </Link>
)}
              description={(
                <div>
                  Expected Arrive Time:
                  {moment(item.expectedArriveTime).format('YYYY-MM-DD HH:mm')}
                </div>
)}
            />
          </List.Item>
        )}
      />
      <Outlet />
    </div>

  );
}

export default ReservationList;
