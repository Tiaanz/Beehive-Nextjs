import { useSession } from 'next-auth/react'
import LargeHeading from '@/components/ui/LargeHeading'
import Meta from '@/components/Meta'
import { GET_JOBS, GET_RELIEVER, APPLY_JOB } from '@/GraphQL_API'
import { useMutation, useQuery } from '@apollo/client'
import JobCard from '@/components/JobCard'
import { useEffect, useState } from 'react'

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
  declined_relieverIDs:string[]
}

const index = () => {
  const { data: session } = useSession()

  const { data: jobsData } = useQuery(GET_JOBS, {
    variables: { status: 'OPEN' },
   
  })

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })



  //get jobs that the reliever has not applied and declined
  const filteredJobs = jobsData?.getOpenJobs?.filter(
    (job: Job) => (!job.relieverIDs.includes(relieverData?.getOneReliever?.id) && !job.declined_relieverIDs.includes(relieverData?.getOneReliever?.id))
  )

  
  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:items-start flex-col">
        <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
          Welcome {session?.user?.name} !
        </LargeHeading>
        {relieverData?.getOneReliever?.id &&
          filteredJobs?.map((job: Job, index: number) => (
            <JobCard
              key={job.id}
              job={job}
              index={index}
              lastChildIndex={filteredJobs.length - 1}
              relieverId={relieverData?.getOneReliever?.id}
              
            />
          ))}
      </div>
    </>
  )
}

export default index
