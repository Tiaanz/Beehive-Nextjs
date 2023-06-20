

export interface Reliever {
  id: string
  first_name: string
  last_name: string
  email: string
  qualified: boolean
}


export interface Job {
  center: {
    name: string
    address: string
    ECE_id: number
  }
  id: string
  center_id:number
  qualified: boolean
  date_from: string
  date_to: string
  time: string
  status: string
  relieverIDs: string[]
  declined_relieverIDs: string[]
  relievers: Reliever[]
}


