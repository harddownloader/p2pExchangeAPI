export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 3002,
});
