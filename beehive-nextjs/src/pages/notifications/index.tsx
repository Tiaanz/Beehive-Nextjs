import { FC } from 'react'
import { useSession } from 'next-auth/react'
import LargeHeading from '@/components/ui/LargeHeading'
import Meta from '@/components/Meta'

interface indexProps {}

const index: FC<indexProps> = ({ }) => {
  
  const { data: session } = useSession()

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">
        <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
          Welcome {session?.user?.name} !
        </LargeHeading>
      
      </div>
    </>
  )
}

export default index
