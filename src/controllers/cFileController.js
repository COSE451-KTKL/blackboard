import { spawn } from "child_process";
import path from "path";

export default async function cFileController(cfileDirectory, args) {
  args = Array.isArray(args) ? args : [args];

  const process = spawn(cfileDirectory, args);
  return new Promise((resolve, reject) => {
    process.on("error", (error) => {
      console.error(`Error: ${error}`);
      reject(error);
    });

    process.on("exit", (code) => {
      console.log(`Process exited with code: ${code}`);
      resolve(code);
    });
  });
}
