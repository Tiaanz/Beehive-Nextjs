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

const index = () => {
  const { data: session } = useSession()

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs())
  const [jobs, setJobs] = React.useState<Job[]>([])

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const [getJobs] = useLazyQuery(GET_RELIEVER_JOBS)

  interface Job {
    center: {
      name: string
      address: string
    }
    id: string
    qualified: boolean
    date_from: string
    date_to: string
    time: string
    relieverIDs: string[]
    declined_relieverIDs: string[]
    status:string
  }

  async function fetchJobs() {
    const res = await getJobs({
      variables: {
        dateFrom: selectedDate?.format('DD/MM/YYYY'),
        dateTo: selectedDate?.format('DD/MM/YYYY'),
      },
    })

   
    setJobs(res?.data?.getJobsByReliever || [])
  }

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

        <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto flex-col items-start">
          <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
            My Jobs
          </LargeHeading>
          <div className="flex">
            <DateCalendar
              sx={{ margin: 0 }}
              value={selectedDate}
              onChange={(newValue) => handleDateChange(newValue)}
              className="mr-6 min-w-fit"
            />
            <div className="flex flex-wrap">
              {filteredJobs?.map((job) => (
                <ul
                  key={job.id}
                  className="space-y-2 border-2 p-4 h-fit border-amber-400 rounded-md mr-4"
                >
                  <li className='font-bold'>{ job.center.name}</li>
                  <li>Time: {job.time}</li>
                  <li className='text-sm text-slate-600'> {job.qualified ? 'Qualified' : 'Qualified, Unqualified'}</li>
                  <li>
                    Status:{' '}
                    <span
                      style={{
                        color: job.status === 'OPEN' ? 'orange' : 'green',
                      }}
                    >
                      {job.status==="OPEN"?"Awaiting center confirmation":"CONFIRMED"}
                    </span>
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
