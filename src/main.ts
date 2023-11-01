import express, { Express, Response } from 'express';
import { initCronJob } from './oci';
import { config } from 'dotenv';
config();

initCronJob();

const app: Express = express();
const port = process.env.PORT || 3000;

app.all('/*', (_, res: Response) => {
  res.send('Healthy.');
});

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

export const ociApp = app;
