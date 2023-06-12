import { FC } from 'react'
import Meta from '@/components/Meta'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">
        <AiOutlinePlusCircle className="w-10 h-10 mx-1" />
        <Link href="/my-posts/add-post">
        <Button>Add a post</Button>
        </Link>
      
      </div>
    </>
  )
}

export default index
