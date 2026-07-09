import "dotenv/config";
import { db } from "./db";
import { importVault } from "./vault-db";

importVault()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
