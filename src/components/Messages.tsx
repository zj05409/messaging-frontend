/* eslint-disable react/no-danger */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Button, message,
} from 'antd';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  useEffect, useRef, useState,
} from 'react';
import moment from 'moment';
import {
  CREATE_MESSAGE, FIND_MESSAGE, CURRENT_USER,
  GET_CHAT, DELETE_MESSAGE, NEW_MESSAGE, MESSAGE_DELETED,
} from '../queries';

const Ctn = styled.div`
  height: 100%;
  background-color: #26242B;
  // padding: 3em;
  display: flex;
  flex-direction: column;
  .chatHeader {
    padding: 20px;
    display: flex;
    height: 64px;
    align-items: center;
    align-content: center;
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.1);
    // width: 100%;
    // height: 2rem;
    // display: flex;
    // border-bottom: 5px solid #2B2A30;
    justify-content: space-between;
    // padding: 0.2rem 1rem;
  }
  .chatTitle {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 130%;
    color: #FFFFFF;
  }
  .chatUserCount {
    display:flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    padding: 0.2rem 1.5rem;
    border-radius: 50px;
    color: white;
    border: 1px solid #7B798D;
    gap: 15px;
  }
  .left {
    float: left;
    clear: both;
  }
  .right {
    float: right;
    clear: both;
    text-align: right;
  }
  .chatBody {
    // display: flex;
    // flex-direction: column;
    flex: 1;
    overflow: auto;
    padding: 20px;
  }

  .messageContainer {
    max-width: 70%;
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
  .messageBody {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .messageBodyHeader {
    display: flex;
    gap: 10px;
  }
  .messageContainer.right .messageBodyHeader {
    justify-content: right;
  }
  .messageSenderName {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    color: #C9C7D0;
  }
  .messageTime {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    color: #7B798F;
  }
  .messageSenderAvatar {
    width: 40px;
    height: 40px;
    border-radius:50%; 
    overflow:hidden;
  }
  .menuButtonContainer {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    height: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    gap: 5px;
  }
  .menuButton {
    // color: #78777F;
    color: white;
    padding: 0 10px;
    justify-content: center;
    align-content: center;
  }
  .menuButton:hover {
    color: black;
    background-color: white;
  }
  .myMessage, .otherMessage {
    display: flex;
    align-items: center;
    gap: 7.5px;
    .menuButtonContainer {
      display: none;
    }
  }
  .myMessage:hover, .otherMessage:hover { 
    .menuButtonContainer {
      display: flex;
    }
  }
  .messageContent {
    font-size: 0.8rem;
    padding: 0.5rem;
    padding: 15px;
  }
  .myMessage .messageContent{
    background: linear-gradient(0deg, rgba(4, 177, 125, 0.5), rgba(4, 177, 125, 0.5)), #FFFFFF;
    border-radius: 8px 0px 8px 8px;
    color: #0C0E13;
  }
  .otherMessage .messageContent{
    background: #454451;
    border-radius: 0px 8px 8px 8px;
    color: #FFFFFF;
  }
  .chatInput {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 160%;
    color: #FFFFFF;
    max-height: 100px;
    background: #26252D;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px 20px;
    textarea, textarea:focus {
      width: 100%;
      height: 100%;
      background: transparent; 
      border: none;
      outline: none;
    }
  }
  .messageReference {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0px 20px;
  }
  .chatReferenceMessage {
    display: flex;
    padding: 10px;
    gap: 10px;
    background: #35343E;
    border-radius: 8px;
    color: #7B798F;
  }
  .refBar {
    width: 2px;
    height: 20px;
    background: #04B17D;
    border-radius: 100px;
  }
  .inputReferenceMessage {
    display: flex;
    gap: 5px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 160%;
    color: #7B798F;
    background: #35343E;
    border-radius: 8px;
    width: 349px;
    overflow: hidden;
    padding: 10px;
  }
  .deleteReferenceButton {
    border: none;
    background: transparent;
  }
`;

