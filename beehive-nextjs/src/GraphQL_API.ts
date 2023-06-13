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
      ECE_id
      phone
      role
    }
  }
`

//Define get a center query
export const GET_CENTER = gql`
  query GetOneCenter($ECE_id: Int!) {
    getOneCenter(ECE_id: $ECE_id) {
      name
      address
      description
      photo_url
      manager {
        first_name
      }
    }
  }
`

//Define get posts query
export const GET_POSTS = gql`
  query GetPostsByCenter(
    $centerId: Int!
    $dateFrom: String!
    $dateTo: String!
  ) {
    getPostsByCenter(
      center_id: $centerId
      date_from: $dateFrom
      date_to: $dateTo
    ) {
      id
      time
      qualified
      status
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

//Define update reliever mutation
export const UPDATE_RELIEVER = gql`
  mutation UpdateReliever($email: String!, $bio: String, $photoUrl: String) {
    updateReliever(email: $email, bio: $bio, photo_url: $photoUrl) {
      bio
      photo_url
    }
  }
`

//Define update center mutation
export const UPDATE_CENTER = gql`
  mutation UpdateCenter($eceId: Int!, $description: String, $photoUrl: String) {
    updateCenter(
      ECE_id: $eceId
      description: $description
      photo_url: $photoUrl
    ) {
      description
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

// Define add managers mutation
export const ADD_POST = gql`
  mutation AddPost(
    $centerId: Int!
    $time: String!
    $dateFrom: String!
    $dateTo: String!
    $qualified: Boolean!
  ) {
    addPost(
      center_id: $centerId
      time: $time
      qualified: $qualified
      date_from: $dateFrom
      date_to: $dateTo
    ) {
      id
    }
  }
`
