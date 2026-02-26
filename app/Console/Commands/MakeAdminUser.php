<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MakeAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea o actualiza el usuario administrador de Linkiu';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = 'admin@linkiu.bio';
        $password = 'password';

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Admin Linkiu',
                'password' => Hash::make($password),
                'is_admin' => true,
                'email_verified_at' => now(), // Auto-verify so they can login immediately
            ]
        );

        if ($user->wasRecentlyCreated) {
            $this->info("¡Usuario administrador creado exitosamente!");
        } else {
            $this->info("¡Credenciales de administrador actualizadas exitosamente!");
        }
        
        $this->line("Email: {$email}");
        $this->line("Contraseña: {$password}");
    }
}
