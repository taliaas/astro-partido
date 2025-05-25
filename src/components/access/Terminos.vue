<template>
  <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="rounded-2xl bg-white p-8 shadow-sm">
      <div class="mb-8">
        <div class="text-sm font-medium uppercase tracking-wide text-gray-500">
          ACUERDO
        </div>
        <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Términos de Servicio
        </h1>
      </div>

      <div class="space-y-6 text-gray-600">
        <p>
          Sabemos que es tentador omitir estos Términos de Servicio, pero es importante establecer qué puede esperar de
          nosotros mientras utiliza los servicios de Motor, y qué esperamos de usted.
        </p>

        <p>
          Estos Términos de Servicio reflejan la forma en que funciona nuestro sistema de gestión documental, las leyes
          que se aplican a nuestra organización y ciertos aspectos que siempre hemos considerado verdaderos. Como
          resultado, estos Términos de Servicio ayudan a definir la relación de Motor con usted mientras interactúa con
          nuestros servicios.
        </p>

        <div class="space-y-4 rounded-xl bg-gray-50 p-6">
          <h2 class="text-lg font-semibold text-gray-900">
            Aspectos principales que cubren estos términos:
          </h2>
          <ul class="space-y-3">
            <li class="flex items-start">
              <div class="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <CheckIcon class="h-4 w-4 text-blue-600" />
              </div>
              <span>Qué puede esperar de nosotros, que describe cómo proporcionamos y desarrollamos nuestros
                servicios</span>
            </li>
            <li class="flex items-start">
              <div class="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <CheckIcon class="h-4 w-4 text-blue-600" />
              </div>
              <span>Qué esperamos de usted, que establece ciertas reglas para utilizar nuestros servicios</span>
            </li>
            <li class="flex items-start">
              <div class="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <CheckIcon class="h-4 w-4 text-blue-600" />
              </div>
              <span>Contenido en los servicios de Motor, que describe los derechos de propiedad intelectual del
                contenido que encuentra en nuestros servicios</span>
            </li>
            <li class="flex items-start">
              <div class="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <CheckIcon class="h-4 w-4 text-blue-600" />
              </div>
              <span>En caso de problemas o desacuerdos, que describe otros derechos legales que tiene y qué esperar en
                caso de que alguien viole estos términos</span>
            </li>
          </ul>
        </div>

        <p class="font-medium">
          Entender estos términos es importante porque, para usar nuestros servicios, debe aceptar estos términos.
        </p>

        <p>
          Además de estos términos, también publicamos una Política de Privacidad. Aunque no forma parte de estos
          términos, le recomendamos que la lea para comprender mejor cómo puede actualizar, gestionar, exportar y
          eliminar su información.
        </p>

        <div class="flex items-center justify-between space-x-4 border-t pt-6">
          <Button variant="secondary" as-child>
            <a href="/register">Ahora no...</a>
          </Button>
          <Button as-child>
            <a href="/register?acceptTerms=true">Acepto los términos</a>
          </Button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-vue-next'
</script>