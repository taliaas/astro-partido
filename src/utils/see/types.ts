import type { Status } from "@/enum/Status"

export type MessageMapper = {
	'minute.upload.status': { id: string, status: Status }
}
