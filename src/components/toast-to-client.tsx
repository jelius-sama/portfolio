import { redirect } from "next/navigation";

export enum ServerMessageStatus {
  success = 'success',
  error = 'error',
  info = 'info'
}

export type ServerMessage = {
  msg: string;
  status: ServerMessageStatus;
};

export function toastToClient({ path, serverMessage, status }: { status: ServerMessage['status']; path?: string; serverMessage: ServerMessage['msg']; },): never {

  return path ? redirect(`${path}?serverMessage=${serverMessage}&status=${status}`) : redirect(`?serverMessage=${serverMessage}&status=${status}`);
}
