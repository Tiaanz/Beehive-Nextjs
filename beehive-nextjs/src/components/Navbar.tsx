import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from './ui/Button'
import SignInButton from './SignInButton'
import SignOutButton from './SignOutButton'

const Navbar = () => {
  const { data: session } = useSession()
  console.log(session)

  return (
    <div className="fixed backdrop-blur-sm bg-white z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 shadow-sm flex items-center justify-between">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            priority
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
            quality={100}
          ></Image>
        </Link>

        <div className="space-x-4">
          {session ? (
            <>
              <Link
                className={buttonVariants({ variant: 'link' })}
                href="/profile"
              >
                NOTIFICATION
              </Link>
              {1 !== 1 && (
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/my-jobs"
                >
                  MY JOBS
                </Link>
              )}
              <Link
                className={buttonVariants({ variant: 'link' })}
                href="/my-posts"
              >
                MY POSTS
              </Link>
              <Link
                className={buttonVariants({ variant: 'link' })}
                href="/profile"
              >
                PROFILE
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
