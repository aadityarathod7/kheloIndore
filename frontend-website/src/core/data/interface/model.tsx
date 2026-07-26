export interface breadcrumbs {
  maintitle: ReactNode;
  title: string;
  subtitle: string;
}

export interface allCourt {
  court: ReactNode;
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  img: string;
}
export interface coachRequests {
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  img: string;
  date: string;
  time: string;
}
export interface activeCourts {
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  img: string;
  date: string;
  time: string;
}
export interface coachWallets {
  refID: string;
  transactionFor: string;
  date: string;
  time: string;
  payment: string;
  status: string;
  img: string;
}
export interface coachEarning {
  courtName: string;
  courtNo: string;
  bookingDate: string;
  playerName: string;
  dateTime: string;
  Payment: string;
  additionalGuests: string;
  paidOn: string;
  Download: string;
}
export interface inactiveCourts {
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  img: string;
}
export interface userCoaches {
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  img: string;
  text: string;
}
export interface userComplete {
  bookingDate: string;
  coachName: string;
  courtName: string;
  courtNo: string;
  date: string;
  time: string;
  payment: string;
  details: string;
  status: string;
  img: string;
}
export interface userInvoice {
  id: string;
  courtName: string;
  courtNo: string;
  date: string;
  time: string;
  payment: string;
  paidOn: string;
  status: string;
  download: string;
  img: string;
}
export interface userOngoing {
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  court: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  image: string;
  content: string;
  date: string;
  time: string;
  bookingtype: string;
  coachName: string;
  image2: string;
  bookeddata: string;
}
export interface userCancelledInterface {
  courtName: string;
  courtNo: string;
  location: string;
  amount: string;
  court: string;
  maxGuest: string;
  additionalGuests: string;
  addedOn: string;
  details: string;
  status: string;
  image: string;
  content: string;
  date: string;
  time: string;
  bookingtype: string;
  coachName: string;
  image2: string;
  bookeddata: string;
}
