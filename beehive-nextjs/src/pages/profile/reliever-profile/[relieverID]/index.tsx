import Meta from '@/components/Meta'
import Paragraph from '@/components/ui/Paragraph'
import { GET_RELIEVER_BY_ID } from '@/GraphQL_API'
import { useQuery } from '@apollo/client'
import { Avatar, Box, LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'

const index = () => {
  const router = useRouter()

  const id = router.query.relieverID

  const { data, loading, error } = useQuery(GET_RELIEVER_BY_ID, {
    variables: { relieverId: id },
  })

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />
      {loading && (
        <Box className="mx-auto w-1/2 pt-80">
          <LinearProgress />
        </Box>
      )}
      {data ? (
        <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">
          <div className="basis-1/3 flex flex-col items-center">
            <Avatar
              alt="profile photo"
              src={
                data?.getRelieverById?.photo_url
                  ? data?.getRelieverById?.photo_url
                  : '/default_avatar.jpeg'
              }
              sx={{ width: 120, height: 120 }}
            />
            <p className="text-sm md:text-base">
              {data?.getRelieverById?.email}
            </p>
            <p className="text-sm md:text-base">
              {data?.getRelieverById?.phone}
            </p>
            <p className="text-sm md:text-base font-bold">
              {data?.getRelieverById?.qualified ? 'Qualified' : 'Unqualified'}
            </p>
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
                  {data?.getRelieverById?.bio
                    ? data?.getRelieverById?.bio
                    : 'No description'}
                </Paragraph>
              </div>
            )}
          </div>
        </div>
      ) : !loading && (
        <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
          Page not found!
        </h1>
      )}
    </>
  )
}

export default index
