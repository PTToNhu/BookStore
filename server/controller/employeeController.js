const { getEmployeesFDB } = require("../routes/employeeAPI");

const getEmployees = async function (req, res) {
  console.log("GET EMPLOYEES");
  const data=await getEmployeesFDB();
  res.json(data);
};
module.exports = {
  getEmployees,
};
