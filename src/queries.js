import { gql } from '@apollo/client';

export const CURRENT_USER = gql`
  query {
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

export const ALL_RESERVATIONS = gql`
  query {
    listAllReservation {
        _id
        _rev
        userId
        name
        expectedArriveTime
        contactInfo {
          email
          tel
        }
        table {
          personCount
          babyCount
          position
        }
        status
      }
  }
`;

export const FIND_RESERVATION = gql`
  query getReservationById($idToSearch: String!) {
    getReservation(id: $idToSearch) {
        _id
        _rev
        userId
        name
        expectedArriveTime
        contactInfo {
          email
          tel
        }
        table {
          personCount
          babyCount
          position
        }
        status
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
    createGuest(input: {username: $username, password: $password, email: $email}) {
        _id
        _rev
        username
        email
        roles
    }
  }
 `;
export const CREATE_EMPLOYEE = gql`
  mutation createEmployee($username: String!, $password: String!, $email: String!) {
    createEmployee(input: {username: $username, password: $password, email: $email}) {
        _id
        _rev
        username
        email
        roles
    }
  }
`;

export const UPDATE_RESERVATION = gql`
  mutation updateReservation($reservation: ReservationInput!) {
    updateReservation(
      reservation: $reservation
    ) {
      _id
      _rev
      userId
      name
      contactInfo {
        email
        tel
      }
      expectedArriveTime
      table {
        personCount
        babyCount
        position
      }
    } 
  }
`;

export const CREATE_RESERVATION = gql`
  mutation createReservation($reservation: ReservationInput!) {
    createReservation(
      reservation: $reservation
    ) {
      _id
      _rev
      userId
      name
      contactInfo {
        email
        tel
      }
      expectedArriveTime
      table {
        personCount
        babyCount
        position
      }
    } 
  }
`;
export const HELLO = gql`
  subscription {
    hello
  }
`;

export const NEW_MESSAGE = gql`
  subscription {
    messageCreated {
      _id
      _rev
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

export const ALL_CHATS = gql`
  query {
    listAllChat {
      _id
      _rev
      chatType
      name
      avatar
    }
  }
`;
export const GET_CHAT = gql`
  query getChat($chatId: String!) {
    getChat(id: $chatId) {
      _id
      _rev
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
    listMessage(chatId: $chatId) {
      _id
      _rev
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
export const CREATE_MESSAGE = gql`
  mutation createMessage($message: MessageInput!) {
    createMessage(
        message: $message
    ) {
      _id
      _rev
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
