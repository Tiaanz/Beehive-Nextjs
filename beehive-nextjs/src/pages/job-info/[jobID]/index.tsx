import Meta from '@/components/Meta'
import LargeHeading from '@/components/ui/LargeHeading'
import { useRouter } from 'next/router'
import { IoCalendar } from 'react-icons/io5'
import { FaGraduationCap } from 'react-icons/fa'
import { useQuery } from '@apollo/client'
import { GET_JOB_BY_ID } from '@/GraphQL_API'
import { Box, LinearProgress } from '@mui/material'
import JobStatus from '@/components/JobStatus'
import DateAndTime from '@/components/DateAndTime'
import { useSession } from 'next-auth/react'

const JobInfo = () => {

  const { data: session } = useSession()
  
  const router = useRouter()
  const id = router.query.jobID

  const { data, loading, error } = useQuery(GET_JOB_BY_ID, {
    variables: { jobId: id },
  })



  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />
      {error ? (
        <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
          ERROR: {error.message}
        </h1>
      ) : loading ? (
        <Box className="mx-auto w-1/2 pt-80">
          <LinearProgress />
        </Box>
      ) : data?.getJobById ? (
        <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto flex-col">
          <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
            Job information
          </LargeHeading>
          <div className="p-2 max-w-2xl">
            <JobStatus status={data.getJobById?.status} />

            <div className="flex bg-slate-200 p-2">
              <IoCalendar className="text-2xl mr-4" />
              <h3 className="sm:text-lg">Date & Time</h3>
            </div>

            <DateAndTime
              dateFrom={data.getJobById?.date_from}
              dateTo={data.getJobById?.date_to}
              time={data.getJobById?.time}
            />

            <div className="flex bg-slate-200 p-2">
              <FaGraduationCap className="text-2xl mr-4" />
              <h3 className="sm:text-lg">Centre Info</h3>
            </div>

            <div className="flex flex-col items-center mt-2 p-2 shadow-md mb-6 rounded">
              <p className="font-bold">{data.getJobById?.center.name}</p>
              <p>{data.getJobById?.center.address}</p>
            </div>

            <div className="flex bg-slate-200 p-2">
              <FaGraduationCap className="text-2xl mr-4" />
              <h3 className="sm:text-lg">Centre Manager Details</h3>
            </div>

            <hr />

            <div className="flex flex-col items-center mt-2 p-2 shadow-md mb-6 rounded">
              <p className="font-bold">
                {data.getJobById?.center.manager.first_name}{' '}
                {data.getJobById?.center.manager.last_name}
              </p>
              <p>{data.getJobById?.center.manager.phone}</p>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
          Page not found!
        </h1>
      )}
    </>
  )
}

export default JobInfo
