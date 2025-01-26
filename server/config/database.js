const oracledb = require("oracledb");
require("dotenv").config();

var connectionProperties = {
  user: process.env.user,
  password: process.env.password, // Điền mật khẩu của mình khi cấu hình oracle
  connectString: process.env.connectString,
  privilege: oracledb.SYSDBA, // chỉ cần khi quyền user là sys, hr thì không cần
};

const Connection = () => {
  return oracledb.getConnection(connectionProperties);
};

async function doRelease(connection) {
  try {
    if (connection) {
      await connection.close();
      console.log("Connection released successfully.");
    }
  } catch (err) {
    console.error("Error releasing connection:", err.message);
  }
}

module.exports = {
  Connection, doRelease
};
