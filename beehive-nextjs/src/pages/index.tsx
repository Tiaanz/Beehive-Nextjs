import { Work_Sans } from 'next/font/google'
import LargeHeading from '@/components/ui/LargeHeading'
import Link from 'next/link'
import Meta from '@/components/Meta'


const workSans = Work_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})



export default function Home() {
  
 
  
  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />
      <div
        className="min-h-screen pt-20 bg-cover flex"
        style={{ backgroundImage: "url('background.jpeg')" }}
      >
        <div className=" flex flex-col items-center mt-40 sm:mt-32 w-4/5 mx-auto md:items-start">
          <LargeHeading
            size="sm"
            className={`p-6 max-w-3xl ${workSans.className} bg-yellow-400 leading-10 rounded-xl`}
          >
            Beehive makes it easy and fast to connect ECE teachers with
            childcare centres.
            <br />
            Join now to find your perfect match.
          </LargeHeading>
          <Link href="/login">
            <button className="text-white bg-amber-500 hover:bg-yellow-400 px-8 py-2 text-xl rounded-tl-2xl rounded-br-2xl font-bold mt-7">
              Join us
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}


