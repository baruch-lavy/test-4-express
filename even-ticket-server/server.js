import express from "express";
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT

import targets from './routes/targets.route.js'

const app = express();
app.use(express.json());

app.use('/targets',targets)



app.listen(PORT, () => {
  console.log(`server is ready on port ${PORT}`);
});
