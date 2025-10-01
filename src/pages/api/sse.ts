
import type { APIRoute } from "astro";
import { API_URL } from "astro:env/client";

export const GET: APIRoute = async (ctx) => {
    
    try {
        const response = await fetch(API_URL + "/sse", {
            headers: ctx.request.headers
        });

        // Crear un stream que ignore errores de cancelación
        const safeStream = new ReadableStream({
            start(controller) {
                const reader = response.body?.getReader();

                if (!reader) {
                    controller.close();
                    return;
                }

                const isControllerClosed = () => {
                    // Intentar acceder a propiedades internas (puede no ser confiable)
                    try {
                        controller.enqueue(new Uint8Array());
                        return false;
                    } catch (e) {
                        return true;
                    }
                };

                async function read() {
                    try {
                        const { done, value } = await reader!.read();
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        read();
                    } catch (error) {
                        // Ignorar errores de stream interrumpido
                        if (!isControllerClosed()) {
                            controller.close();
                        }

                    }
                }

                read();

                // Limpiar cuando el cliente se desconecte
                ctx.request.signal.addEventListener('abort', () => {
                    reader.cancel().catch(() => { });

                    if (!isControllerClosed()) {
                        controller.close();
                    }
                });
            }
        });

        return new Response(safeStream, {
            status: response.status,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        // Retornar un stream vacío para errores de conexión
        return new Response(
            new ReadableStream({
                start(controller) {
                    controller.close();
                }
            }), {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
            }
        }
        );
    }
}