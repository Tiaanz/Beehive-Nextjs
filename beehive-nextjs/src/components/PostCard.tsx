import { FC } from 'react'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { APPLY_JOB, DECLINE_JOB } from '@/GraphQL_API'
import { IoBriefcase } from 'react-icons/io5'
import { BsArrowRight } from 'react-icons/bs'
import dayjs, { Dayjs } from 'dayjs'
import { convertDate } from '@/helper'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

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
  relievers: {
    first_name: string
    email: string
  }
}

interface JobCardProps {
  post: Job
  index: number
  lastChildIndex: number
}

const JobCard: FC<JobCardProps> = ({ post, index, lastChildIndex }) => {
  const [applyAlert, setApplyAlert] = useState(false)
  const [declineAlert, setDeclineAlert] = useState(false)

  const [applyJob] = useMutation(APPLY_JOB)
  const [declineJob] = useMutation(DECLINE_JOB)

  // async function handleApply() {
  //   await applyJob({
  //     variables: {
  //       applyJobId: job.id,
  //       relieverId,
  //     },
  //   })

  //   setApplyAlert(false)
  // }

  // async function handleDecline() {
  //   await declineJob({
  //     variables: {
  //       declineJobId: job.id,
  //       relieverId,
  //     },
  //   })

  //   setDeclineAlert(false)
  // }

  return (
    <div
      key={post.id}
      className={`p-4 flex sm:flex-row flex-col w-full ${
        index === lastChildIndex ? '' : 'border-b-2'
      }`}
    >
      <div className="flex items-center sm:justify-start basis-2/5 ">
        <IoBriefcase className="w-6 h-6 mr-3" />
        <div className="mr-4">
          <p className="font-bold text-sm sm:text-base">
            {post.qualified ? 'Qualified' : 'Qualified, Unqualified'}
          </p>
        </div>
      </div>
      <div className=" w-1 bg-amber-400"></div>
      <div className="flex sm:ml-12 items-center ml-8 sm:justify-between  basis-3/5">
        {post.date_from === post.date_to ? (
          <div className="border-2 p-2 border-amber-400 rounded-md sm:border-0 sm:p-0">
            <span className="text-sm sm:text-base">
              {dayjs(convertDate(post.date_from)).format('dddd').toUpperCase()}
            </span>
            <h3 className="font-bold text-sm sm:text-base">
              {dayjs(convertDate(post.date_from)).format('DD MMM YYYY')}
            </h3>
            <span className="text-sm sm:text-base">{post.time}</span>
          </div>
        ) : (
          <div className="flex items-center border-2 p-2 border-amber-400 rounded-md sm:border-0 sm:p-0">
            <div className="mr-2">
              <span className="text-sm sm:text-base">
                {dayjs(convertDate(post.date_from)).format('dddd').toUpperCase()}
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
                {dayjs(convertDate(post.date_to)).format('dddd').toUpperCase()}
              </span>
              <h3 className="font-bold text-sm sm:text-base">
                {dayjs(convertDate(post.date_to)).format('DD MMM YYYY')}
              </h3>
              <span className="text-sm sm:text-base">{post.time.slice(10)}</span>
            </div>
          </div>
        )}
        <div className="lg:space-x-4 hidden sm:flex flex-col lg:flex-row">
          <button
            onClick={() => setApplyAlert(true)}
            className="px-6 py-1 my-4 lg:my-0 bg-green-500 text-white uppercase rounded shadow-lg hover:bg-green-400"
          >
            Apply
          </button>
          <button
            onClick={() => setDeclineAlert(true)}
            className="px-6 py-1 bg-rose-500 text-white uppercase rounded shadow-lg hover:bg-rose-400"
          >
            Decline
          </button>
        </div>
      </div>
      <div className="sm:hidden space-x-10 flex justify-center">
        <button
          onClick={() => setApplyAlert(true)}
          className="px-6 py-1 my-4 lg:my-0 bg-green-500 text-white uppercase rounded shadow-lg hover:bg-green-400"
        >
          Apply
        </button>
        <button
          onClick={() => setDeclineAlert(true)}
          className="px-6 py-1 my-4 lg:my-0 bg-rose-500 text-white uppercase rounded shadow-lg hover:bg-rose-400"
        >
          Decline
        </button>
      </div>
      {/* <div>
        <Dialog
          open={applyAlert}
          onClose={() => setApplyAlert(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure you want to apply this job at ${job.center.name} ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setApplyAlert(false)}>No</Button>
            <Button onClick={handleApply} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={declineAlert}
          onClose={() => setDeclineAlert(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure you want to decline this job at ${job.center.name}?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeclineAlert(false)}>No</Button>
            <Button onClick={handleDecline} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div> */}
    </div>
  )
}

export default JobCard
