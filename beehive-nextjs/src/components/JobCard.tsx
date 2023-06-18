import { FC } from 'react'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { APPLY_JOB, DECLINE_JOB } from '@/GraphQL_API'
import { IoBriefcase } from 'react-icons/io5'
import { BsArrowRight } from 'react-icons/bs'
import dayjs from 'dayjs'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { toast } from './ui/Toast'
import Link from 'next/link'
import { Job } from '@/model'



interface JobCardProps {
  job: Job
  index: number
  lastChildIndex: number
  relieverId: string
}

const JobCard: FC<JobCardProps> = ({
  job,
  index,
  lastChildIndex,
  relieverId,
}) => {
  const [applyAlert, setApplyAlert] = useState(false)
  const [declineAlert, setDeclineAlert] = useState(false)

  const [applyJob] = useMutation(APPLY_JOB)
  const [declineJob] = useMutation(DECLINE_JOB)

  async function handleApply() {
    await applyJob({
      variables: {
        applyJobId: job.id,
        relieverId,
      },
    })

    setApplyAlert(false)
    
    toast({
      title: 'Success',
      message: 'You have successfully applied this job.',
      type: 'success',
    })
  }

  async function handleDecline() {
    await declineJob({
      variables: {
        declineJobId: job.id,
        relieverId,
      },
    })

    setDeclineAlert(false)
    toast({
      title: 'Alert',
      message: 'You have declined this job.',
      type: 'alert',
    })
  }

  return (
    <div
      key={job.id}
      className={`p-4 flex sm:flex-row flex-col w-full ${
        index === lastChildIndex ? '' : 'border-b-2'
      }`}
    >
      <div className="flex items-center sm:justify-start basis-2/5 ">
        <IoBriefcase className="w-6 h-6 mr-3" />
        <div className="mr-4">
         <Link href={`/profile/centre-profile/${job.center.ECE_id}`}> <h4 className='hover:underline'>{job.center.name}</h4></Link>
          <span className="text-sm text-slate-500">{job.center.address}</span>
          <p className="font-bold text-sm sm:text-base">
            {job.qualified ? 'Qualified' : 'Qualified, Unqualified'}
          </p>
        </div>
      </div>
      <div className=" w-1 bg-amber-400"></div>
      <div className="flex sm:ml-12 items-center ml-8 sm:justify-between  basis-3/5">
        {job.date_from === job.date_to ? (
          <div className="border-2 px-4 py-2 border-amber-400 rounded-md sm:border-0 sm:p-0">
            <span className="text-sm sm:text-base">
              {dayjs(job.date_from).format('dddd').toUpperCase()}
            </span>
            <h3 className="font-bold text-sm sm:text-base">
              {dayjs(job.date_from).format('DD MMM YYYY')}
            </h3>
            <span className="text-sm sm:text-base">{job.time}</span>
          </div>
        ) : (
          <div className="flex items-center border-2 px-4 py-2 border-amber-400 rounded-md sm:border-0 sm:p-0">
            <div className="mr-2">
              <span className="text-sm sm:text-base">
                {dayjs(job.date_from).format('dddd').toUpperCase()}
              </span>
              <h3 className="font-bold text-sm sm:text-base">
                {dayjs(job.date_from).format('DD MMM YYYY')}
              </h3>
              <span className="text-sm sm:text-base">
                {job.time.slice(0, 8)}
              </span>
            </div>
            <BsArrowRight className="font-extrabold" />
            <div className="mx-2">
              <span className="text-sm sm:text-base">
                {dayjs(job.date_to).format('dddd').toUpperCase()}
              </span>
              <h3 className="font-bold text-sm sm:text-base">
                {dayjs(job.date_to).format('DD MMM YYYY')}
              </h3>
              <span className="text-sm sm:text-base">{job.time.slice(10)}</span>
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
          <button onClick={() => setDeclineAlert(true)} className="px-6 py-1 bg-rose-500 text-white uppercase rounded shadow-lg hover:bg-rose-400">
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
        <button onClick={() => setDeclineAlert(true)} className="px-6 py-1 my-4 lg:my-0 bg-rose-500 text-white uppercase rounded shadow-lg hover:bg-rose-400">
          Decline
        </button>
      </div>
      <div>
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
      </div>
    </div>
  )
}

export default JobCard
