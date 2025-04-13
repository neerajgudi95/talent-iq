const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose.connect(process.env.DATABASE_CONN_URL);
};

module.exports = dbConnect;
