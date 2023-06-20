import dayjs, { Dayjs } from 'dayjs'
import Badge from '@mui/material/Badge'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'

interface Post {
  date_from: string
  date_to: string
  relieverIDs: string[]
  status: string
}


export function convertDate(date: string) {
  if (date) {
    const year = date.slice(0, 4)
    const month = date.slice(5, 7)
    const day = date.slice(8)
    return day + '-' + month + '-' + year
  }
}

export function extractDatesFromArray(arr: string | any[]) {
  const dates = []

  for (let i = 0; i < arr?.length; i++) {
    const dateFromObj = dayjs(arr[i].date_from)
    const dateToObj = dayjs(arr[i].date_to)

    let currentDate = dateFromObj
    while (currentDate.isSame(dateToObj) || currentDate.isBefore(dateToObj)) {
      dates.push(currentDate.format('YYYY/MM/DD'))
      currentDate = currentDate.add(1, 'day')
    }
  }

  const dateNumbers = dates.map((date) => date.slice(8))
  const dateNotIncludeZero = dateNumbers.map((date) => {
    if (date.startsWith('0')) {
      return Number(date.slice(1))
    } else {
      return Number(date)
    }
  })
  return dateNotIncludeZero
}

export function formatHighlightedDatesFromArray(arr: Post[]) {
  const dates = []

  for (let i = 0; i < arr?.length; i++) {
    const dateFromObj = dayjs(arr[i].date_from)
    const dateToObj = dayjs(arr[i].date_to)

    let currentDate = dateFromObj
    while (currentDate.isSame(dateToObj) || currentDate.isBefore(dateToObj)) {
      dates.push({
        date: currentDate.format('YYYY/MM/DD'),
        status: arr[i].status,
      })
      currentDate = currentDate.add(1, 'day')
    }
  }

  const dateNumbers = dates.map((dateObj) => {
    return { ...dateObj, date: dateObj.date.slice(8) }
  })

  const dateNotIncludeZero = dateNumbers.map((dateObj) => {
    if (dateObj.date.startsWith('0')) {
      return { ...dateObj, date: Number(dateObj.date.slice(1)) }
    } else {
      return { ...dateObj, date: Number(dateObj.date) }
    }
  })

  const datesWithBadges = dateNotIncludeZero.map((dateObj) => {
    if (dateObj.status === 'OPEN') {
      return { date: dateObj.date, badgeContent: '🟠' }
    } else if (dateObj.status === 'FUFILLED') {
      return { date: dateObj.date, badgeContent: '🟢' }
    } else {
      return {}
    }
  })
  return datesWithBadges as {
    date: number
    badgeContent: React.ReactNode
  }[]
}