function ChatDetail() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dummyDivRef = useRef<HTMLDivElement>(null);
  const { id: chatId } = useParams();

  const { cache } = useApolloClient();
  const chat = useQuery(GET_CHAT, {
    fetchPolicy: 'no-cache',
    variables: { chatId },
    skip: !chatId,
  });

  const { subscribeToMore, ...allMessages } = useQuery(FIND_MESSAGE, {
    // fetchPolicy: "no-cache",
    variables: { chatId: null },
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [atUser] = useState<Record<string, unknown>|null>(null);
  const [
    referenceMessage,
    setReferenceMessage,
  ] = useState<{content: string, id: string}|null>(null);
  const currentUser = useQuery(CURRENT_USER, { fetchPolicy: 'no-cache' });
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    onError: (error) => {
      message.error(error.graphQLErrors[0]?.message || 'net Error');
    },
  });
  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    onError: (error) => {
      message.error(error.graphQLErrors[0]?.message || 'net Error');
    },
  });
  useEffect(() => {
    if (allMessages.data?.messages?.length
      && !allMessages.data?.messages[allMessages.data.messages.length - 1].read
      && allMessages.data?.messages[allMessages.data.messages.length - 1].chatId === chatId) {
      dummyDivRef.current?.scrollIntoView({ behavior: 'smooth' });
      cache.updateQuery({ query: FIND_MESSAGE, variables: { chatId: null } }, (data) => ({
        messages: (data?.messages || []).map((m: any) => (
          { ...m, read: m.chatId === chatId ? true : m.read })),
      }));
    }
  }, [allMessages]);

  useEffect(() => {
    cache.updateQuery({ query: FIND_MESSAGE, variables: { chatId: null } }, (data) => ({
      messages: (data?.messages || []).map((m: any) => (
        { ...m, read: m.chatId === chatId ? true : m.read })),
    }));
    setTimeout(() => dummyDivRef.current?.scrollIntoView({}), 100);
  }, [chatId]);

  const list = allMessages.data?.messages || [];

  const currentUserId = currentUser?.data?.currentUserInfo?.username;

  useEffect(
    () => {
      subscribeToMore({
        document: NEW_MESSAGE,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData?.data?.messageCreated
          // || subscriptionData.data.messageCreated.chatId !== chatId
          ) {
            return prev;
          }
          const newFeedItem = subscriptionData.data.messageCreated;

          return { ...(prev || {}), messages: [...prev.messages, newFeedItem] };
        },
      });
      subscribeToMore({
        document: MESSAGE_DELETED,
        // variables: { postID: params.postID },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData?.data?.messageDeleted) return prev;
          const newFeedItem = subscriptionData.data.messageDeleted;

          return {
            ...prev,
            messages: (prev.messages || []).filter(
              (m: { id: string }) => m.id !== newFeedItem,
            ),
          };
        },
      });
    },
    [],
  );
  useEffect(() => {
    if (referenceMessage) {
      textareaRef?.current?.focus();
    }
  }, [referenceMessage]);

  if (allMessages.loading || currentUser.loading || chat.loading) {
    return <div>loading...</div>;
  }
  return (
    <Ctn>
      <div className="chatHeader">
        <div className="chatTitle">{chat?.data?.chat?.name}</div>
        <div className="chatUserCount">
          <svg style={{ overflow: 'visible' }} width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M6 8C8.20914 8 10 6.20914 10 4C10 1.79086 8.20914 0 6 0C3.79086 0 2 1.79086 2 4C2 6.20914 3.79086 8 6 8ZM6 6C7.10457 6 8 5.10457 8 4C8 2.89543 7.10457 2 6 2C4.89543 2 4 2.89543 4 4C4 5.10457 4.89543 6 6 6Z" fill="white" />
            <path d="M9 11C9.55228 11 10 11.4477 10 12V18H12V12C12 10.3431 10.6569 9 9 9H3C1.34315 9 0 10.3431 0 12V18H2V12C2 11.4477 2.44772 11 3 11H9Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8ZM12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6Z" fill="white" />
            <path d="M15 11C15.5523 11 16 11.4477 16 12V18H18V12C18 10.3431 16.6569 9 15 9H9C7.34315 9 6 10.3431 6 12V18H8V12C8 11.4477 8.44772 11 9 11H15Z" fill="white" />
          </svg>

          <div>{chat?.data?.chat?.users?.length}</div>
        </div>
      </div>
      <div className="chatBody">
        {
              list.filter((messageItem:any) => messageItem.chatId === chatId)
                .map((messageItem: any) => {
                  const time = messageItem?.createdAt && moment(new Date(Number(messageItem?.createdAt))).utcOffset('8').format('HH:mm');
                  return (
                    <div key={messageItem.id} className={`messageContainer ${messageItem.userId === currentUserId ? 'right' : 'left'}`}>
                      {messageItem.userId === currentUserId ? (
                        <>

                          <div className="messageBody">
                            <div className="messageBodyHeader">
                              <div className="messageSenderName">{messageItem.userId}</div>
                              <div className="messageTime">{time}</div>
                            </div>
                            <div className="myMessage">
                              <div className="menuButtonContainer">
                                <div
                                  onClick={() => {
                                    setReferenceMessage(messageItem);
                                  }}
                                  className="menuButton"
                                >
                                  <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 0C1.85 0 0.5 1.35 0.5 3V8H5.5V3H1.5C1.5 1.8905 2.3905 1 3.5 1V0ZM10.5 0C8.85 0 7.5 1.35 7.5 3V8H12.5V3H8.5C8.5 1.8905 9.3905 1 10.5 1V0ZM1.5 4H4.5V7H1.5V4ZM8.5 4H11.5V7H8.5V4Z" fill="#C9C7D0" />
                                  </svg>
                                </div>
                                <div onClick={() => confirm('Are you sure to delete？') && deleteMessage({ variables: { id: messageItem.id } })} className="menuButton">
                                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.1667 6.33333V12.6C11.1667 12.7061 11.1245 12.8078 11.0495 12.8828C10.9745 12.9579 10.8728 13 10.7667 13H2.23333C2.12725 13 2.02551 12.9579 1.95049 12.8828C1.87548 12.8078 1.83333 12.7061 1.83333 12.6V6.33333M5.16667 10.3333V6.33333M7.83333 10.3333V6.33333M12.5 3.66667H9.16667M0.5 3.66667H3.83333M3.83333 3.66667V1.4C3.83333 1.29391 3.87548 1.19217 3.95049 1.11716C4.0255 1.04214 4.12725 1 4.23333 1H8.76667C8.87275 1 8.9745 1.04214 9.04951 1.11716C9.12452 1.19217 9.16667 1.29391 9.16667 1.4V3.66667M3.83333 3.66667H9.16667" stroke="#C9C7D0" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                              </div>
                              <div className="messageContent" dangerouslySetInnerHTML={{ __html: messageItem.content?.replace(/\n/g, '<br />') }} />
                            </div>
                            {messageItem?.referenceExtract && (
                              <div className="chatReferenceMessage">
                                <div className="refBar" />
                                {messageItem?.referenceExtract}
                              </div>
                            )}
                          </div>
                          <img alt="img" src={chat.data.chat.users.find((u: { userId: unknown; }) => u.userId === messageItem?.userId).avatar} className="messageSenderAvatar" />
                        </>
                      ) : (
                        <>
                          <img alt="img" src={chat.data.chat.users.find((u: { userId: unknown; }) => u.userId === messageItem?.userId).avatar} className="messageSenderAvatar" />
                          <div className="messageBody">
                            <div className="messageBodyHeader">
                              <div className="messageSenderName">{messageItem.userId}</div>
                              <div className="messageTime">{time}</div>
                            </div>
                            <div className="otherMessage">
                              <div className="messageContent" dangerouslySetInnerHTML={{ __html: messageItem.content?.replace(/\n/g, '<br />') }} />

                              <div className="menuButtonContainer">

                                <div onClick={() => setReferenceMessage(messageItem)} className="menuButton">
                                  <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 0C1.85 0 0.5 1.35 0.5 3V8H5.5V3H1.5C1.5 1.8905 2.3905 1 3.5 1V0ZM10.5 0C8.85 0 7.5 1.35 7.5 3V8H12.5V3H8.5C8.5 1.8905 9.3905 1 10.5 1V0ZM1.5 4H4.5V7H1.5V4ZM8.5 4H11.5V7H8.5V4Z" fill="#C9C7D0" />
                                  </svg>
                                </div>
                                <div onClick={() => confirm('Are you sure to delete？') && deleteMessage({ variables: { id: messageItem.id } })} className="menuButton">
                                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.1667 6.33333V12.6C11.1667 12.7061 11.1245 12.8078 11.0495 12.8828C10.9745 12.9579 10.8728 13 10.7667 13H2.23333C2.12725 13 2.02551 12.9579 1.95049 12.8828C1.87548 12.8078 1.83333 12.7061 1.83333 12.6V6.33333M5.16667 10.3333V6.33333M7.83333 10.3333V6.33333M12.5 3.66667H9.16667M0.5 3.66667H3.83333M3.83333 3.66667V1.4C3.83333 1.29391 3.87548 1.19217 3.95049 1.11716C4.0255 1.04214 4.12725 1 4.23333 1H8.76667C8.87275 1 8.9745 1.04214 9.04951 1.11716C9.12452 1.19217 9.16667 1.29391 9.16667 1.4V3.66667M3.83333 3.66667H9.16667" stroke="#C9C7D0" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {messageItem?.referenceExtract && (
                              <div className="chatReferenceMessage">
                                <div className="refBar" />
                                {messageItem?.referenceExtract}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
            }
        <div id="dummyDivRef" ref={dummyDivRef} style={{ width: '100%', clear: 'both' }} />
      </div>
      <div className="chatInput">

        <textarea
          ref={textareaRef}
          style={{ background: 'transparent' }}
          placeholder=""
          value={currentMessage}
          onChange={
              (e) => {
                setCurrentMessage(e.target.value);
              }
}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { // e.nativeEvent获取原生的事件对像
              if (!e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                createMessage({
                  variables: {
                    message: {
                      chatId,
                      userId: currentUserId,
                      messageType: 'Text',
                      content: currentMessage,
                      referenceExtract: referenceMessage?.content,
                      referenceMessageId: referenceMessage?.id,
                      ats: atUser?.name,
                      atIds: atUser?.id,
                    },
                  },
                }).then(() => {
                  setCurrentMessage('');
                  setReferenceMessage(null);
                });
                return false;
              }
            }
            return true;
          }}
        />
      </div>
      <div className="messageReference">
        {referenceMessage && (
          <>
            <div className="inputReferenceMessage">
              <div className="refBar" />
              {referenceMessage?.content}
            </div>
            <Button className="deleteReferenceButton" onClick={() => { setReferenceMessage(null); }}>
              <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.12" cx="13" cy="13.5" r="12.6" fill="#C9C7D0" />
                <rect x="16.25" y="9.54999" width="1.41422" height="10.6066" rx="0.707109" transform="rotate(45 16.25 9.54999)" fill="white" />
                <path d="M16.75 16.55C17.0261 16.8262 17.0261 17.2739 16.75 17.55C16.4739 17.8262 16.0261 17.8262 15.75 17.55L9.24998 11.05C8.97384 10.7739 8.97384 10.3261 9.24998 10.05C9.52612 9.77386 9.97384 9.77386 10.25 10.05L16.75 16.55Z" fill="white" />
              </svg>
            </Button>
          </>
        )}
      </div>
    </Ctn>

  );
}

export default ChatDetail;
