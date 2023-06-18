export function convertDate(date:string) {
 
  if (date) {
    const year = date.slice(0,4)
    const month = date.slice(5, 7)
    const day = date.slice(8)
    return day + '-' + month + '-' + year
  }
 


}


