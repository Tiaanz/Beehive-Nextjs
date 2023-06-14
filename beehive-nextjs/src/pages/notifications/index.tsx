import { useSession } from 'next-auth/react'
import LargeHeading from '@/components/ui/LargeHeading'
import Meta from '@/components/Meta'
import { GET_JOBS, GET_RELIEVER, GET_POSTS, GET_MANAGER } from '@/GraphQL_API'
import { useMutation, useQuery } from '@apollo/client'
import JobCard from '@/components/JobCard'
import { useEffect, useState } from 'react'
import PostCard from '@/components/PostCard'
import dayjs from 'dayjs'
import { convertDate } from '@/helper'

interface Reliever {
  id: string
  first_name: string
  last_name: string
  email: string
  qualified: boolean
}
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
  status: string
  relieverIDs: string[]
  declined_relieverIDs: string[]
  relievers: Reliever[]
}

const index = () => {
  const { data: session } = useSession()

  const { data: jobsData } = useQuery(GET_JOBS, {
    variables: { status: 'OPEN' },
  })

  const { data: managerData } = useQuery(GET_MANAGER, {
    variables: { email: session?.user?.email },
  })

  const { data: postsData } = useQuery(GET_POSTS, {
    variables: { centerId: managerData?.getOneManager?.ECE_id },
  })

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables: { email: session?.user?.email },
  })

  //get jobs that the reliever has not applied and declined and meets qualification requirement
  const filteredJobs = jobsData?.getOpenJobs?.filter(
    (job: Job) =>
      !job.relieverIDs.includes(relieverData?.getOneReliever?.id) &&
      !job.declined_relieverIDs.includes(relieverData?.getOneReliever?.id) &&
      (job.qualified
        ? relieverData?.getOneReliever?.qualified === true
        : true) &&
      !relieverData?.getOneReliever?.not_available_dates.includes(
        job.date_from
      ) &&
      !relieverData?.getOneReliever?.not_available_dates.includes(
        job.date_to
      ) &&
      !relieverData?.getOneReliever?.not_available_dates.some((date: string) =>
       ( dayjs(convertDate(date)).isBefore(convertDate(job.date_to))&& dayjs(convertDate(date)).isAfter(convertDate(job.date_from)))
      )
  )


  

  //get posts that the reliever has applied
  const filteredPosts = postsData?.getPostsByCenter?.filter(
    (post: Job) => post.relieverIDs.length !== 0 && post.status === 'OPEN'
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
        {managerData?.getOneManager?.id &&
          filteredPosts?.map((post: Job, index: number) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              lastChildIndex={filteredPosts.length - 1}
            />
          ))}
      </div>
    </>
  )
}

export default index
