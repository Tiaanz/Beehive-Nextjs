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
  query GetRelieverByEmail($email: String!) {
    getRelieverByEmail(email: $email) {
      id
      phone
      bio
      photo_url
      role
      qualified
      not_available_dates
    }
  }
`

//Define get a reliever by ID
export const GET_RELIEVER_BY_ID = gql`
  query GetRelieverById($relieverId: String!) {
    getRelieverById(reliever_id: $relieverId) {
      first_name
      last_name
      bio
      email
      phone
      qualified
      photo_url
    }
  }
`

//Define get a manager query
export const GET_MANAGER = gql`
  query GetManagerByEmail($email: String!) {
    getManagerByEmail(email: $email) {
      id
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
        phone
      }
    }
  }
`

//Define get posts query
export const GET_POSTS_BY_DATE = gql`
  query GetPostsByDate($centerId: Int!, $dateFrom: String!, $dateTo: String!) {
    getPostsByDate(
      center_id: $centerId
      date_from: $dateFrom
      date_to: $dateTo
    ) {
      id
      center_id
      time
      qualified
      status
      date_from
      date_to
      relieverIDs
      relievers {
        id
        first_name
        last_name
        email
        qualified
      }
    }
  }
`

//Define get posts query
export const GET_POSTS_BY_CENTER = gql`
  query GetPostsByCenter($centerId: Int!) {
    getPostsByCenter(
      center_id: $centerId
    ) {
      id
      center_id
      time
      qualified
      status
      date_from
      date_to
      relieverIDs
      relievers {
        id
        first_name
        last_name
        email
        qualified
      }
    }
  }
`

//Define get posts query
export const GET_POSTS_BY_MONTH = gql`
  query GetPostsByMonth($centerId: Int, $dateFrom: String!, $dateTo: String!) {
  getPostsByMonth(center_id: $centerId, date_from: $dateFrom, date_to: $dateTo) {
    date_from
    date_to
    relieverIDs
    status
  }
}
`


//define get All "OPEN" JOBS query
export const GET_JOBS = gql`
  query GetOpenJobs {
    getOpenJobs {
      center {
        ECE_id
        name
        address
      }
      id
      status
      qualified
      date_from
      date_to
      time
      relieverIDs
      declined_relieverIDs
      relievers {
        id
        qualified
      }
    }
  }
`

//define get JOBS by reliever query
export const GET_RELIEVER_JOBS = gql`
  query GetJobsByDate($dateFrom: String!, $dateTo: String!) {
    getJobsByDate(date_from: $dateFrom, date_to: $dateTo) {
      center {
        ECE_id
        name
      }
      id
      time
      qualified
      relieverIDs
      status
    }
  }
`

//define get job by ID
export const GET_JOB_BY_ID = gql`
  query GetJobById($jobId: String!) {
    getJobById(job_id: $jobId) {
      id
      date_from
      date_to
      time
      status
      qualified
      relieverIDs
      center {
        name
        address
        ECE_id
        manager {
          first_name
          last_name
          phone
        }
      }
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
    $qualified: Boolean!
  ) {
    addReliever(
      first_name: $firstName
      last_name: $lastName
      phone: $phone
      email: $email
      password: $password
      qualified: $qualified
    ) {
      id
      email
    }
  }
`

//Define update reliever mutation
export const UPDATE_RELIEVER = gql`
  mutation UpdateReliever(
    $email: String!
    $bio: String
    $photoUrl: String
    $qualified: Boolean
  ) {
    updateReliever(
      email: $email
      bio: $bio
      photo_url: $photoUrl
      qualified: $qualified
    ) {
      bio
      photo_url
      qualified
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

// Define add posts mutation
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

// Define update posts mutation
export const UPDATE_POST = gql`
  mutation UpdatePost(
    $postId: String!
    $dateFrom: String
    $dateTo: String
    $time: String
    $qualified: Boolean
    $status: String
  ) {
    updatePost(
      post_id: $postId
      date_from: $dateFrom
      date_to: $dateTo
      time: $time
      qualified: $qualified
      status: $status
    ) {
      id
      status
    }
  }
`

// Define apply job mutation
export const APPLY_JOB = gql`
  mutation ApplyJob($applyJobId: String!, $relieverId: String!) {
    applyJob(id: $applyJobId, relieverID: $relieverId) {
      id
      relieverIDs
    }
  }
`

// Define decline job mutation
export const DECLINE_JOB = gql`
  mutation DeclineJob($declineJobId: String!, $relieverId: String!) {
    declineJob(id: $declineJobId, relieverID: $relieverId) {
      id
      declined_relieverIDs
    }
  }
`

// Define accpet job mutation
export const ACCEPT_JOB = gql`
  mutation AcceptJob($acceptJobId: String!, $relieverId: String!) {
    acceptJob(id: $acceptJobId, relieverID: $relieverId) {
      id
      relieverIDs
      status
    }
  }
`

// Define accpet job mutation //getJobId is relieverId
export const GET_JOB = gql`
  mutation GetJob($getJobId: String!, $jobId: String!) {
    getJob(id: $getJobId, jobID: $jobId) {
      id
      jobIDs
      jobs {
        date_from
        date_to
      }
    }
  }
`

// Define update not_available_dates mutation
export const UPDATE_NOT_AVAILABLE_DATE = gql`
  mutation UpdateUnavailableDates($relieverId: String!, $jobId: String!) {
    updateUnavailableDates(relieverID: $relieverId, jobID: $jobId) {
      id
    }
  }
`

// Define update relieverIDs mutation
export const UPDATE_RELIEVERIDS = gql`
  mutation UpdateRelieverIDs($relieverId: String!, $jobId: String!) {
  updateRelieverIDs(relieverID: $relieverId, jobID: $jobId) {
    relieverIDs
  }
}
`
