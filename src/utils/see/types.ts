import type { Status } from "@/enum/Status"

export type MessageMapper = {
	'minute.status': { id: string, status: Status }
}
