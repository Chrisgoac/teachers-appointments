import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { prisma } from '@/utils/db'
import { r2 } from '@/lib/r2'

export async function POST(request: Request) {
    try {
        const formData = await request.formData(); // Parse the form data
        const file = formData.get('file') as File; // Get the file from the form data
        const fileName = file.name

        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName, // Use the extracted file name
            }),
            { expiresIn: 60 }
        );

        await prisma.file.create({
            data: {
                name: fileName,
                url: signedUrl
            },
        });

        return NextResponse.json({ url: signedUrl, success: true });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.toString() : JSON.stringify(err);
        return NextResponse.json({ success: false, error: errorMessage });
    }
}
