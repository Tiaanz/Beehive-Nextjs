import * as React from 'react'
import { useSession } from 'next-auth/react'
import Meta from '@/components/Meta'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs, { Dayjs } from 'dayjs'
import { GET_POSTS, GET_MANAGER } from '@/GraphQL_API'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Job } from '@/model'
import PostByDay from '@/components/PostByDay'

const index = () => {
  const { data: session } = useSession()

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs())
  const [posts, setPosts] = React.useState<Job[]>([])

  const { data: managerData } = useQuery(GET_MANAGER, {
    variables: { email: session?.user?.email },
  })

  const [getPosts] = useLazyQuery(GET_POSTS)

  async function fetchPosts() {
    const res = await getPosts({
      variables: {
        centerId: managerData?.getOneManager?.ECE_id,
        dateFrom: selectedDate?.format('YYYY/MM/DD'),
        dateTo: selectedDate?.format('YYYY/MM/DD'),
      },
    })

    setPosts(res?.data?.getPostsByCenter || [])
  }

  function handleDateChange(value: Dayjs | null) {
    setSelectedDate(value)
  }

  React.useEffect(() => {
    fetchPosts()
  }, [selectedDate, posts])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <Meta title="Early childhood Relief teachers | Beehive" />

        <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto flex-col items-start">
          <div className="flex mb-8">
            <AiOutlinePlusCircle className="w-10 h-10 mx-1" />
            <Link href="/my-posts/add-post">
              <Button>Add a post</Button>
            </Link>
          </div>
          <div className="flex xl:flex-row flex-col items-center">
            <DateCalendar
              sx={{ margin: 0 }}
              value={selectedDate}
              onChange={(newValue) => handleDateChange(newValue)}
              className="mr-6 min-w-fit"
            />
            <div className="flex flex-wrap sm:flex-row flex-col xl:justify-start justify-center">
              {posts?.map((post) => (
                <PostByDay key={post.id} post={post} fetchPosts={fetchPosts} />
              ))}
            </div>
          </div>
        </div>
      </>
    </LocalizationProvider>
  )
}

export default index
