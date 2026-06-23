import * as tus from 'tus-js-client';

export const MAX_BYTES = 5 * 1024 * 1024 * 1024; // 5GB tope lógico

export interface TusAuth {
    endpoint: string;
    library_id: string;
    video_id: string;
    signature: string;
    expire: number;
}

// Sube un archivo directo a Bunny Stream vía TUS resumable.
export function uploadToBunny(file: File, auth: TusAuth, onProgress: (pct: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
            endpoint: auth.endpoint,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                AuthorizationSignature: auth.signature,
                AuthorizationExpire: String(auth.expire),
                VideoId: auth.video_id,
                LibraryId: auth.library_id,
            },
            metadata: {
                filetype: file.type,
                title: file.name,
            },
            onError: (err) => reject(err),
            onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
            onSuccess: () => resolve(),
        });

        upload.findPreviousUploads().then((previous) => {
            if (previous.length) {
                upload.resumeFromPreviousUpload(previous[0]);
            }
            upload.start();
        });
    });
}
