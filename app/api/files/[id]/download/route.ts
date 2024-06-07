import { GetObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/r2'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = params;
	try {
		console.log(`Retrieving pdf from R2!`)

        if (!id) {
            throw new Error('No filename provided.');
        }

		const pdf = await r2.send(
			new GetObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: id,
			})
		)

		if (!pdf) {
			throw new Error('pdf not found.')
		}

		return new Response(pdf.Body?.transformToWebStream(), {
			headers: {
				'Content-Type': 'application/pdf',
			},
		})
	} catch (err) {
		console.log('error', err)
	}
}