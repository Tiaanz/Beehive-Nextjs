import Button from './ui/Button'
import { signOut } from 'next-auth/react'
import { toast } from './ui/Toast'

const SignOutButton = () => {
  
  async function signUserOut() {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast({
        title: 'Error signing out',
        message: 'Please try agian later',
        type: 'error',
      })
    }
  }

  return <Button onClick={signUserOut}>Sign out</Button>
}

export default SignOutButton
