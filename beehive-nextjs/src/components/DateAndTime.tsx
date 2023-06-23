import { FC } from 'react'
import dayjs from 'dayjs'
import { BsArrowRight } from 'react-icons/bs'

interface DateAndTimeProps {
  dateFrom: string
  dateTo: string
  time: string
}

const DateAndTime: FC<DateAndTimeProps> = ({ dateFrom, dateTo, time }) => {
  return (
    <>
      {dateFrom === dateTo ? (
        <div className="flex flex-col items-center mt-2 p-2 shadow-md mb-6 rounded">
          <p> {dayjs(dateFrom).format('dddd').toUpperCase()}</p>
          <p className="font-bold">{dayjs(dateFrom).format('DD MMM YYYY')}</p>
          <p>{time}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center px-4 py-2 shadow-md mb-6 rounded">
          <div className="mr-2">
            <span className="text-sm sm:text-base">
              {dayjs(dateFrom).format('dddd').toUpperCase()}
            </span>
            <h3 className="font-bold text-sm sm:text-base">
              {dayjs(dateFrom).format('DD MMM YYYY')}
            </h3>
            <span className="text-sm sm:text-base">{time.slice(0, 8)}</span>
          </div>
          <BsArrowRight className="font-extrabold" />
          <div className="mx-2">
            <span className="text-sm sm:text-base">
              {dayjs(dateTo).format('dddd').toUpperCase()}
            </span>
            <h3 className="font-bold text-sm sm:text-base">
              {dayjs(dateTo).format('DD MMM YYYY')}
            </h3>
            <span className="text-sm sm:text-base">{time.slice(10)}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default DateAndTime
