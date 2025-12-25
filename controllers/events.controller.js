import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();
const USERS_PATH = path.join(__dirname, "data", "users.json");
const EVENTS_PATH = path.join(__dirname, "data", "events.json");

export const createEvent = async (req, res) => {
  const { eventName, ticketsForSale, username, password } = req.body;
  fs.readFile(USERS_PATH)
    .then((data) => {
      data = JSON.parse(data) || [];
      const userDB = data.find(
        (user) => user.username === username && user.password === password
      );
      if (userDB === undefined) res.status(400).send("User not found");
      else {
        if (userDB.role !== "user") res.send("Only user can create events");
        else {
          fs.readFile(EVENTS_PATH).then((data) => {
            data = JSON.parse(data) || [];
            const event = {
              eventName,
              ticketsAvailable: ticketsForSale,
              createdBy: username,
            };
            data.push(event);
            fs.writeFile(EVENTS_PATH, JSON.stringify(data));
            res.json({ massage: "event saved successfuly" });
          });
        }
      }
    })
    .catch((err) => res.status(400).send("cannnot create event", err));
};
