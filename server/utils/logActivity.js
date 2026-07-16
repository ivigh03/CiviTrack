export const logActivity = (complaint, { action, performedBy = null }) => {
  complaint.activityLog.push({
    action,
    performedBy,
    timestamp: new Date(),
  });
};
