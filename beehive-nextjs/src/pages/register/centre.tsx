import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Autocomplete} from '@mui/material'
import { gql, useLazyQuery } from '@apollo/client'



const theme = createTheme()
const validPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/

interface Props {
  ECE_id: number
  name: string
}

//Define query
const GET_FILTERED_CENTER = gql`
  query GetFilteredCenters($input: String!) {
    getFilteredCenters(input: $input) {
      ECE_id
      name
    }
  }
`

const Centre = () => {
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState([])

  const [getCenters] = useLazyQuery(GET_FILTERED_CENTER)

  React.useEffect(() => {
    // Set a debounce delay (e.g., 500 milliseconds)
    const debounceDelay = 500
    let debounceTimeout: string | number | NodeJS.Timeout | undefined
    // Define the debounced function
    const debouncedFetchData = async () => {
      // Clear the previous debounce timeout
      clearTimeout(debounceTimeout)
      // Set a new debounce timeout
      debounceTimeout = setTimeout(async () => {
        if (inputValue !== '') {
          const response = await getCenters({
            variables: { input: inputValue },
          })
          setOptions(
            response.data.getFilteredCenters.map(
              (center: Props) => center.ECE_id + ' ' + center.name
            )
          )
        } else {
          setOptions([])
        }
      }, debounceDelay)
    }
    // Call the debounced function
    debouncedFetchData()
    // Clean up the debounce timeout on component unmount
    return () => {
      clearTimeout(debounceTimeout)
    }
  }, [inputValue])

  const [passwordMessage, setPswMessage] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const password = data.get('password') as any
    if (password?.match(validPasswordRegex)) {
      console.log({
        email: data.get('email'),
        password: data.get('password'),
        centreName: data.get('centreName'),
      })
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
            marginTop: 1,
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
            <h1 className="text-xl mb-2">Register as centre manager</h1>{' '}
            <Autocomplete
              clearOnEscape
              filterOptions={(x) => x}
              fullWidth
              id="clear-on-escape"
              noOptionsText="Start typing the center name"
              options={options}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Center Name"
                  variant="standard"
                  autoFocus
                  required
                  name="centreName"
                />
              )}
            />
            <TextField
              margin="normal"
              inputProps={{
                pattern: '[A-z]*',
                maxLength: '40',
                title:
                  'First Name must be letters and not more than 40 characters',
              }}
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              variant="standard"
            />
            <TextField
              inputProps={{
                pattern: '[A-z]*',
                maxLength: '40',
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
                minLength: '8',
                maxLength: '11',
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
                maxLength: '40',
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

export default Centre


