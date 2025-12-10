import type { MinuteStatus } from "@/enum/Estado";

export type MessageMapper = {
  "minute.status": { id: string; status: MinuteStatus };
};
