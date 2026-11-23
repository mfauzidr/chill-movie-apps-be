import app from "./app";
import db from "./database/knex";

const PORT = Number(process.env.PORT);

const startServer = async (): Promise<void> => {
  try {
    await db.raw("SELECT 1");

    console.info("Database connected successfully");

    app.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    await db.destroy();
    process.exit(1);
  }
};

void startServer();
