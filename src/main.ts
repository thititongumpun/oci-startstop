import express, { Express, Response } from 'express';
import { initCronJob } from './oci';

initCronJob();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (_, res: Response) => {
  res.send('Healthy.');
});

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
