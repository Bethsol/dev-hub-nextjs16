// models/index.ts

export { default as Event } from './event.model';
export { default as Booking } from './booking.model';

// Also export the interfaces in case you need them for type-checking in other files
export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';