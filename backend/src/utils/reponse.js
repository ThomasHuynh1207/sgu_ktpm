export const success = (res, message, data) =>
  res.json({ success: true, message, data });

export const error = (res, message) =>
  res.status(400).json({ success: false, message });
