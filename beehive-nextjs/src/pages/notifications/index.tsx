import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import LargeHeading from '@/components/ui/LargeHeading'
import Meta from '@/components/Meta'
import { GET_JOBS, GET_RELIEVER, APPLY_JOB } from '@/GraphQL_API'
import { useMutation, useQuery } from '@apollo/client'
import JobCard from '@/components/JobCard'

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
}

const index = () => {
  const { data: session } = useSession()

  const { data: jobsData } = useQuery(GET_JOBS, {
    variables: { status: 'OPEN' },
  })

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  const [applyJob] = useMutation(APPLY_JOB)

  //get jobs that the reliever has not applied
  const filteredJobs = jobsData?.getOpenJobs?.filter(
    (job: Job) => !job.relieverIDs.includes(relieverData?.getOneReliever?.id)
  )



  function handleApply() {
    // applyJob({
    //   variables: {
    //     applyJobId:
    //    }
    //  })
  }

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:items-start flex-col">
        <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
          Welcome {session?.user?.name} !
        </LargeHeading>

        {relieverData?.getOneReliever?.id &&
          filteredJobs?.map((job: Job, index: number) => (
            <JobCard job={job} index={index} lastChildIndex={filteredJobs.length-1} />
          ))}
       
      </div>
    </>
  )
}

export default index

{
  /* <div>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">
    {'Are you sure you want to apply this job?'}
  </DialogTitle>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>No</Button>
    <Button onClick={() => handleApply()} autoFocus>
      Yes
    </Button>
  </DialogActions>
</Dialog>
</div> */
}
