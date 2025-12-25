import express from "express";
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8000

import user from './routes/users.route.js'
import event from './routes/events.route.js'


const app = express();
app.use(express.json());

app.get('/',(req,res) => {
  res.send("hello from test four")
})

app.use('/user',user)
app.use('/creator',event)



app.listen(PORT, () => {
  console.log(`server is ready on port ${PORT}`);
});
