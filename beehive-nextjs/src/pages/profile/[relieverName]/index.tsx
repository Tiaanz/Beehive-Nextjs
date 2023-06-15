import Meta from '@/components/Meta'
import Paragraph from '@/components/ui/Paragraph'
import { GET_RELIEVER } from '@/GraphQL_API'
import { useQuery } from '@apollo/client'
import { Avatar, Box, LinearProgress } from '@mui/material'
import { FC } from 'react'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  const { data, loading, error } = useQuery(GET_RELIEVER, {
    variables: { email: 'tian@beehive.com' },
  })

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">
        <div className="basis-1/3 flex flex-col items-center">
          <Avatar
            alt="profile photo"
            src={
              data?.getOneReliever?.photo_url
                ? data?.getOneReliever?.photo_url
                : '/default_avatar.jpeg'
            }
            sx={{ width: 120, height: 120 }}
          />
          <p className="text-sm md:text-base">jwtian126@gmail.com</p>
          <p className="text-sm md:text-base">0212167907</p>
          <p className="text-sm md:text-base font-bold">{data?.getOneReliever?.qualified ? 'Qualified' : 'Unqualified'}</p>
        </div>
        <div className="basis-2/3 flex flex-col md:justify-start md:items-start items-center">
          <h3 className="md:my-4 my-2 font-bold md:text-lg text-sm">
            Biography
          </h3>
          {loading ? (
            <Box className="lg:w-2/3 md:w-3/4 w-full h-72 flex flex-col justify-center">
              <LinearProgress />
            </Box>
          ) : (
            <div className="w-full my-2 lg:w-4/5  border-2 border-slate-300 rounded-lg p-6 flex md:h-72 h-44">
              <Paragraph size="sm" className="overflow-y-scroll text-left ">
                {data?.getOneReliever?.bio}
              </Paragraph>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default index
