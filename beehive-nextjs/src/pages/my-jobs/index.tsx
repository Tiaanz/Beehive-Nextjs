import * as React from 'react'
import { useSession } from 'next-auth/react'
import Meta from '@/components/Meta'
import LargeHeading from '@/components/ui/LargeHeading'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs, { Dayjs } from 'dayjs'
import { GET_RELIEVER_JOBS, GET_RELIEVER } from '@/GraphQL_API'
import { useLazyQuery, useQuery } from '@apollo/client'
import Link from 'next/link'
import { Job } from '@/model'

const index = () => {
  const { data: session } = useSession()

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs())
  const [jobs, setJobs] = React.useState<Job[]>([])

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const [getJobs] = useLazyQuery(GET_RELIEVER_JOBS)

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

  React.useEffect(() => {
    fetchJobs()
  }, [selectedDate, jobs])

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
              className="sm:mr-6 min-w-fit"
            />
            <div className="flex flex-wrap xl:justify-start justify-center ">
              {filteredJobs?.map((job) => (
                <ul
                  key={job.id}
                  className="flex flex-col space-y-2 border-2 p-4 h-fit border-amber-400 rounded-md sm:mr-4 mb-4"
                >
                  <li className="font-bold hover:underline">
                    <Link
                      href={
                        job.status === 'FUFILLED'
                          ? `/job-info/${job.id}`
                          : `/profile/centre-profile/${job.center.ECE_id}`
                      }
                    >
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
                        color: job.status === 'OPEN'
                        ? 'green'
                        : job.status==='FUFILLED'
                        ? 'orange'
                        : 'red',
                      }}
                    >
                      {/* {job.status} */}
                      {job.status === 'OPEN'
                        ? 'Awaiting center confirmation'
                        : job.status==='FUFILLED'
                        ? 'CONFIRMED'
                        : 'CANCELLED'}
                    </span>
                  </li>
                  <li className='self-end text-amber-600 underline'><Link href={`/job-info/${job.id}`}>Detail...</Link></li>
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
