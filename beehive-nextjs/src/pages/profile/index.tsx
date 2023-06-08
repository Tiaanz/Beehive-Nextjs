import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import LargeHeading from '@/components/ui/LargeHeading'
import Paragraph from '@/components/ui/Paragraph'
import Button from '@/components/ui/Button'
import Avatar from '@mui/material/Avatar'
import Meta from '@/components/Meta'
import { AiFillCamera } from 'react-icons/ai'
import { gql, useQuery } from '@apollo/client'

//Define query
const GET_RELIEVER = gql`
  query GetOneReliever($email: String!) {
    getOneReliever(email: $email) {
      phone
    }
  }
`

const page = () => {
  const { data: session } = useSession()
  console.log(session?.user)

  const { data } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />
      <div className="pt-20">
        <div className=" flex flex-col items-center mt-40 sm:mt-32 w-4/5 mx-auto md:items-center relative">
          {/* <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
            Welcome {session?.user?.name}
          </LargeHeading> */}
          <Avatar
            alt="profile photo"
            src="/avatar.jpg"
            sx={{ width: 150, height: 150 }}
          />
          <AiFillCamera className="w-6 h-6 absolute top-40" />
          <p className="mt-10">{session?.user?.email}</p>
          <p>{data?.getOneReliever.phone}</p>
          <h3 className="my-4 font-bold text-lg">Biography</h3>
          <div className="w-4/5 mb-2 lg:w-1/2 border-2 border-slate-300 rounded-lg p-4 flex justify-center">
          <Paragraph size="sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
            </Paragraph>
          </div>
          <button>Edit</button>
        </div>
      </div>
    </>
  )
}

export default page
