import { gql } from '@apollo/client'

//Define get filtered centers query
export const GET_FILTERED_CENTER = gql`
  query GetFilteredCenters($input: String!) {
    getFilteredCenters(input: $input) {
      ECE_id
      name
    }
  }
`


//Define get a reliever query
export const GET_RELIEVER = gql`
  query GetOneReliever($email: String!) {
    getOneReliever(email: $email) {
      phone
      bio
      photo_url
      role
    }
  }
`


//Define get a manager query
export const GET_MANAGER = gql`
  query GetOneManager($email: String!) {
    getOneManager(email: $email) {
      phone
      role
    }
  }
`



// Define add relievers mutation
export const ADD_RELIEVER = gql`
  mutation AddReliever(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $email: String!
    $password: String!
  ) {
    addReliever(
      first_name: $firstName
      last_name: $lastName
      phone: $phone
      email: $email
      password: $password
    ) {
      id
      email
    }
  }
`

//Define mutation
export const UPDATE_RELIEVER = gql`
  mutation UpdateReliever($email: String!, $bio: String, $photoUrl: String) {
    updateReliever(email: $email, bio: $bio, photo_url: $photoUrl) {
      bio
      photo_url
    }
  }
`


// Define add managers mutation
export const ADD_MANAGER = gql`
  mutation AddManager(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $email: String!
    $eceId: Int!
    $password: String!
  ) {
    addManager(
      first_name: $firstName
      last_name: $lastName
      phone: $phone
      email: $email
      ECE_id: $eceId
      password: $password
    ) {
      id
      email
    }
  }
`