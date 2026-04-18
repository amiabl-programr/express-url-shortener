import app from './app.js';
import { startDB, initializeSchema } from './db/db.js';

const port = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    await startDB();
    await initializeSchema();
    app.listen(port, (): void => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
