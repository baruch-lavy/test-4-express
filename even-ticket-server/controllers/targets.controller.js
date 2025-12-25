import fs from "fs/promises";
import path from "path"

const __dirname = path.resolve();
const TARGETS_PATH = process.env.TODOS_PATH || path.join(__dirname, "data", "targets.json");

export const health = (req, res) => {
  res.json({ res: "hello worls" });
};

export const headers = (req, res) => {
  if (req.headers["client-unit"] === "Golani") {
    res.send("o.k");
  } else {
    res.status(400).send("Error");
  }
};

export const createTarget = async (req, res) => {
  const target = req.body;
  fs.readFile("./data/targets.json")
    .then((data) => {
      data = JSON.parse(data);
      data.targets.push(target);
      fs.writeFile("./data/targets.json", JSON.stringify(data));
      res.send("target saved");
    })
    .catch((err) => res.status(400).send(err));
};

export const getById = (req, res) => {
  const { id } = req.params;
  fs.readFile(P)
    .then((data) => {
      data = JSON.parse(data);
      const target = data.targets.find((target) => target.id === id);
      return target;
    })
    .then((target) =>
      target ? res.send(JSON.stringify(target)) : res.send("not found")
    )
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

export const search = (req ,res) => {
    const { search } = req.params
    const regex = new RegExp(search, 'i')
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
}