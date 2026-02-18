const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://127.0.0.1:27017/accessibilityDB")
    .then(() => {
        console.log("Database Connected");
        app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
    })
    .catch(err => console.error("Database connection error:", err));

