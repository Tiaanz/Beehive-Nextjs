import { FC } from 'react'
import { BiTimeFive } from 'react-icons/bi'
import { FaThumbsUp } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'

interface JobStatusProps {
  status: string
  
}

const JobStatus: FC<JobStatusProps> = ({ status}) => {
  return (
    <div className="flex px-4 mb-4">
      {status === 'FUFILLED' ? (
        <>
          <FaThumbsUp className="text-2xl mr-4 text-green-500" />
          <p className="text-green-500">You have been confirmed for this job.</p>
        </>
      ) : status === 'OPEN' ? (
        <>
          <BiTimeFive className="text-2xl text-amber-500 mr-4" />
          <p className="text-amber-500">Awaiting centre&apos;s confirmation.</p>
        </>
      ) : (
        <>
          <ImCancelCircle className="text-2xl text-red-500 mr-4" />
          <p className="text-red-500">This job has been cancelled.</p>
        </>
      )}
    </div>
  )
}

export default JobStatus
