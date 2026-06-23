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
            // Cada subida usa un video nuevo (guid único). Atamos el fingerprint a ese
            // guid para que tus-js-client NO intente resumir una subida vieja con una
            // firma ya vencida (causa típica de "se queda colgado / falla").
            fingerprint: () => Promise.resolve(`bunny-${auth.video_id}`),
            removeFingerprintOnSuccess: true,
            headers: {
                AuthorizationSignature: auth.signature,
                AuthorizationExpire: String(auth.expire),
                VideoId: auth.video_id,
                LibraryId: auth.library_id,
            },
            metadata: {
                filetype: file.type || 'video/mp4',
                title: file.name,
            },
            onError: (err: any) => {
                // Exponemos el error real (status + cuerpo) para poder diagnosticar.
                const status = err?.originalResponse?.getStatus?.();
                const body = err?.originalResponse?.getBody?.();
                const detail = [status ? `HTTP ${status}` : null, body ? String(body).slice(0, 200) : null]
                    .filter(Boolean)
                    .join(' — ');
                reject(new Error(detail ? `Bunny rechazó la subida (${detail})` : (err?.message || 'Fallo la subida a Bunny')));
            },
            onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
            onSuccess: () => resolve(),
        });

        upload.start();
    });
}
