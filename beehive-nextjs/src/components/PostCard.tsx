import { FC } from 'react'
import { IoBriefcase } from 'react-icons/io5'
import { BsArrowRight } from 'react-icons/bs'
import dayjs from 'dayjs'
import { convertDate } from '@/helper'
import RelieverCard from './RelieverCard'




interface Reliever {
  first_name: string
  last_name: string
  email: string
  qualified: boolean
  id: string
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
  status:string
  time: string
  relievers: Reliever[]
}

interface JobCardProps {
  post: Job
  index: number
  lastChildIndex: number
}

const JobCard: FC<JobCardProps> = ({ post, index, lastChildIndex }) => {


  return (
    <div
      key={post.id}
      className={`p-4 flex sm:flex-row flex-col w-full ${
        index === lastChildIndex ? '' : 'border-b-2'
      }`}
    >
      <div id="left-side" className="flex items-center basis-2/5 ">
        <IoBriefcase className="w-6 h-6 mr-3" />
        <div id="description" className="px-4">
          <div id="qualification">
            <p className="font-bold text-sm sm:text-base mb-2">
              {post.qualified ? 'Qualified' : 'Qualified, Unqualified'}
            </p>
          </div>
          {post.date_from === post.date_to ? (
            <div className="border-2 py-2 px-4 border-amber-400 rounded-md sm:border-0 sm:p-0">
              <span className="text-sm sm:text-base">
                {dayjs(convertDate(post.date_from))
                  .format('dddd')
                  .toUpperCase()}
              </span>
              <h3 className="font-bold text-sm sm:text-base">
                {dayjs(convertDate(post.date_from)).format('DD MMM YYYY')}
              </h3>
              <span className="text-sm sm:text-base">{post.time}</span>
            </div>
          ) : (
            <div className="flex items-center border-2 py-2 px-4 border-amber-400 rounded-md sm:border-0 sm:p-0">
              <div className="mr-2">
                <span className="text-sm sm:text-base">
                  {dayjs(convertDate(post.date_from))
                    .format('dddd')
                    .toUpperCase()}
                </span>
                <h3 className="font-bold text-sm sm:text-base">
                  {dayjs(convertDate(post.date_from)).format('DD MMM YYYY')}
                </h3>
                <span className="text-sm sm:text-base">
                  {post.time.slice(0, 8)}
                </span>
              </div>
              <BsArrowRight className="font-extrabold" />
              <div className="mx-2">
                <span className="text-sm sm:text-base">
                  {dayjs(convertDate(post.date_to))
                    .format('dddd')
                    .toUpperCase()}
                </span>
                <h3 className="font-bold text-sm sm:text-base">
                  {dayjs(convertDate(post.date_to)).format('DD MMM YYYY')}
                </h3>
                <span className="text-sm sm:text-base">
                  {post.time.slice(10)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" w-1 bg-amber-400"></div>
      <div className="flex flex-col ml-8 basis-3/5">
        {post.relievers.map((reliever) => (
        
          <RelieverCard reliever={reliever} key={reliever.id} jobId={post.id} />
        ))}
      </div>
    </div>
  )
}

export default JobCard