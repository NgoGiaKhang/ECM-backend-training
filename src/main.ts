import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./core/logger/index.js";

// Start server
app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} on port ${env.PORT}`);
});
