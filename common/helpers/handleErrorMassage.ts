import { HttpStatus } from "common/enums/httpStatus.enum"
import { NotificationError } from "common/enums/notificationError.enum"

export const getErrorMassage = (status: string) => {
    return NotificationError[HttpStatus[status]]
}