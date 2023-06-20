import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useMutation } from '@apollo/client'
import { toast } from '@/components/ui/Toast'
import { useRouter } from 'next/router'
import { ADD_RELIEVER } from '@/GraphQL_API'
import { MenuItem } from '@mui/material'

const theme = createTheme()
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/

const Teacher = ({}) => {
  const [addReliever] = useMutation(ADD_RELIEVER)

  const router = useRouter()
  const [passwordMessage, setPswMessage] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const qualified = data.get('qualified') === 'Yes' ? true : false
    const password = data.get('password') as any
    if (password?.match(validPasswordRegex)) {
      try {
        await addReliever({
          variables: {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            qualified,
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
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } catch (error) {
        const typedError = error as Error
        toast({
          title: 'Error',
          message: `${typedError.message}, please try again later.`,
          type: 'error',
        })
      }
    } else {
      setPswMessage(
        () =>
          'Password must contain at least 8 characters with letters and numbers'
      )
    }
  }

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
              required
              fullWidth
              id="qualified"
              label="Qualified"
              name="qualified"
              select
              variant="standard"
              defaultValue={''}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
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
                pattern: '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$',
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
