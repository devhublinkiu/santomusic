<x-mail::message>
# Nuevo Mensaje de Contacto

Has recibido un nuevo mensaje desde el formulario de contacto de Santo Music.

**Detalles del remitente:**
* **Nombre:** {{ $data['name'] }}
* **Email:** {{ $data['email'] }}
* **Asunto:** {{ $data['subject'] }}

**Mensaje:**
<x-mail::panel>
{{ $data['message'] }}
</x-mail::panel>

<x-mail::button :url="config('app.url')">
Ir a Santo Music
</x-mail::button>

Gracias,<br>
{{ config('app.name') }}
</x-mail::message>
