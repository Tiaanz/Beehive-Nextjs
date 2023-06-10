import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import LargeHeading from '@/components/ui/LargeHeading'
import Paragraph from '@/components/ui/Paragraph'
import Button from '@/components/ui/Button'
import Avatar from '@mui/material/Avatar'
import Meta from '@/components/Meta'
import { AiFillCamera } from 'react-icons/ai'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { AiOutlinePlusCircle } from 'react-icons/ai'

//Define query
const GET_RELIEVER = gql`
  query GetOneReliever($email: String!) {
    getOneReliever(email: $email) {
      phone
      bio
    }
  }
`
//Define mutation
const UPDATE_RELIEVER = gql`
  mutation UpdateReliever($email: String!, $bio: String) {
    updateReliever(email: $email, bio: $bio) {
      bio
    }
  }
`

const page = () => {
  const { data: session } = useSession()
  console.log(session?.user)

  const { data, loading, error } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const [updateReliever] = useMutation(UPDATE_RELIEVER)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [bio, setBio] = useState<string>('')

  useEffect(() => {
    if (!loading) {
      setBio(data?.getOneReliever.bio)
    }
  }, [loading])

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    updateReliever({
      variables: {
        email: session?.user?.email,
        bio: data.get('bio'),
      },
    })
    setIsEditing(false)
    setBio(data.get('bio') as string)
  }

  function handleEditing() {
    
    setIsEditing(true)

  }

  if (error) {
    console.error(error)
    return <div>Error!</div>
  }

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />
      <div className="pt-20">
        <div className=" flex flex-col items-center mt-40 sm:mt-12 w-4/5 mx-auto md:items-center relative">
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
          {bio && !loading && !isEditing ? (
            <>
              <div className="w-4/5 my-2 lg:w-1/2 border-2 border-slate-300 rounded-lg p-4 flex justify-center h-56">
                <Paragraph size="sm" className='overflow-y-scroll'>{bio}</Paragraph>
              </div>
              <Button size="sm" variant="subtle" className="mt-2" onClick={handleEditing}>
                Edit
              </Button>
            </>
          ) : (
            !isEditing && (
              <AiOutlinePlusCircle
                className="w-6 h-6"
                onClick={() => setIsEditing(true)}
              />
            )
          )}
          {isEditing && (
            <>
              <form
                onSubmit={handleSave}
                className="w-full flex flex-col items-center"
              >
                <textarea
                  rows={8}
                  name="bio"
                  defaultValue={bio}
                  className="block p-2.5 lg:w-1/2 md:w-3/4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your bio here..."
                  overflow-y="scroll"
                ></textarea>
                <Button
                  size="sm"
                  variant="subtle"
                  className="mt-2"
                  type="submit"
                >
                  Save
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default page
