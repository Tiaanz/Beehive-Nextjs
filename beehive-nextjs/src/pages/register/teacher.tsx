import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { gql, useMutation } from '@apollo/client'
import { toast } from '@/components/ui/Toast'
import { useRouter } from 'next/router'

// Define mutation
const ADD_RELIEVER = gql`
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
    )
    id
    email
  }
`

const theme = createTheme()
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/

const Teacher = ({}) => {
  const [addReliever, { data, loading, error }] = useMutation(ADD_RELIEVER)

  const router = useRouter()
  const [passwordMessage, setPswMessage] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const password = data.get('password') as any
    if (password?.match(validPasswordRegex)) {
      // console.log({ email: data.get('email'), password: data.get('password') })

      addReliever({
        variables: {
          first_name: data.get('firstName'),
          last_name: data.get('lastName'),
          phone: data.get('phone'),
          email: data.get('email'),
          password: data.get('password'),
        },
      })

      toast({
        title: 'successfully registered',
        message: 'You have been registered as a reliever.',
        type: 'success',
      })
      router.push('/login')
    } else {
      setPswMessage(
        () =>
          'Password must contain at least 8 characters with letters and numbers'
      )
    }
  }

  if (loading) return 'Submitting...'
  if (error) return `Submission error! ${error.message}`

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className="pt-20">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 4 }}
            className="flex flex-col items-center w-full"
          >
            <h1 className="text-xl">Register as teacher</h1>{' '}
            <TextField
              margin="normal"
              inputProps={{
                pattern: '[A-z]*',
                maxlength: '40',
                title:
                  'First Name must be letters and not more than 40 characters',
              }}
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoFocus
              variant="standard"
            />
            <TextField
              inputProps={{
                pattern: '[A-z]*',
                maxlength: '40',
                title:
                  'Last Name must be letters and not more than 40 characters',
              }}
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              variant="standard"
            />
            <TextField
              margin="normal"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                minlength: '8',
                maxlength: '11',
                title: 'Phone number must be numbers between 8-11 digits',
              }}
              required
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              variant="standard"
            />
            <TextField
              margin="normal"
              inputProps={{
                pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
                maxlength: '40',
                title:
                  'Email address must be in valid format and not longer than 40 characters',
              }}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              variant="standard"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              onChange={() => setPswMessage('')}
              variant="standard"
            />
            <p className="text-red-500 text-sm">{passwordMessage}</p>
            <button
              className="bg-red-600 hover:bg-red-500 w-11/12 mx-2 mt-6 p-2 rounded text-white"
              type="submit"
            >
              Submit
            </button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Teacher
