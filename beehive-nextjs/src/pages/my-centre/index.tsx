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
import {GET_MANAGER,GET_CENTER,UPDATE_CENTER } from '@/GraphQL_API'

const page = () => {
  const { data: session } = useSession()
  console.log(session?.user)

  const { data:managerData } = useQuery(GET_MANAGER, {
    variables: { email: session?.user?.email },
  })

  const { data:centerData, loading, error } = useQuery(GET_CENTER, {
    variables: {ECE_id:managerData?.getOneManager?.ECE_id},
  })

  const [updateCenter, { loading: mutationLoading }] =
    useMutation(UPDATE_CENTER)

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [description, setDescription] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>()

  useEffect(() => {
    if (!loading) {
      setDescription(centerData?.getOneCenter?.description)
      setImageUrl(centerData?.getOneCenter?.photo_url)
    }
  }, [loading])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const data = new FormData(event.currentTarget)
      const res = await updateCenter({
        variables: {
          eceId: managerData?.getOneManager?.ECE_id,
          description: data.get('description'),
        },
      })
      setIsEditing(false)
      setDescription(res.data.updateCenter.description)
    } catch (error) {
      const typedError = error as Error
      toast({
        title: 'Invalid input',
        message: typedError.message,
        type: 'error',
      })
    }
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      reader.onloadend = async () => {
        const res = await updateCenter({
          variables: {
            eceId: managerData?.getOneManager?.ECE_id,
            photoUrl: reader.result as string,
          },
        })
        setImageUrl(res.data.updateCenter.photo_url)
      }

      reader.readAsDataURL(file)
    }
  }

  if (error) {
    console.error(error)
    return <div>Error!</div>
  }

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">

        <div className="basis-1/3 flex flex-col items-center">
          <Avatar
            alt="profile photo"
            src={imageUrl ? imageUrl : './centre_avatar.jpeg'}
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
          <p className="text-sm md:text-lg font-bold">{centerData?.getOneCenter?.name}</p>
          <p className="text-sm md:text-base">Center Manager: {session?.user?.name}</p>
          <p className="text-sm md:text-base">{session?.user?.email}</p>
          <p className="text-sm md:text-base">{managerData?.getOneManager?.phone}</p>
          <p className="text-sm md:text-base italic">{centerData?.getOneCenter?.address}</p>
        </div>
        <div className="basis-2/3 flex flex-col md:justify-start md:items-start items-center">
          <h3 className="md:my-4 my-2 font-bold md:text-lg text-sm">
            Description
          </h3>
          {loading && (
            <Box className="lg:w-2/3 md:w-3/4 w-full h-72 flex flex-col justify-center">
              <LinearProgress />
            </Box>
          )}
          {description && !loading && !isEditing ? (
            <>
              <div className="w-full my-2 lg:w-4/5  border-2 border-slate-300 rounded-lg p-6 flex md:h-72 h-44">
                <Paragraph size="sm" className="overflow-y-scroll text-left ">
                  {description}
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
              <form onSubmit={handleSave} className="w-full flex flex-col">
                {mutationLoading ? (
                  <Box className="lg:w-2/3 md:w-3/4 w-full h-72 flex flex-col justify-center">
                    <LinearProgress />
                  </Box>
                ) : (
                  <textarea
                    rows={15}
                    name="description"
                    defaultValue={description}
                    className="block p-2.5 lg:w-2/3 md:w-3/4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
    </>
  )
}

export default page
