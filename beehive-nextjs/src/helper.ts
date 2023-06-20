import dayjs from "dayjs"

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

  const dateNumbers = dates.map(date => date.slice(8))
  const dateNotIncludeZero = dateNumbers.map(date => {
    if (date.startsWith('0')) {
      return Number(date.slice(1))
    } else {
      return Number(date)
    }
  })
  return dateNotIncludeZero
}


