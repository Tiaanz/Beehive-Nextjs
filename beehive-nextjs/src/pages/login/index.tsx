import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { toast } from '@/components/ui/Toast'
import Meta from '@/components/Meta'
import { useRouter } from 'next/router'

const theme = createTheme()

export default function Login() {
  const router = useRouter()
  const message = router.query.message

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      const res = await signIn('credentials', {
        email: data.get('email'),
        password: data.get('password'),
        redirect: false,
      })
      if (res?.error === "invalid password or email") {
         
        toast({
          title: 'Error signing in',
          message: 'The email or password is incorrect.',
          type: 'error',
        })
      } else if (res?.error === null) {
        window.location.href = '/notifications'
      } else {
        toast({
          title: 'Error signing in',
          message: 'Please try agian later',
          type: 'error',
        })
      }
    
    } catch (error) {
      const typedError = error as Error
      console.log(typedError.message);
      
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Meta title="Log in | Beehive" />
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
          <Image
            priority
            src="/logo.png"
            alt="logo"
            width={80}
            height={80}
            quality={100}
          />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 4 }}
            className="flex flex-col items-center w-full"
          >
            {message && (
              <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md">
                {message}
              </p>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              variant="standard"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              variant="standard"
            />

            <button
              className="bg-red-600 hover:bg-red-500 w-11/12 mx-2 mt-6 p-2 rounded text-white"
              type="submit"
            >
              Sign In
            </button>
          </Box>
          <Link
            href="/register/teacher"
            className="bg-amber-500 hover:bg-amber-400 w-11/12 mx-2 mt-4 p-2 rounded text-white text-center"
          >
            <button type="submit">Register as teacher</button>
          </Link>
          <Link
            href="/register/centre"
            className="bg-amber-500 hover:bg-amber-400 w-11/12 mx-2 my-4 p-2 rounded text-white text-center"
          >
            <button type="submit">Register as centre manager</button>
          </Link>
          <Link href="#" className=" text-sm mt-3 text-slate-400 no-underline">
            FORGOT PASSWORD?
          </Link>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
