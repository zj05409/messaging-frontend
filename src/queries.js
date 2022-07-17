import { gql } from '@apollo/client'

export const CURRENT_USER = gql`
  query {
    currentUserInfo {
      type
      token
      expiration
      username
      emailØ
      roles
    }
  }
`

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
`

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
`

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
`

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
 `
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
`

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
`

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
`
