import { FC, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Link from 'next/link'
import {ACCEPT_JOB} from '@/GraphQL_API'
import { useMutation } from '@apollo/client'

interface Reliever {
  first_name: string
  last_name: string
  email: string
  qualified: boolean
  id: string
}


interface RelieverCardProps {
  reliever: Reliever
  jobId:string
}

const RelieverCard: FC<RelieverCardProps> = ({ reliever,jobId}) => {
  

  const [acceptAlert, setAcceptAlert] = useState(false)

  const[acceptJob]=useMutation(ACCEPT_JOB)

  async function handleAccept() {
    await acceptJob({
      variables: {
        relieverId: reliever.id,
        acceptJobId:jobId
        
     }
   })
    setAcceptAlert(false)
  }

  return (
    <div className="flex items-center justify-between" >
      <div className="flex">
        <Link className="text-lg hover:underline" href="">
          {reliever.first_name} {reliever.last_name}
        </Link>
        <span className="font-bold ml-1 text-lg">
          {' '}
          ({reliever.qualified ? 'Qualified' : 'Unqualified'})
        </span>
      </div>

      <button
        onClick={() => setAcceptAlert(true)}
        className="px-6 py-1 my-4 bg-green-500 text-white uppercase rounded shadow-lg hover:bg-green-400"
      >
        Accept
      </button>
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
    </div>
  )
}

export default RelieverCard
