import Notification from "../models/Notification.js";

export const createNotification = async ({
  message,
  type,
  complaint,
  user,
}) => {
  await Notification.create({
    message,
    type,
    complaint,
    user,
  });
};