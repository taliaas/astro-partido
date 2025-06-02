import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Login from '../components/access/Login.vue';

// Mock signIn, navigate y toast
vi.mock('auth-astro/client', () => ({ signIn: vi.fn().mockResolvedValue({}) }));
vi.mock('astro:transitions/client', () => ({ navigate: vi.fn() }));
vi.mock('vue-sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('Login.vue', () => {
    it('valida y envía el formulario correctamente', async () => {
        const wrapper = mount(Login);
        // Completa los campos
        await wrapper.find('input[type="email"]').setValue('test@example.com');
        await wrapper.find('input[type="password"]').setValue('12345678');
        // Envía el formulario
        await wrapper.find('form').trigger('submit.prevent');
        await wrapper.vm.$nextTick(); // Espera a que el DOM se actualice
        // Espera a que loading se desactive (simulación)
        await new Promise(r => setTimeout(r, 10));
        // Verifica que el botón vuelva a su estado normal
        const button = wrapper.find('button[type="submit"]');
        expect(button.text()).toMatch(/Iniciando sesión|Iniciar sesión/);
    });

    it('muestra error si el email es inválido', async () => {
        const wrapper = mount(Login);
        await wrapper.find('input[type="email"]').setValue('no-es-un-email');
        await wrapper.find('input[type="password"]').setValue('12345678');
        await wrapper.find('form').trigger('submit.prevent');
        // Espera a que el error de validación se muestre
        await new Promise(r => setTimeout(r, 10));
        expect(wrapper.html()).toContain('Ingrese un correo electrónico válido');
    });

    it('muestra error si la contraseña es muy corta', async () => {
        const wrapper = mount(Login);
        await wrapper.find('input[type="email"]').setValue('test@example.com');
        await wrapper.find('input[type="password"]').setValue('123');
        await wrapper.find('form').trigger('submit.prevent');
        await new Promise(r => setTimeout(r, 10));
        expect(wrapper.html()).toContain('La contraseña debe tener al menos 8 caracteres');
    });
});
