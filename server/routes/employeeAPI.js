const oracledb = require("oracledb");
var { Connection, doRelease } = require("../config/database");
const getEmployeesFDB = async () => {
  let connection;
  try {
    connection = await Connection();
    console.log("Connected to Oracle Database.");

    const result = await connection.execute(
      "SELECT * FROM employee",
      {}, // Không có tham số đầu vào
      { outFormat: oracledb.OBJECT }
    );
    console.log("Query executed successfully. Result:", result.rows);
    return {data: result.rows};
  } catch (err) {
    console.error("Error during database operation:", err.message);
    res.status(500).send("Error fetching employees from database.");
  } finally {
    await doRelease(connection);
  }
};
module.exports = {
  getEmployeesFDB,
};
