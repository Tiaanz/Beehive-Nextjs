import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from './ui/Button'
import SignInButton from './SignInButton'
import SignOutButton from './SignOutButton'
import { useState } from 'react'
import { GET_RELIEVER, GET_MANAGER } from '@/GraphQL_API'
import { useQuery } from '@apollo/client'

const Navbar = () => {
  const { data: session } = useSession()
  const [showHamburger, setShowHamburger] = useState(false)

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const { data: managerData } = useQuery(GET_MANAGER, {
    variables: { email: session?.user?.email },
  })

  function handleHamburgerDisplay() {
    setShowHamburger((preState) => !preState)
  }

  return (
    <div className="fixed backdrop-blur-sm bg-white z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 shadow-sm flex items-center justify-between">
      <div className="w-11/12 mx-auto flex justify-between items-center">
        <Link href="/" as="image" rel="preload">
          <Image
            priority
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
            quality={100}
          ></Image>
        </Link>

        <div className="space-x-4 flex items-center justify-end relative w-full">
          {session ? (
            <>
              {showHamburger ? (
                <button
                  className="text-3xl sm:hidden focus:outline-none cursor-pointer"
                  onClick={handleHamburgerDisplay}
                >
                  &times;
                </button>
              ) : (
                <button
                  className="text-3xl sm:hidden focus:outline-none cursor-pointer"
                  onClick={handleHamburgerDisplay}
                >
                  &#9776;
                </button>
              )}
              {showHamburger && (
                <ul className="absolute top-16 min-w-fit w-1/2 space-y-3 bg-amber-400 p-6">
                  <li>
                    <Link
                      className={buttonVariants({ variant: 'link' })}
                      href="/profile"
                    >
                      NOTIFICATION
                    </Link>
                  </li>
                  <li>
                    {' '}
                    <Link
                      className={buttonVariants({ variant: 'link' })}
                      href="/my-jobs"
                    >
                      MY JOBS
                    </Link>
                  </li>
                  <li>
                    {' '}
                    <Link
                      className={buttonVariants({ variant: 'link' })}
                      href="/profile"
                    >
                      PROFILE
                    </Link>
                  </li>
                  <li>
                    {' '}
                    <SignOutButton />
                  </li>
                </ul>
              )}

              <nav className="hidden sm:block">
                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/profile"
                >
                  NOTIFICATION
                </Link>
                {relieverData?.getOneReliever?.role === 'RELIEVER' && (
                  <Link
                    className={buttonVariants({ variant: 'link' })}
                    href="/my-jobs"
                  >
                    MY JOBS
                  </Link>
                )}
                {managerData?.getOneManager?.role === 'MANAGER' && (
                  <Link
                    className={buttonVariants({ variant: 'link' })}
                    href="/my-posts"
                  >
                    MY POSTS
                  </Link>
                )}

                <Link
                  className={buttonVariants({ variant: 'link' })}
                  href="/profile"
                >
                  PROFILE
                </Link>
                <SignOutButton />
              </nav>
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
