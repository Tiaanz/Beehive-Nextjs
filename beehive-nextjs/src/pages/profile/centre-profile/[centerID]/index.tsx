import Paragraph from '@/components/ui/Paragraph'
import Avatar from '@mui/material/Avatar'
import Meta from '@/components/Meta'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import { useQuery } from '@apollo/client'
import { GET_CENTER } from '@/GraphQL_API'
import { useRouter } from 'next/router'

const page = () => {
  const router = useRouter()

  const id = router.query.centerID

  const {
    data: centerData,
    loading,
    error,
  } = useQuery(GET_CENTER, {
    variables: { ECE_id: Number(id) },
  })

  return (
    <>
      <Meta title="Early childhood Relief teachers | Beehive" />

      <div className="w-11/12 md:pt-20 pt-10 flex mt-12 md:w-4/5 mx-auto items-center md:justify-start flex-col md:flex-row">
        <div className="basis-1/3 flex flex-col items-center">
          <Avatar
            alt="profile photo"
            src={
              centerData?.getOneCenter?.photo_url
                ? centerData?.getOneCenter?.photo_url
                : '/centre_avatar.jpeg'
            }
            sx={{ width: 120, height: 120 }}
          />
          <p className="text-sm md:text-lg font-bold">
            {centerData?.getOneCenter?.name}
          </p>
          <p className="text-sm md:text-base italic">
            {centerData?.getOneCenter?.address}
          </p>
        </div>
        <div className="basis-2/3 flex flex-col md:justify-start md:items-start items-center">
          <h3 className="md:my-4 my-2 font-bold md:text-lg text-sm">
            Description
          </h3>
          {loading ? (
            <Box className="lg:w-2/3 md:w-3/4 w-full h-72 flex flex-col justify-center">
              <LinearProgress />
            </Box>
          ) : (
            <div className="w-full my-2 lg:w-4/5  border-2 border-slate-300 rounded-lg p-6 flex md:h-72 h-44">
              <Paragraph size="sm" className="overflow-y-scroll text-left ">
                {centerData?.getOneCenter?.description
                  ? centerData?.getOneCenter?.description
                  : 'No description'}
              </Paragraph>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default page
