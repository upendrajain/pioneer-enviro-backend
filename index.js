const express = require("express")
const cors = require("cors")
const dotennv = require("dotenv").config()
const dbconnect = require("./Connect/dbConnect")

const app = express();

const staffRoute = require("./routes/staffRoute");
const settingRoute = require("./routes/settingRoute");
const projectRoute = require("./routes/projectRoute");
const clientRoute = require("./routes/clientRoute");
const countryRoute = require("./routes/countryRoute");
const stateRoute = require("./routes/stateRoute");
const cityRoute = require("./routes/cityRoute");
const statusRoute = require("./routes/statusRoute");
const projectIssueRoute = require("./routes/projectIssueRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const roleRoute = require("./routes/roleRoute")

app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use(cors())
// app.use(cors({
//   origin: "https://pioneer-enviro-2.web.app", // ✅ allow your frontend
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true // agar aap cookies ya auth headers bhej rahe ho
// }));
dbconnect();

app.use("/uploads", express.static("uploads"));

app.use("/api/staff", staffRoute);
app.use("/api/setting", settingRoute);
app.use("/api/project", projectRoute);
app.use("/api/client", clientRoute);
app.use("/api/city", cityRoute);
app.use("/api/state", stateRoute);
app.use("/api/country", countryRoute);
app.use("/api/status", statusRoute);
app.use("/api/project-issue", projectIssueRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/role", roleRoute);

app.listen(process.env.PORT, () => { console.log("Running on http://localhost:" + process.env.PORT) })

