import express from "express";

import Authenticate from "../middleware/authenticate";
import SearchController from "../controllers/searchController";

const app = express.Router();

app.use(Authenticate.isLoggedIn);
app.route("/search-location")
  .get(SearchController.searchLocation);

export default app;
