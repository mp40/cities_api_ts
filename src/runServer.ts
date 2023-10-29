import { setupExpressServer } from ".";
import { setupDatabase } from "./model/init";

setupDatabase();

const PORT = process.env.PORT || 8080;
const app = setupExpressServer();

app.listen(PORT, () => {
  console.log("Server running on:", PORT);
});
