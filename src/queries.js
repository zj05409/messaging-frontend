import { gql } from '@apollo/client';

export const CURRENT_USER = gql`
  query currentUser{
    currentUserInfo {
      type
      token
      expiration
      username
      email
      roles
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(input: {username: $username, password: $password}) {
        username
        email
        roles
        accessToken
        refreshToken
    }
  }
`;

export const REGISTER = gql`
  mutation register($username: String!, $password: String!, $email: String!) {
    createUser(input: {username: $username, password: $password, email: $email}) {
        id
        username
        email
        roles
    }
  }
 `;

export const NEW_MESSAGE = gql`
  subscription {
    messageCreated {
      id
      chatId
      userId
      messageType
      content
      referenceExtract
      referenceMessageId
      ats
      atIds
      read
      createdAt
    }
  }
`;

export const ALL_CHATS = gql`
  query allChats{
    chats:listAllChat {
      id
      chatType
      name
      avatar
    }
  }
`;
export const GET_CHAT = gql`
  query getChat($chatId: String!) {
    chat:getChat(id: $chatId) {
      id
      chatType
      name
      avatar
      users {
        userId
        username
        email
        avatar
      }
    }
  }
`;

export const FIND_MESSAGE = gql`
  query findMessagesByChatId($chatId: String) {
    messages:listMessage(chatId: $chatId) {
      id
      chatId
      userId
      messageType
      content
      referenceExtract
      referenceMessageId
      ats
      atIds
      read
      createdAt
    }
  }
`;
export const CREATE_MESSAGE = gql`
  mutation createMessage($message: MessageInput!) {
    createMessage(
        message: $message
    ) {
      id
      chatId
      userId
      messageType
      content
      referenceExtract
      referenceMessageId
      ats
      atIds
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: String!) {
    deleteMessage(id: $id)
  }
`;

export const MESSAGE_DELETED = gql`
  subscription {
    messageDeleted
  }
`;
