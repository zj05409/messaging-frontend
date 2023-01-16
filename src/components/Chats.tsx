/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  List, Input,
} from 'antd';
import { useQuery } from '@apollo/client';
import {
  Outlet, useLocation, useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import {
  useState,
} from 'react';
import moment from 'moment';
import {
  ALL_CHATS, FIND_MESSAGE,
} from '../queries';

const Ctn = styled.div`
  background-color: #1C1C20;
  display: flex;
  width: 100%;
  height: 100%;
  .searchBox {
    padding: 20px;
    display: flex;
    height: 64px;
    align-items: center;
    align-content: center;
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.1);
    svg {
        width: 13.48px;
        height: 13.48px;
    }
    input {
      flex: 1;
      backgroundColor: '#1C1C20';
      border: none;
    }
  }
  .chatList {
    width: 20em;
    color: white;
  }
  .chatItem, .chatItemActive {
    padding: 20px;
    color: white;
    display: flex;
  }
  .chatItemActive {
    background: #26252D;
  }
  .chatSummary {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .chatItemHeader {
    align-items: center;
    align-content: center;
    display: flex;
    justify-content: space-between;
  }
  .chatAvatarContainer {
    position: relative;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    overflow:visible;
  }
  .chatName {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 23px;
    color: #C9C7D0;
    overflow: hidden;
  }
  .recentMessageTime {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 130%;
    color: #7B798F;
  }
  .recentMessageExtract {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #7B798F;
    overflow: hidden;
  }
  .chatDetail {
    flex: 1;
  }
  .chatAvatar {
    width: 100%;
    height: 100%;
    border-radius:50%; 
  }
  .chatUnreadMessageCount {
    position: absolute;
    width: 18px;
    height: 18px;
    right: -7px;
    top: -3px;
    background: #FE3438;
    border-radius: 100px;
    text-align: center;
    line-height: 18px;
  }
  .ant-input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #1C1C20 inset;
    color: white;
  }
  .ant-input, input {
    box-shadow: 0 0 0 1000px #1C1C20 inset;
    color: white;
  }

`;
function ChatList() {
  const location = useLocation();
  const chats = useQuery(ALL_CHATS, {
    // fetchPolicy: 'no-cache'
  });
  const allMessages = useQuery(FIND_MESSAGE, {
    // fetchPolicy: "no-cache",
    variables: { chatId: null },
  });

  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();
  const list = chats.data?.chats || [];
  if (chats.loading || allMessages.loading) {
    return <div>loading...</div>;
  }
  if (location.pathname === '/chats' && list[0]) {
    setTimeout(() => navigate(`/chats/${list[0].id}`));
  }

  return (
    <Ctn>
      <div className="chatList">
        <div className="searchBox">
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.82501" cy="7.82495" r="6.74142" stroke="#7B798F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5138 12.8639L15.1568 15.5" stroke="#7B798F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Input placeholder="Search" value={searchText} onChange={(e) => { setSearchText(e.target.value); }} />
        </div>
        <List
          itemLayout="horizontal"
          dataSource={list.filter((chat: { name: string }) => chat.name.indexOf(searchText) >= 0)}
          renderItem={(item:any) => {
            const unreadCount = allMessages?.data?.messages?.filter(
              (m: {chatId: any, read: any}) => m.chatId === item.id && !m.read,
            )?.length;
            const messages = allMessages?.data?.messages?.filter(
              (m: {chatId: any, read: any}) => m.chatId === item.id,
            );
            const recentMessage = messages?.length ? messages[messages.length - 1] : null;
            return (
              <div className={location.pathname.endsWith(item.id) ? 'chatItemActive' : 'chatItem'}>
                <div className="chatAvatarContainer">
                  {!!unreadCount && (
                  <div className="chatUnreadMessageCount">
                    {unreadCount}
                  </div>
                  )}
                  <img className="chatAvatar" src={item.avatar} alt="chatAvatar" />
                </div>
                <div
                  className="chatSummary"
                  onClick={() => {
                    setTimeout(() => { navigate(`/chats/${item.id}`); });
                  }}
                >
                  <div className="chatItemHeader">
                    <div className="chatName">
                      <div
                        style={{ color: '#6B6971' }}
                      >
                        {item.name}
                      </div>
                    </div>
                    <div className="recentMessageTime">{recentMessage?.createdAt && moment(new Date(Number(recentMessage?.createdAt))).utcOffset('8').format('HH:mm')}</div>
                  </div>
                  <div className="recentMessageExtract">{recentMessage?.content}</div>
                </div>
              </div>
            );
          }}
        />
      </div>
      <div className="chatDetail">
        <Outlet />
      </div>
    </Ctn>

  );
}

export default ChatList;
