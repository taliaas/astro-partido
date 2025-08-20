import type { MessageMapper } from "@/utils/sse-types"
import { inject, onMounted, onUnmounted, provide, ref, type Ref } from "vue"

const EVENT_SOURCE = Symbol("event-soruce")

export function provideSse() {
    const eventSource = ref<EventSource | null>(null)

    onMounted(() => {
        eventSource.value = new EventSource("/api/sse", { withCredentials: true })
    })

    provide(EVENT_SOURCE, eventSource)
    // onUnmounted(() => {
    //     eventSource.value?.close()
    // })
    return eventSource
}

export const useEventSource = (): Ref<EventSource | null> => inject(EVENT_SOURCE, ref(null))

export function useSse<
    Event extends keyof MessageMapper,
    Data = MessageMapper[Event],
>(event: Event, listener: (data: Data) => void) {
    const eventSource = provideSse()

    const middleware = (e: MessageEvent) => {
        let data
        try {
            data = JSON.parse(e.data)
        } catch {
            data = e.data
        }
        listener(data)
    }


    onMounted(() => eventSource.value?.addEventListener(event, middleware))
    // onUnmounted(() => eventSource.value?.removeEventListener(event, middleware))
}