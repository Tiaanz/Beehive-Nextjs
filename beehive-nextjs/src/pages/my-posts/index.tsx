import * as React from 'react'
import { useSession } from 'next-auth/react'
import Meta from '@/components/Meta'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import Badge from '@mui/material/Badge'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import dayjs, { Dayjs } from 'dayjs'
import { GET_POSTS, GET_MANAGER, GET_POSTS_BY_MONTH } from '@/GraphQL_API'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Job } from '@/model'
import PostByDay from '@/components/PostByDay'
import { formatHighlightedDatesFromArray } from '@/helper'
import { Box, CircularProgress } from '@mui/material'

function ServerDay(
  props: PickersDayProps<Dayjs> & {
    highlightedDays?: {
      date: number
      badgeContent: React.ReactNode
    }[]
  }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

  const matchedDay = highlightedDays.find((item) => item.date === day.date())
  const isSelected = !outsideCurrentMonth && matchedDay

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? matchedDay?.badgeContent : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  )
}

const MyPosts = () => {
  const { data: session } = useSession()

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs())

  const [highlightedDays, setHighlightedDays] = React.useState<
    { date: number; badgeContent: React.ReactNode }[]
  >([])

  const [posts, setPosts] = React.useState<Job[]>([])

  const { data: managerData, error } = useQuery(GET_MANAGER, {
    variables: { email: session?.user?.email },
  })

  const { data } = useQuery(GET_POSTS_BY_MONTH, {
    variables: {
      centerId: managerData?.getOneManager?.ECE_id,
      dateFrom: `${dayjs().format('YYYY')}/${dayjs().format('MM')}/01`,
      dateTo: `${dayjs().format('YYYY')}/${dayjs().format('MM')}/31`,
    },
  })

  const [getPostsByMonth] = useLazyQuery(GET_POSTS_BY_MONTH)
  const [getPosts, { loading: fetchJobLoading }] = useLazyQuery(GET_POSTS)

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

  async function handleMonthChange(month: Dayjs | null) {
    setHighlightedDays([])
    const res = await getPostsByMonth({
      variables: {
        centerId: managerData?.getOneManager?.ECE_id,
        dateFrom: `${dayjs(month).format('YYYY')}/${dayjs(month).format(
          'MM'
        )}/01`,
        dateTo: `${dayjs(month).format('YYYY')}/${dayjs(month).format(
          'MM'
        )}/31`,
      },
    })

    setHighlightedDays(
      formatHighlightedDatesFromArray(
        res?.data?.getPostsByMonth,
        dayjs(month).month()
      )
    )
  }

  async function handleYearChange(year: Dayjs | null) {
    setHighlightedDays([])
    const res = await getPostsByMonth({
      variables: {
        centerId: managerData?.getOneManager?.ECE_id,
        dateFrom: `${dayjs(year).format('YYYY')}/${dayjs(year).format(
          'MM'
        )}/01`,
        dateTo: `${dayjs(year).format('YYYY')}/${dayjs(year).format('MM')}/31`,
      },
    })
    setHighlightedDays(
      formatHighlightedDatesFromArray(
        res?.data?.getPostsByMonth,
        dayjs(year).month()
      )
    )
  }

  React.useEffect(() => {
    fetchPosts()
  }, [selectedDate])

  React.useEffect(() => {
    setHighlightedDays(() =>
      formatHighlightedDatesFromArray(data?.getPostsByMonth, dayjs().month())
    )
  }, [data?.getPostsByMonth])

  if (error) {
    return (
      <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
        ERROR: {error?.message}
      </h1>
    )
  }

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
              onYearChange={(newYear) => handleYearChange(newYear)}
              onMonthChange={(newMonth) => handleMonthChange(newMonth)}
              className="mr-6 min-w-fit"
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                } as any,
              }}
            />
            <div className="flex flex-wrap sm:flex-row flex-col xl:justify-start justify-center">
              {fetchJobLoading ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              ) : (
                posts?.map((post) => (
                  <PostByDay
                    key={post.id}
                    post={post}
                    selectedDate={selectedDate}
                    fetchPosts={fetchPosts}
                    setHighlightedDays={setHighlightedDays}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </>
    </LocalizationProvider>
  )
}

export default MyPosts
