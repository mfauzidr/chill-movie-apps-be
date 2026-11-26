import * as dotenv from "dotenv";
const envPath =
  process.env.NODE_ENV === "production" ? "./.env.production" : "./.env";

dotenv.config({ path: envPath, override: true });

import app from "./src/app";
import { logger } from "./src/shared/logger/logger";

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode - DB: ${process.env.DB_HOST || "not specified"}`
  );
});

export default app;
