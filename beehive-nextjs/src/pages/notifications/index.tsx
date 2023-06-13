
import { useSession } from 'next-auth/react'
import LargeHeading from '@/components/ui/LargeHeading'
import Meta from '@/components/Meta'
import { GET_JOBS,GET_RELIEVER } from '@/GraphQL_API'
import { useQuery } from '@apollo/client'
import { IoBriefcase } from 'react-icons/io5'
import { BsArrowRight } from 'react-icons/bs'
import dayjs, { Dayjs } from 'dayjs'
import { convertDate } from '@/helper'

interface Job{
  center :{
    name:string
    address:string
  }
  id:string
  qualified:boolean
  date_from:string
  date_to:string
  time:string
}


const index= ({}) => {
  const { data: session } = useSession()

  const { data: jobsData } = useQuery(GET_JOBS, {
    variables: { status: 'OPEN' },
  })

  const { data: relieverData } = useQuery(GET_RELIEVER, {
    variables:{email:session?.user?.email}
  })


  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:items-start flex-col">
        <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
          Welcome {session?.user?.name} !
        </LargeHeading>
        
        {relieverData?.getOneReliever?.id && jobsData?.getOpenJobs?.map((job: any, index: number) => (
          <div
            key={job.id}
            className={`p-4 flex sm:flex-row flex-col w-full ${
              index === jobsData.getOpenJobs.length - 1 ? '' : 'border-b-2'
            }`}
          >
            <div className="flex items-center sm:justify-start basis-2/5 ">
              <IoBriefcase className="w-6 h-6 mr-3" />
              <div className="mr-4">
                <h4>{job.center.name}</h4>
                <span className="text-sm text-slate-500">
                  {job.center.address}
                </span>
                <p className="font-bold text-sm sm:text-base">
                  {job.qualified ? 'Qualified' : 'Qualified, Unqualified'}
                </p>
              </div>
            </div>
            <div className=" w-1 bg-amber-400"></div>
            <div className="flex sm:ml-12 items-center ml-8 sm:justify-between  basis-3/5">
              {job.date_from === job.date_to ? (
                <div className='border-2 p-2 border-amber-400 rounded-md sm:border-0 sm:p-0'>
                  <span className='text-sm sm:text-base'>
                    {dayjs(convertDate(job.date_from))
                      .format('dddd')
                      .toUpperCase()}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base">
                    {dayjs(convertDate(job.date_from)).format('DD MMM YYYY')}
                  </h3>
                  <span className='text-sm sm:text-base'>{job.time}</span>
                </div>
              ) : (
                <div className='flex items-center border-2 p-2 border-amber-400 rounded-md sm:border-0 sm:p-0'>
                  <div className='mx-2'>
                    <span className='text-sm sm:text-base'>
                      {dayjs(convertDate(job.date_from))
                        .format('dddd')
                        .toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base">
                      {dayjs(convertDate(job.date_from)).format('DD MMM YYYY')}
                    </h3>
                    <span className='text-sm sm:text-base'>{job.time.slice(0, 8)}</span>
                  </div>
                  <BsArrowRight className="font-extrabold" />
                  <div className='mx-2'>
                    <span className='text-sm sm:text-base'>
                      {dayjs(convertDate(job.date_to))
                        .format('dddd')
                        .toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base">
                      {dayjs(convertDate(job.date_to)).format('DD MMM YYYY')}
                    </h3>
                    <span className='text-sm sm:text-base'>{job.time.slice(10)}</span>
                  </div>
                </div>
              )}  
              <div className="lg:space-x-4 hidden sm:flex flex-col lg:flex-row">
                <button className="px-6 py-1 my-4 lg:my-0 bg-green-500 text-white uppercase rounded shadow-lg hover:bg-green-400">
                  Apply
                </button>
                <button className="px-6 py-1 bg-rose-500 text-white uppercase rounded shadow-lg hover:bg-rose-400">
                  Decline
                </button>
              </div>
            </div>
            <div className="sm:hidden space-x-10 flex justify-center">
                <button className="px-6 py-1 my-4 lg:my-0 bg-green-500 text-white uppercase rounded shadow-lg hover:bg-green-400">
                  Apply
                </button>
                <button className="px-6 py-1 my-4 lg:my-0 bg-rose-500 text-white uppercase rounded shadow-lg hover:bg-rose-400">
                  Decline
                </button>
              </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default index
