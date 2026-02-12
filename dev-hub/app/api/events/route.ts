import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';

// 1. Safe Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    // 'body' contains all your text fields (slug, description, etc.)
    const body = Object.fromEntries(formData.entries()) as any;

    // 2. Extract the file
    const file = formData.get('image') as File;
    
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'Valid image file is required' }, { status: 400 });
    }

    // 3. Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'DEVHUB' },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // 5. Safe JSON Parsing for arrays
    // We parse them once here to ensure they are clean arrays for Mongoose
    let tagsArray = [];
    let agendaArray = [];
    try {
      tagsArray = JSON.parse(body.tags || '[]');
      agendaArray = JSON.parse(body.agenda || '[]');
    } catch (parseError) {
      console.error("JSON Parse Error for arrays:", parseError);
    }

    // 6. FIX: Use 'body' instead of 'event'
    const createdEvent = await Event.create({
      ...body,               // Spreads slug, description, location, etc.
      image: uploadResult.secure_url,
      tags: tagsArray,       // Overwrites the string version with the parsed array
      agenda: agendaArray,   // Overwrites the string version with the parsed array
    });

    return NextResponse.json({ message: "Success", event: createdEvent }, { status: 201 });

  } catch (error: any) {
    console.error("Full API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Event fetched successfully', events }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: 'Event fetching failed', error: e.message }, { status: 500 });
    }
}