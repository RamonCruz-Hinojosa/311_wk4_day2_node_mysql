const mysql = require("mysql");
const pool = require("../sql/connection");
const { handleSQLError } = require("../sql/error");

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  // sorry if my answer here is ugly it wouldn't stay the way I wanted it to be because of prettier.
  // next line is the answer for returning all fields of all users from all tables
  // select * from ((users inner join usersAddress on users.id = usersAddress.user_id) inner join usersContact on users.id = usersContact.user_id)
  pool.query("SELECT * FROM users", (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
};

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  // console.log(req.params.id);
  let sql = "SELECT * FROM users WHERE ID = ?";
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.params.id]);

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err);
    return res.json(rows);
  });
};

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME
  let sql = "INSERT INTO users (??, ??) VALUES (?, ?)";

  const replacements = [
    "first_name",
    "last_name",
    req.body.first_name,
    req.body.last_name,
  ];
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, replacements);

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.json({ newId: results.insertId });
  });
};

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE users SET ?? = ?, ?? = ? WHERE ID = ?";
  const replacements = [
    "first_name",
    req.body.first_name,
    "last_name",
    req.body.last_name,
    req.params.id,
  ];
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, replacements);

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.status(204).json();
  });
};

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM users WHERE ?? = ?";
  const replacements = ["first_name", req.params.first_name];
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, replacements);

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err);
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName,
};
/* 
 all this mess is my attempt at creating a complete user including all fields of all tables
 i tried to use multiple inserts but that didnt work and i couldnt get my transaction
 stuff to work either. i wanted to show that i tried though. sorry about the mess!
  
 INSERT INTO usersAddress (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?); INSERT INTO usersContact (??, ??, ??) VALUES (?, ?, ?)
 console.log(req.body.first_name);

    "address",
    "city",
    "county",
    "state",
    "zip",
    req.body.address,
    req.body.city,
    req.body.county,
    req.body.state,
    req.body.zip,
    "phone1",
    "phone2",
    "email",
    req.body.phone1,
    req.body.phone2,
    req.body.email,
  */
