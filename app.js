const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const url = process.env.URL || "localhost";
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running at http://${url}:${port}/api`);
});
