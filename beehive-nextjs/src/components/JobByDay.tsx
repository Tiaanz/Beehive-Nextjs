import { Job } from '@/model'
import dayjs, { Dayjs } from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'

interface JobByDayProps {
  job: Job
  selectedDate: Dayjs | null
}

const JobByDay: FC<JobByDayProps> = ({ job, selectedDate }) => {
  return (
    <ul
      key={job.id}
      className="flex flex-col space-y-2 border-2 p-4 h-fit border-amber-400 rounded-md sm:mr-4 mb-4"
    >
      <li className="font-bold hover:underline">
        <Link href={`/profile/centre-profile/${job.center.ECE_id}`}>
          {job.center.name}
        </Link>
      </li>
      <li className="font-bold">{dayjs(selectedDate).format('DD MMM YYYY')}</li>
      <li>Time: {job.time}</li>
      <li className="text-sm text-slate-600">
        {' '}
        {job.qualified ? 'Qualified' : 'Qualified, Unqualified'}
      </li>
      <li>
        Status:{' '}
        <span
          style={{
            color:
              job.status === 'OPEN'
                ? 'orange'
                : job.status === 'FUFILLED'
                ? 'green'
                : 'red',
          }}
        >
          {job.status === 'OPEN'
            ? 'Awaiting center confirmation'
            : job.status === 'FUFILLED'
            ? 'CONFIRMED'
            : 'CANCELLED'}
        </span>
      </li>
      <li className="self-end text-amber-600 underline">
        <Link href={`/job-info/${job.id}`}>Detail...</Link>
      </li>
    </ul>
  )
}

export default JobByDay
