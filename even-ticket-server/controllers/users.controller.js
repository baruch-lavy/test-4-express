import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();
const USERS_PATH =
  process.env.USERS_PATH || path.join(__dirname, "data", "users.json");
const EVENTS_PATH =
  process.env.EVENTS_PATH || path.join(__dirname, "data", "events.json");
const RECEIPTS_PATH = path.join(__dirname, "data", "receipts.json");

export const health = (req, res) => {
  res.json({ res: "hello worls" });
};

export const createUser = async (req, res) => {
  const { username, password } = req.body;
  const user = { username, password };
  fs.readFile(USERS_PATH)
    .then((data) => {
      data = JSON.parse(data) || [];
      const userDB = data.find((user) => user.username === username);
      if (userDB != undefined) res.status(400).send("User Already Exists");
      else {
        data.push(user);
        fs.writeFile(USERS_PATH, JSON.stringify(data));
        res.json({ massage: "user saved successfuly" });
      }
    })
    .catch((err) => res.status(400).send("cannnot register user", err));
};

export const buyTickets = async (req, res) => {
  const { username, password, eventName, quantity } = req.body;
  fs.readFile(USERS_PATH)
    .then((data) => {
      data = JSON.parse(data) || [];
      const userDB = data.find(
        (user) => user.username === username && user.password === password
      );
      console.log(userDB);
      if (userDB === undefined) res.status(400).send("User Not Found");
      else {
        fs.readFile(EVENTS_PATH).then((data) => {
          data = JSON.parse(data);
          const event = data.find(
            (ev) => ev.eventName.toLowerCase() === eventName.toLowerCase()
          );
          if (event === undefined) res.status(404).send("event not found");
          else {
            if (event.ticketsAvailible - quantity < 0)
              res.status(400).send("Not Enough Tickets");
            else {
              const receipt = { username, eventName, ticketsBought: quantity };
              fs.readFile(RECEIPTS_PATH).then((data) => {
                data = JSON.parse(data);
                data.push(receipt);
                fs.writeFile(RECEIPTS_PATH, JSON.stringify(data));
                fs.readFile(EVENTS_PATH).then((data) => {
                  data = JSON.parse(data);
                  const idx = data.findIndex(
                    (ev) => ev.eventName === eventName
                  );
                  data[idx].ticketsAvailible -= quantity;
                  fs.writeFile(EVENTS_PATH, JSON.stringify(data));
                });
                res.json({ message: "Your Order Has Recievd" });
              });
            }
          }
        });
      }
    })
    .catch((err) => res.status(400).send("cannnot register user", err));
};

export const userSammary = (req, res) => {
  const { username } = req.params;
  fs.readFile(USERS_PATH)
  .then((data) => {
    data = JSON.parse(data);
    console.log(data);
      const user = data.find((user) => user.username === username);
      console.log(user);
      if (user === undefined) res.status(404).send("User Not Found");
      else {
        fs.readFile(RECEIPTS_PATH).then((data) => {
          data = JSON.parse(data);
          const events = data.filter(
            (receipt) => receipt.username === username
          );
          if (!events.length) res.send("the user didnt parachase any event");
          else {
            console.log(events);
            const sum = events.reduce((acc, ev) => {
              return acc + ev.ticketsBought;
            }, 0);
            const avgTickets = sum / events.length;
            const eventsNames = [];
            events.forEach((ev) => {
              if (!eventsNames.includes(ev.eventName))
                eventsNames.push(ev.eventName);
            });
            const sammary = {
              totalTicketsBought: sum,
              events:eventsNames,
              averageTicketsPerEvent: avgTickets,
            };
            res.json({massage:sammary})
          }
        });
      }
    })
    .catch((err) => res.status(404).send(err));
};

export const targets = (req, res) => {
  const { region, status, minPriority } = req.query;
  fs.readFile("./data/targets.json")
    .then((data) => {
      data = JSON.parse(data);
      const targets = data.targets.filter((target) => {
        if (
          target.region === region &&
          target.status === status &&
          target.priority >= +minPriority
        )
          return target;
      });
      return targets;
    })
    .then((targets) =>
      targets.length ? res.json(targets) : res.send("not found")
    )
    .catch((err) => res.status(404).send(err));
};

export const search = (req, res) => {
  const { search } = req.params;
  const regex = new RegExp(search, "i");
  fs.readFile(TARGETS_PATH)
    .then((data) => {
      data = JSON.parse(data);
      const targets = data.targets.filter((target) => {
        if (regex.test(JSON.stringify(target))) return target;
      });
      return targets;
    })
    .then((targets) =>
      targets.length ? res.json(targets) : res.send("not found")
    )
    .catch((err) => res.status(404).send(err));
};
