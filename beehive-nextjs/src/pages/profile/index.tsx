import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Paragraph from '@/components/ui/Paragraph'
import Button from '@/components/ui/Button'
import Avatar from '@mui/material/Avatar'
import Meta from '@/components/Meta'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import { toast } from '@/components/ui/Toast'
import { AiFillCamera } from 'react-icons/ai'
import { useMutation, useQuery } from '@apollo/client'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { GET_RELIEVER, UPDATE_RELIEVER } from '@/GraphQL_API'

const Profile = () => {
  const { data: session } = useSession()

  const { data, loading, error } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const [updateReliever, { loading: mutationLoading }] =
    useMutation(UPDATE_RELIEVER)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [bio, setBio] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if (!loading) {
      setBio(data?.getRelieverByEmail?.bio)
      setImageUrl(data?.getRelieverByEmail?.photo_url)
    }
  }, [loading])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const data = new FormData(event.currentTarget)
      const res = await updateReliever({
        variables: {
          email: session?.user?.email,
          bio: data.get('bio'),
        },
      })
      setIsEditing(false)
      setBio(res.data.updateReliever.bio)
    } catch (error) {
      const typedError = error as Error
      toast({
        title: 'Error',
        message: typedError.message,
        type: 'error',
      })
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()

        reader.onloadend = async () => {
          const res = await updateReliever({
            variables: {
              email: session?.user?.email,
              photoUrl: reader.result as string,
            },
          })
          setImageUrl(res.data.updateReliever.photo_url)
        }

        reader.readAsDataURL(file)
      }
    } catch (error) {
      const typedError = error as Error
      toast({
        title: 'Error',
        message: typedError.message,
        type: 'error',
      })
    }
  }

  if (error) {
    return (
      <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
        ERROR: {error?.message}
      </h1>
    )
  }

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />
      {data?.getRelieverByEmail !== null ? (
        <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">
          <div className="basis-1/3 flex flex-col items-center">
            <Avatar
              alt="profile photo"
              src={imageUrl ? imageUrl : './default_avatar.jpeg'}
              sx={{ width: 120, height: 120 }}
            />
            <label htmlFor="upload-image" className="my-2">
              <AiFillCamera className="w-6 h-6 " />
              <input
                id="upload-image"
                hidden
                accept="image/*"
                type="file"
                onChange={handleFileUpload}
              />
            </label>

            <p className="text-sm md:text-base">{session?.user?.email}</p>
            <p className="text-sm md:text-base">
              {data?.getRelieverByEmail?.phone}
            </p>
            <p className="text-sm md:text-base font-bold">
              {data?.getRelieverByEmail?.qualified
                ? 'Qualified'
                : 'Unqualified'}
            </p>
          </div>
          <div className="basis-2/3 flex flex-col md:justify-start md:items-start items-center">
            <h3 className="md:my-4 my-2 font-bold md:text-lg text-sm">
              Biography
            </h3>
            {loading && (
              <Box className="lg:w-2/3 md:w-3/4 w-full h-72 flex flex-col justify-center">
                <LinearProgress />
              </Box>
            )}
            {bio && !loading && !isEditing ? (
              <>
                <div className="w-full my-2 lg:w-4/5  border-2 border-slate-300 rounded-lg p-6 flex md:h-72 h-44">
                  <Paragraph size="sm" className="overflow-y-scroll text-left ">
                    {bio}
                  </Paragraph>
                </div>
                <Button
                  size="sm"
                  variant="subtle"
                  className="mt-2 w-10"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              !isEditing &&
              !loading && (
                <AiOutlinePlusCircle
                  className="w-6 h-6"
                  onClick={() => setIsEditing(true)}
                />
              )
            )}
            {isEditing && (
              <>
                <form onSubmit={handleSave} className="w-full flex flex-col items-center sm:items-start">
                  {mutationLoading ? (
                    <Box className="lg:w-2/3 md:w-3/4 w-full h-72 flex flex-col justify-center">
                      <LinearProgress />
                    </Box>
                  ) : (
                    <textarea
                      rows={12}
                      cols={48}
                      name="bio"
                      defaultValue={bio}
                      className="block p-2.5 lg:w-4/5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Write your bio here..."
                      overflow-y="scroll"
                    ></textarea>
                  )}

                  <Button
                    size="sm"
                    variant="subtle"
                    className="mt-2 w-10"
                    type="submit"
                  >
                    Save
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        !loading && (
          <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
            Page not found!
          </h1>
        )
      )}
    </>
  )
}

export default Profile
