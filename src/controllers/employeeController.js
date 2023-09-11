import asyncHandler from "express-async-handler";
import Employee from "../Models/employeeModel.js";
import { v4 as uuidv4 } from "uuid";
import csvParser from "csv-parser";
import fs from "fs";

/// fetching all employee
/// public route
/// api/employee
export const getAllEmployees =
  ("/",
  asyncHandler(async (req, res) => {
    if (req.user.role === "admin") {
      try {
        const employees = await Employee.find();

        res.json(employees);
      } catch (error) {
        res.json(error.message);
      }
    } else {
      try {
        const employees = await Employee.find({ "business.id": req.user._id });

        res.json(employees);
      } catch (error) {
        res.json(error.message);
      }
    }
  }));

function getRandomDateWithinRange(startDate, endDate) {
  const startMillis = startDate.getTime();
  const endMillis = endDate.getTime();
  const randomMillis = startMillis + Math.random() * (endMillis - startMillis);
  return new Date(randomMillis);
}

/// add new employee
/// private route
/// api/employee/add
export const createEmployee =
  ("/",
  asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    let txtdnsrndstring = uuidv4();

    // Get the current date
    const currentDate = new Date();

    // Calculate the end of the current month
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Calculate the difference in hours between now and the end of the month
    const hoursUntilEndOfMonth = (endOfMonth - currentDate) / (1000 * 60 * 60);

    // Calculate a random nextmaildate based on the condition
    let nextmaildate;
    if (hoursUntilEndOfMonth <= 12) {
      // If there are less than 12 hours left in the current month, set nextmaildate to a random date within the next month
      nextmaildate = getRandomDateWithinRange(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)
      );
    } else {
      // Otherwise, set nextmaildate to a random date within the current month
      nextmaildate = getRandomDateWithinRange(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      );
    }

    const employee = new Employee({
      business: { id: req.user._id, name: req.user.name },
      name,
      email,
      phone,
      txtdnsrndstring,
      nextmaildate,
    });

    const employeeDone = await employee.save();

    if (employeeDone) {
      res.json(employeeDone);
    } else {
      res.status(404);
      throw new Error("Problem with creating employee");
    }
  }));
/// add new employee
/// private route
/// api/employee/add
export const importEmployee =
  ("/",
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file not provided." });
    }

    const csvFile = req.file;
    const employees = [];

    fs.createReadStream(csvFile.path)
      .pipe(csvParser())
      .on("data", (row) => {
        // Assuming your CSV has columns: "name", "phone", and "email"
        const { name, phone, email } = row;
        let txtdnsrndstring = uuidv4();

        // Get the current date
        const currentDate = new Date();

        // Calculate the end of the current month
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );

        // Calculate the difference in hours between now and the end of the month
        const hoursUntilEndOfMonth =
          (endOfMonth - currentDate) / (1000 * 60 * 60);

        // Calculate a random nextmaildate based on the condition
        let nextmaildate;
        if (hoursUntilEndOfMonth <= 12) {
          // If there are less than 12 hours left in the current month, set nextmaildate to a random date within the next month
          nextmaildate = getRandomDateWithinRange(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)
          );
        } else {
          // Otherwise, set nextmaildate to a random date within the current month
          nextmaildate = getRandomDateWithinRange(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          );
        }
        const employee = new Employee({
          business: { id: req.user._id, name: req.user.name },
          name,
          email,
          phone,
          txtdnsrndstring,
          nextmaildate,
        });

        employees.push(employee);
      })
      .on("end", async () => {
        try {
          const savedEmployees = await Employee.insertMany(employees);
          res.json(savedEmployees);
        } catch (error) {
          res.status(500).json({ error: "Failed to import employees." });
        }
      });
  }));

/// update Employee
/// private route
/// api/employee/update/:id
export const updateEmployee =
  ("/update/:id",
  asyncHandler(async (req, res) => {
    try {
      const employee = await Employee.findOneAndUpdate(
        { _id: req.params.id },
        req.body.changedField
      );
      if (employee) {
        res.json({ success: true, message: "Employee updated successfully" });
      } else {
        res.status(500);
        throw new Error("Internal error");
      }
    } catch (error) {
      res.status(404);
      res.json({ success: false, message: "Employee not found" });
    }
  }));

/// delete Employee
/// private route
/// api/employee/delete/:id
export const deleteEmployee =
  ("/delete/:id",
  asyncHandler(async (req, res) => {
    const employee = await Employee.deleteOne({ _id: req.params.id });

    if (employee.deletedCount !== 0) {
      res.json({ success: true, message: "Employee deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Employee Not Found...");
    }
  }));

/// fetching item by ID
/// public route
/// api/products/:id
export const getItemByID =
  ("/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Item Not Found...");
    }
  }));

/// add product review
/// api/products/review/add/:id
export const addReview =
  ("products/review/add/:id",
  asyncHandler(async (req, res) => {
    const { comment, rating, newTotalRating } = req.body;

    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { reviews: { name: req.user.name, rating, comment } } }
      );

      if (product) {
        const incNumReview = await Product.findOneAndUpdate(
          { _id: req.params.id },

          { $inc: { numReviews: 1 } }
        );
        await Product.findOneAndUpdate(
          { _id: req.params.id },
          { rating: newTotalRating * 1 }
        );

        res.json({ success: true, message: "Review added successfully" });
      }
    } catch (error) {
      throw new Error("Item Not Found....");
    }
  }));

export const getEmployeeList = async (businessid) => {
  try {
    const emp = await Employee.find({ "business.id": businessid });
    // console.log(business);
    return emp;
  } catch (error) {
    return false;
  }
};

/// inc number of email sent for employee
export const incrementEmailSentCount = async (employeeid) => {
  try {
    const emp = await Employee.findOneAndUpdate(
      { _id: employeeid },
      { $inc: { mailsent: 1 } }
    );
    // console.log(business);
    return;
  } catch (error) {
    return false;
  }
};

/// inc number of email sent for employee
export const incrementEmailOpenedCount = async (employeeid) => {
  try {
    const emp = await Employee.findOneAndUpdate(
      { _id: employeeid },
      { $inc: { mailopened: 1 } }
    );
    // console.log(business);
    return;
  } catch (error) {
    return false;
  }
};
