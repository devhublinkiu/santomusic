import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/Components/ui/input-otp"
import { Button } from '@/Components/ui/button';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, router } from '@inertiajs/react'; // Added router
import { useState, useEffect } from "react";

interface AccessCodeLockProps {
    isVerified: boolean;
    onVerified?: () => void;
}

export default function AccessCodeLock({ isVerified, onVerified }: AccessCodeLockProps) {
    const [isOpen, setIsOpen] = useState(!isVerified);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
    });

    // Update state if prop changes (e.g. from backend)
    useEffect(() => {
        setIsOpen(!isVerified);
    }, [isVerified]);

    // Tab Switch / Blur Lock
    useEffect(() => {
        const handleLock = () => {
            if (!isOpen) {
                setIsOpen(true);
                toast.info("Protección activada por cambio de ventana.");
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleLock();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        // Removed blur event to prevent accidental locking when clicking devtools/address bar

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isOpen]); // Add isOpen dependency to avoid redundant toasts if already locked

    // Clear session when navigating away from this page
    useEffect(() => {
        const handleBeforeNavigate = () => {
            // Use synchronous XMLHttpRequest for guaranteed execution before navigation
            const xhr = new XMLHttpRequest();
            xhr.open('POST', route('gatekeeper.lock'), false); // false = synchronous
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');
            try {
                xhr.send();
            } catch (e) {
                // Ignore errors during navigation
            }
        };

        const removeListener = router.on('before', handleBeforeNavigate);

        return () => {
            removeListener();
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('gatekeeper.verify'), {
            onSuccess: () => {
                setIsOpen(false);
                toast.success('Acceso concedido');
                if (onVerified) onVerified();
            },
            onError: () => {
                toast.error('Código inválido o expirado.');
                reset();
            }
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    router.visit(route('welcome'));
                }
            }}
        >
            <DialogContent
                className="sm:max-w-md bg-zinc-950/90 backdrop-blur-xl border-zinc-800 text-white"
                // Restore blocking interactions to ensure they MUST enter code or leave
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 mb-4">
                        <Lock className="h-6 w-6 text-indigo-400" />
                    </div>
                    <DialogTitle className="text-center text-xl">Acceso Restringido</DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        Introduce el código de acceso proporcionado para ver este contenido.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center mt-4">
                    <InputOTP
                        maxLength={6}
                        value={data.code}
                        onChange={(value) => setData('code', value.toUpperCase())}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-10 h-14 text-lg border-zinc-700 data-[active]:border-indigo-500 text-white" />
                            <InputOTPSlot index={1} className="w-10 h-14 text-lg border-zinc-700 data-[active]:border-indigo-500 text-white" />
                            <InputOTPSlot index={2} className="w-10 h-14 text-lg border-zinc-700 data-[active]:border-indigo-500 text-white" />
                            <InputOTPSlot index={3} className="w-10 h-14 text-lg border-zinc-700 data-[active]:border-indigo-500 text-white" />
                            <InputOTPSlot index={4} className="w-10 h-14 text-lg border-zinc-700 data-[active]:border-indigo-500 text-white" />
                            <InputOTPSlot index={5} className="w-10 h-14 text-lg border-zinc-700 data-[active]:border-indigo-500 text-white" />
                        </InputOTPGroup>
                    </InputOTP>

                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}

                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-6"
                        disabled={processing || data.code.length < 6}
                    >
                        {processing ? <Loader2 className="animate-spin" /> : 'Verificar Código'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
