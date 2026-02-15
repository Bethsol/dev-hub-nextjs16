'use server'

import { Schema, model, models, Document, Types } from 'mongoose';
import Event from '@/database/event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Please provide a valid email address',
      },
    },
  },
  { timestamps: true }
);

BookingSchema.pre('save', async function () {
  const booking = this as IBooking;
  if (booking.isModified('eventId') || booking.isNew) {
    const eventExists = await Event.findById(booking.eventId).select('_id');
    if (!eventExists) throw new Error(`Event with ID ${booking.eventId} does not exist`);
  }
});

BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

// Export the model as default
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);
export default Booking;