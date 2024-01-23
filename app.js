
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");


const express = require("express");

const app = express();

// ℹ️ run middleware
require("./config")(app);

//routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const articleRoutes = require('./routes/article.routes');
app.use("/", articleRoutes);

const authRoutes = require('./routes/auth.routes');
app.use("/", authRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use("/", commentRoutes);

const userRoutes = require('./routes/user.routes');
app.use("/", userRoutes)



// ❗ To handle errors. 
require("./error-handling")(app);

module.exports = app;
