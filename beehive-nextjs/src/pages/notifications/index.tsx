import { useSession } from 'next-auth/react'
import LargeHeading from '@/components/ui/LargeHeading'
import Meta from '@/components/Meta'
import { GET_JOBS, GET_RELIEVER, GET_POSTS, GET_MANAGER } from '@/GraphQL_API'
import { useQuery } from '@apollo/client'
import JobNotice from '@/components/JobNotice'
import PostNotice from '@/components/PostNotice'
import dayjs from 'dayjs'
import { Box, LinearProgress } from '@mui/material'
import { Job } from '@/model'


const Notifications = () => {
  const { data: session } = useSession()

  
  
  const { data: jobsData, error } = useQuery(GET_JOBS, {
    variables: { status: 'OPEN' },
  })

  const { data: managerData, loading: managerDataLoading } = useQuery(
    GET_MANAGER,
    {
      variables: { email: session?.user?.email },
    }
  )


  const { data: postsData } = useQuery(GET_POSTS, {
    variables: { centerId: managerData?.getManagerByEmail?.ECE_id },
  })


  const { data: relieverData, loading: relieverDataLoading } = useQuery(
    GET_RELIEVER,
    {
      variables: { email: session?.user?.email },
    }
  )

  //show jobs that the reliever has not applied and declined and meets qualification requirement
  // and jobs that are in reliever's available dates
  const filteredJobs = jobsData?.getOpenJobs?.filter(
    (job: Job) =>
      !job.relieverIDs.includes(relieverData?.getRelieverByEmail?.id) &&
      !job.declined_relieverIDs.includes(relieverData?.getRelieverByEmail?.id) &&
      (job.qualified
        ? relieverData?.getRelieverByEmail?.qualified === true
        : true) &&
      !relieverData?.getRelieverByEmail?.not_available_dates.includes(
        job.date_from
      ) &&
      !relieverData?.getRelieverByEmail?.not_available_dates.includes(
        job.date_to
      ) &&
      !relieverData?.getRelieverByEmail?.not_available_dates.some(
        (date: string) =>
          dayjs(date).isBefore(job.date_to) &&
          dayjs(date).isAfter(job.date_from)
      ) &&
      dayjs(job.date_from).isAfter(dayjs(), 'day')
  )

  //get posts that the reliever has applied
  const filteredPosts = postsData?.getPostsByCenter?.filter(
    (post: Job) =>
      post.relieverIDs.length !== 0 &&
      post.status === 'OPEN' &&
      dayjs(post.date_from).isAfter(dayjs(), 'day')
  )
  
  

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

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:items-start flex-col">
        <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
          Welcome {session?.user?.name} !
        </LargeHeading>
        {managerDataLoading || relieverDataLoading ? (
          <Box className="mx-auto w-1/2 pt-40">
            <LinearProgress />
          </Box>
        ) : (
          <>
            {relieverData?.getRelieverByEmail?.id &&
              filteredJobs?.map((job: Job, index: number) => (
                <JobNotice
                  key={job.id}
                  job={job}
                  index={index}
                  lastChildIndex={filteredJobs.length - 1}
                  relieverId={relieverData?.getRelieverByEmail?.id}
                />
              ))}
            {managerData?.getManagerByEmail?.id &&
              filteredPosts?.map((post: Job, index: number) => (
                <PostNotice
                  key={post.id}
                  post={post}
                  index={index}
                  lastChildIndex={filteredPosts.length - 1}
                />
              ))}
            {(filteredPosts?.length === 0 &&
              !relieverData?.getRelieverByEmail?.id )  && (
                <h1 className="p-6 text-lg">
                  You don&apos;t have any notifications.
                </h1>
              )}
            {(filteredJobs?.length === 0 && !managerData?.getManagerByEmail?.id)  && (
              <h1 className="p-6 text-lg">
                You don&apos;t have any notifications.
              </h1>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Notifications
