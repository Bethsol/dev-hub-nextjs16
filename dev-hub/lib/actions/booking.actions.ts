'use server';

import Booking from '../../database/booking.model'

import connectDB from "../mongodb";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; ElementInternals: string; }) => {
    try {
        await connectDB();
        await Booking.create({ eventId, slug, email });

        return { success: true};
    } catch (e) {
        console.error('create booking failed', e);
        return { sucess: false };
    }
}