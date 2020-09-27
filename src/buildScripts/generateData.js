import faker from "faker";
import chalk from "chalk";
import fs from "fs";
import jsf from "json-schema-faker";
import { userSchema } from "./usersSchema";

jsf.extend("faker", function () {
  return faker;
});

const compiledUserSchema = jsf.generate(userSchema);

const users = compiledUserSchema.groups;

const json = JSON.stringify({
  users,
});

fs.writeFile("./src/buildScripts/db.json", json, (err) => {
  if (err) {
    console.log(chalk.red(err.message));
  } else {
    console.log(chalk.green("Mock API data generated."));
  }
});
