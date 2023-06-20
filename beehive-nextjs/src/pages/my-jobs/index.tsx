import * as React from 'react'
import { useSession } from 'next-auth/react'
import Meta from '@/components/Meta'
import LargeHeading from '@/components/ui/LargeHeading'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import Badge from '@mui/material/Badge'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import dayjs, { Dayjs } from 'dayjs'
import {
  GET_RELIEVER_JOBS,
  GET_RELIEVER,
  GET_POSTS_BY_MONTH,
} from '@/GraphQL_API'
import { useLazyQuery, useQuery } from '@apollo/client'
import Link from 'next/link'
import { Job } from '@/model'
import { formatHighlightedDatesFromArray,extractDatesFromArray } from '@/helper'

// function ServerDay(
//   props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
// ) {
//   const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

//   const isSelected =
//     !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0

//   return (
//     <Badge
//       key={props.day.toString()}
//       overlap="circular"
//       badgeContent={isSelected ? '🟢' : undefined}
//     >
//       <PickersDay
//         {...other}
//         outsideCurrentMonth={outsideCurrentMonth}
//         day={day}
//       />
//     </Badge>
//   )
// }

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

interface Post {
  date_from: string
  date_to: string
  relieverIDs: string[]
  status: string
}

const index = () => {
  const { data: session } = useSession()

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs())
  const [jobs, setJobs] = React.useState<Job[]>([])
  // const [highlightedDays, setHighlightedDays] = React.useState<number[]>([])
  const [highlightedDays, setHighlightedDays] = React.useState<
    { date: number; badgeContent: React.ReactNode }[]
  >([])
  const { data: relieverData, error } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const { data } = useQuery(GET_POSTS_BY_MONTH, {
    variables: {
      dateFrom: `${dayjs().format('YYYY')}/${dayjs().format('MM')}/01`,
      dateTo: `${dayjs().format('YYYY')}/${dayjs().format('MM')}/31`,
    },
  })

  const [getJobs] = useLazyQuery(GET_RELIEVER_JOBS)
  const [getPostsByMonth] = useLazyQuery(GET_POSTS_BY_MONTH)

  async function fetchJobs() {
    const res = await getJobs({
      variables: {
        dateFrom: selectedDate?.format('YYYY/MM/DD'),
        dateTo: selectedDate?.format('YYYY/MM/DD'),
      },
    })

    setJobs(res?.data?.getJobsByReliever || [])
  }

  //only show the jobs that the reliever has applied
  const filteredJobs = jobs.filter((job: Job) =>
    job.relieverIDs.includes(relieverData?.getOneReliever?.id)
  )

  function handleDateChange(value: Dayjs | null) {
    setSelectedDate(value)
  }

  async function handleMonthChange(month: Dayjs | null) {
    const res = await getPostsByMonth({
      variables: {
        dateFrom: `${dayjs(month).format('YYYY')}/${dayjs(month).format(
          'MM'
        )}/01`,
        dateTo: `${dayjs(month).format('YYYY')}/${dayjs(month).format(
          'MM'
        )}/31`,
      },
    })
    
    setHighlightedDays(formatHighlightedDatesFromArray(
      res?.data?.getPostsByMonth?.filter(
        (post: Post) =>
          post.relieverIDs.includes(relieverData?.getOneReliever?.id) 
      )
    ));

  }

  async function handleYearChange(year: Dayjs | null) {
    const res = await getPostsByMonth({
      variables: {
        dateFrom: `${dayjs(year).format('YYYY')}/${dayjs(year).format(
          'MM'
        )}/01`,
        dateTo: `${dayjs(year).format('YYYY')}/${dayjs(year).format('MM')}/31`,
      },
    })

    setHighlightedDays(formatHighlightedDatesFromArray(
      res?.data?.getPostsByMonth?.filter(
        (post: Post) =>
          post.relieverIDs.includes(relieverData?.getOneReliever?.id) 
      )
    ));
  }

  React.useEffect(() => {
    fetchJobs()
  }, [selectedDate, jobs])

  React.useEffect(() => {
    
    setHighlightedDays(formatHighlightedDatesFromArray(
      data?.getPostsByMonth?.filter(
        (post: Post) =>
          post.relieverIDs.includes(relieverData?.getOneReliever?.id) 
      )
    ));
      
    // setHighlightedDays([
    //   { date: 1, badgeContent: '🟢' },
    //   { date: 15, badgeContent: '🔴' },
    // ])
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

        <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto flex-col xl:items-start items-center">
          <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
            My Jobs
          </LargeHeading>
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
            <div className="flex flex-wrap xl:justify-start justify-center ">
              {filteredJobs?.map((job) => (
                <ul
                  key={job.id}
                  className="flex flex-col space-y-2 border-2 p-4 h-fit border-amber-400 rounded-md sm:mr-4 mb-4"
                >
                  <li className="font-bold hover:underline">
                    <Link href={`/profile/centre-profile/${job.center.ECE_id}`}>
                      {job.center.name}
                    </Link>
                  </li>
                  <li>Time: {job.time}</li>
                  <li className="text-sm text-slate-600">
                    {' '}
                    {job.qualified ? 'Qualified' : 'Qualified, Unqualified'}
                  </li>
                  <li>
                    Status:{' '}
                    <span
                      style={{
                        color:
                          job.status === 'OPEN'
                            ? 'orange'
                            : job.status === 'FUFILLED'
                            ? 'green'
                            : 'red',
                      }}
                    >
                    
                      {job.status === 'OPEN'
                        ? 'Awaiting center confirmation'
                        : job.status === 'FUFILLED'
                        ? 'CONFIRMED'
                        : 'CANCELLED'}
                    </span>
                  </li>
                  <li className="self-end text-amber-600 underline">
                    <Link href={`/job-info/${job.id}`}>Detail...</Link>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </>
    </LocalizationProvider>
  )
}

export default index
