import { FC, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { ACCEPT_JOB, GET_JOB, UPDATE_RELIEVERIDS } from '@/GraphQL_API'
import { useMutation } from '@apollo/client'
import { Reliever } from '@/model'

interface RelieverCardProps {
  reliever: Reliever
  jobId: string
}

const RelieverCard: FC<RelieverCardProps> = ({ reliever, jobId }) => {
  const [acceptAlert, setAcceptAlert] = useState(false)

  const [acceptJob] = useMutation(ACCEPT_JOB)
  const [getJob] = useMutation(GET_JOB)
  const [updateRelieverIDs] = useMutation(UPDATE_RELIEVERIDS)

  async function handleAccept() {
    //change status to "FUFILLED" and make the relieverIDs array contains only this reliever's ID
    await acceptJob({
      variables: {
        relieverId: reliever.id,
        acceptJobId: jobId,
      },
    })

    //set not available dates for the reliever
    await getJob({
      variables: {
        getJobId: reliever.id,
        jobId,
      },
    })

    //remove the reliever from other jobs' relieverIDs array
    await updateRelieverIDs({
      variables: {
        relieverId: reliever.id,
        jobId,
      },
    })

    setAcceptAlert(false)
  }

  return (
    <>
      <div className="flex ml-6 sm:items-center justify-between sm:flex-row flex-col">
        <div className="flex mt-2 ">
          <Link
            className="sm:text-lg hover:underline"
            href={`/profile/reliever-profile/${reliever.id}`}
          >
            {reliever.first_name} {reliever.last_name}
          </Link>
          <span className="font-bold ml-1 sm:text-lg">
            {' '}
            ({reliever.qualified ? 'Qualified' : 'Unqualified'})
          </span>
        </div>
        <div>
          <button
            onClick={() => setAcceptAlert(true)}
            className="px-6 py-1 my-2 bg-green-500 text-white uppercase rounded shadow-lg hover:bg-green-400"
          >
            Accept
          </button>
        </div>
      </div>
      <div>
        <Dialog
          open={acceptAlert}
          onClose={() => setAcceptAlert(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure you want to accpet ${reliever.first_name} ${reliever.last_name}'s application ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setAcceptAlert(false)}>No</Button>
            <Button onClick={handleAccept} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default RelieverCard
