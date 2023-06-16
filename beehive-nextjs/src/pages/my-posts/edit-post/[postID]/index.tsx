import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Meta from '@/components/Meta'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { UPDATE_POST, GET_JOB_BY_ID } from '@/GraphQL_API'
import { useMutation, useQuery } from '@apollo/client'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import MenuItem from '@mui/material/MenuItem'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from '@/components/ui/Toast'
import { useRouter } from 'next/router'
import { convertDate } from '@/helper'
import LargeHeading from '@/components/ui/LargeHeading'
import { LinearProgress } from '@mui/material'

const theme = createTheme()

const index = () => {
  const router = useRouter()
  const id = router.query.postID

  const { data: postData, loading } = useQuery(GET_JOB_BY_ID, {
    variables: { jobId: id },
  })

  const [updatePost] = useMutation(UPDATE_POST)

  const [validationError, setValidationError] = React.useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (
      !dateFrom ||
      !dateTo ||
      !timeFrom ||
      !timeTo ||
      dateFrom?.format('DD/MM/YYYY') === 'Invalid Date' ||
      dateTo?.format('DD/MM/YYYY') === 'Invalid Date' ||
      timeFrom?.format('hh:mm A') === 'Invalid Date' ||
      timeTo?.format('hh:mm A') === 'Invalid Date' ||
      dateFrom.isBefore(dayjs(), 'day') ||
      dateFrom.isAfter(dateTo)
    ) {
      setValidationError(
        'Please complete all the fields and ensure they are valid input.'
      )
    } else {
      // console.log(Number(data.get('centerId')))
      // console.log(dateFrom?.format('DD/MM/YYYY'))
      // console.log(dateTo?.format('DD/MM/YYYY'))
      // console.log(
      //   timeFrom?.format('hh:mm A') + ' - ' + timeTo?.format('hh:mm A')
      // )
      // console.log(data.get('qualified') === 'Yes')
      // console.log(data.get('status'))

      updatePost({
        variables: {
          postId: postData?.getJobById?.id,
          dateFrom: dateFrom?.format('DD/MM/YYYY'),
          dateTo: dateTo?.format('DD/MM/YYYY'),
          time: timeFrom?.format('hh:mm A') + ' - ' + timeTo?.format('hh:mm A'),
          qualified: data.get('qualified') === 'Yes',
          status: data.get('status'),
        },
      })

      toast({
        title: 'Success',
        message: 'You have updated the post.',
        type: 'success',
      })

      setTimeout(() => {
        router.push('/my-posts')
      }, 1000)
    }
  }

  const minDate = dayjs()
  const minTime = dayjs('2022-04-17T07:00')
  const maxTime = dayjs('2022-04-17T19:00')

  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(
    dayjs(convertDate(postData?.getJobById?.date_from))
  )
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(
    dayjs(convertDate(postData?.getJobById?.date_to))
  )
  const [timeFrom, setTimeFrom] = React.useState<Dayjs | null>(null)

  const [timeTo, setTimeTo] = React.useState<Dayjs | null>(null)

  React.useEffect(() => {
    if (postData) {
      setTimeFrom(dayjs(postData?.getJobById?.time?.slice(0, 8), 'hh:mm A'))
      setTimeTo(dayjs(postData?.getJobById?.time?.slice(10), 'hh:mm A'))
    }
  }, [postData])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <Meta title="Early childhood Relief teachers | Beehive" />
        {loading && (
          <Box className="mx-auto w-1/2 pt-80">
            <LinearProgress />
          </Box>
        )}

        {postData ? (
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" className="pt-20">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ mt: 4 }}
                  className="flex flex-col items-center w-full space-y-4"
                >
                  <h1 className="text-xl">Edit a post</h1>{' '}
                  <TextField
                    margin="normal"
                    value={postData?.getJobById?.center?.ECE_id || ''}
                    required
                    fullWidth
                    id="centerId"
                    aria-readonly
                    name="centerId"
                    autoFocus
                    variant="outlined"
                  />
                  <DatePicker
                    className="w-full"
                    label="Start date"
                    format="DD/MM/YYYY"
                    maxDate={dateTo}
                    minDate={minDate}
                    value={dateFrom}
                    onChange={(newValue) => {
                      setDateFrom(newValue), setValidationError('')
                    }}
                  />
                  <DatePicker
                    className="w-full"
                    label="End date"
                    format="DD/MM/YYYY"
                    minDate={dateFrom}
                    value={dateTo}
                    onChange={(newValue) => {
                      setDateTo(newValue), setValidationError('')
                    }}
                  />
                  <TimePicker
                    label="Start time"
                    className="w-full"
                    value={timeFrom}
                    minTime={minTime}
                    maxTime={maxTime}
                    onChange={(newValue) => {
                      setTimeFrom(newValue), setValidationError('')
                    }}
                  />
                  <TimePicker
                    label="Finish time"
                    className="w-full"
                    minTime={timeFrom}
                    maxTime={maxTime}
                    value={timeTo}
                    onChange={(newValue) => {
                      setTimeTo(newValue), setValidationError('')
                    }}
                  />
                  {postData && (
                    <>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="qualified"
                        label="Qualified"
                        name="qualified"
                        select
                        variant="outlined"
                        defaultValue={
                          postData?.getJobById?.qualified ? 'Yes' : 'No'
                        }
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </TextField>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="status"
                        label="Status"
                        name="status"
                        select
                        variant="outlined"
                        defaultValue={postData?.getJobById?.status}
                      >
                        <MenuItem value="OPEN">OPEN</MenuItem>
                        <MenuItem value="FUFILLED">FUFILLED</MenuItem>
                        <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                      </TextField>
                    </>
                  )}
                  <p className="text-red-500">{validationError}</p>
                  <button
                    className="bg-amber-500 hover:bg-amber-400 w-11/12 mx-2 mt-6 p-2 rounded text-white"
                    type="submit"
                  >
                    Submit
                  </button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        ) : (
          !loading && (
            <h1 className="text-xl w-11/12 md:pt-20 pt-10 mt-12 md:w-4/5 mx-auto">
              Page not found!
            </h1>
          )
        )}
      </>
    </LocalizationProvider>
  )
}

export default index
