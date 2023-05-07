import Button from './ui/Button'
import Link from 'next/link'

const SignInButton = () => {
  return (
    <Link href="/login">
      <Button>Sign in</Button>
    </Link>
  )
}

export default SignInButton
