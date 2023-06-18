import { Job } from '@/model'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'
import Button from './ui/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { UPDATE_POST,UPDATE_NOT_AVAILABLE_DATE } from '@/GraphQL_API'
import { useMutation } from '@apollo/client'
import { toast } from './ui/Toast'

interface PostByDayProps {
  post: Job
  fetchPosts: () => Promise<void>
}

const PostByDay: FC<PostByDayProps> = ({ post, fetchPosts }) => {
  const [cancelPost, setCancelPost] = useState(false)
  const [updatePost] = useMutation(UPDATE_POST)
  

  async function handleCancel() {
  await updatePost({
      variables: {
        postId: post.id,
        status: 'CANCELLED',
      },
   })
 
    
    toast({
      title: 'Success',
      message: 'You have cancelled the post.',
      type: 'success',
    })

    setCancelPost(false)
    await fetchPosts()
  }

  return (
    <ul
      key={post.id}
      className="flex:1 flex flex-col space-y-2 border-2 p-4 border-amber-400 rounded-md sm:mr-4 mb-4 "
    >
      <li>Time: {post.time}</li>
      <li className="text-sm text-slate-600">
        {' '}
        {post.qualified ? 'Qualified' : 'Qualified, Unqualified'}
      </li>
      <li>
        Status:{' '}
        <span
          style={{
            color:
              post.status === 'OPEN' ? 'green' : 'FUFILLED' ? 'orange' : 'red',
          }}
        >
          {post.status}
        </span>
      </li>
      {post.status === 'FUFILLED' && (
        <li className="hover:underline mt-2">
            <Link href={`/profile/reliever-profile/${post.relievers[0].id}`}>
            Reliever: {post.relievers[0].first_name}{' '}
            {post.relievers[0].last_name} (
            {post.relievers[0].qualified ? 'Qualified' : 'Unqualified'})
        </Link>
          </li>
      )}
      {post.status !== 'CANCELLED' && post.status !== 'OPEN' ? (
        <li className="self-end text-2xl text-orange-500 hover:text-orange-400 hover:cursor-pointer">
          <Link href={`/my-posts/edit-post/${post.id}`}>
            <FiEdit />
          </Link>
        </li>
      ) : (
        post.status === 'OPEN' && (
          <li>
            <Button
              size="sm"
              variant="subtle"
              className="mt-2 w-14"
              onClick={() => setCancelPost(true)}
            >
              Cancel
            </Button>
          </li>
        )
      )}
      <div>
        <Dialog
          open={cancelPost}
          onClose={() => setCancelPost(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Are you sure you want to cancel this job ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setCancelPost(false)}>No</Button>
            <Button onClick={handleCancel} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ul>
  )
}

export default PostByDay
