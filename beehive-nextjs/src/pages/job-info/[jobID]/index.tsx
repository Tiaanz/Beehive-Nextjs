import Meta from '@/components/Meta'
import LargeHeading from '@/components/ui/LargeHeading'
import { useRouter } from 'next/router'
import { FaThumbsUp } from 'react-icons/fa'
import { IoCalendar } from 'react-icons/io5'
import { FaGraduationCap } from 'react-icons/fa'
import { useQuery } from '@apollo/client'
import { GET_JOB_BY_ID } from '@/GraphQL_API'
import dayjs from 'dayjs'
import { convertDate } from '@/helper'
import {BsArrowRight} from 'react-icons/bs'

const index = ({}) => {
  const router = useRouter()
  const id = router.query.jobID

  const { data } = useQuery(GET_JOB_BY_ID, {
    variables: { jobId: id },
  })

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto md:justify-start flex-col">
        <LargeHeading size="sm" className={`p-6 max-w-3xl leading-10`}>
          Job information
        </LargeHeading>
        <div className="p-6 flex">
          <FaThumbsUp className="text-2xl text-green-500 mr-4" />
          <p>You have been confirmed for this job.</p>
        </div>
        <div className="p-6 max-w-lg">
          <div className="flex bg-slate-200 p-2">
            <IoCalendar className="text-2xl mr-4" />
            <h3 className="sm:text-lg">Date & Time</h3>
          </div>
      
          {data?.getJobById?.date_from === data?.getJobById?.date_to ? (
            <div className="flex flex-col items-center mt-2 p-2 shadow-md mb-6 rounded">
              <p>
                {' '}
                {dayjs(convertDate(data?.getJobById?.date_from))
                  .format('dddd')
                  .toUpperCase()}
              </p>
              <p className="font-bold">
                {dayjs(convertDate(data?.getJobById?.date_from)).format(
                  'DD MMM YYYY'
                )}
              </p>
              <p>{data?.getJobById?.time}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center px-4 py-2 shadow-md mb-6 rounded">
              <div className="mr-2">
                <span className="text-sm sm:text-base">
                  {dayjs(convertDate(data?.getJobById?.date_from))
                    .format('dddd')
                    .toUpperCase()}
                </span>
                <h3 className="font-bold text-sm sm:text-base">
                  {dayjs(convertDate(data?.getJobById?.date_from)).format('DD MMM YYYY')}
                </h3>
                <span className="text-sm sm:text-base">
                  {data?.getJobById?.time.slice(0, 8)}
                </span>
              </div>
              <BsArrowRight className="font-extrabold" />
              <div className="mx-2">
                <span className="text-sm sm:text-base">
                  {dayjs(convertDate(data?.getJobById?.date_to)).format('dddd').toUpperCase()}
                </span>
                <h3 className="font-bold text-sm sm:text-base">
                  {dayjs(convertDate(data?.getJobById?.date_to)).format('DD MMM YYYY')}
                </h3>
                <span className="text-sm sm:text-base">
                  {data?.getJobById?.time.slice(10)}
                </span>
              </div>
            </div>
          )}

          <div className="flex  bg-slate-200 p-2">
            <FaGraduationCap className="text-2xl mr-4" />
            <h3 className="sm:text-lg">Centre Info</h3>
          </div>
          <div className="flex flex-col items-center mt-2 p-2 shadow-md mb-6 rounded">
            <p className="font-bold">{data?.getJobById?.center?.name}</p>
            <p>{data?.getJobById?.center?.address}</p>
          </div>
          <div className="flex  bg-slate-200 p-2">
            <FaGraduationCap className="text-2xl mr-4" />
            <h3 className="sm:text-lg">Centre Manager Details</h3>
          </div>
          <hr />
          <div className="flex flex-col items-center mt-2 p-2 shadow-md mb-6 rounded">
            <p className="font-bold">{data?.getJobById?.center?.manager.first_name} { data?.getJobById?.center?.manager.last_name}</p>
            <p>{data?.getJobById?.center?.manager.phone}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
