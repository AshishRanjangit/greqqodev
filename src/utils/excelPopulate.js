const mongoose = require("mongoose");
const CompanyList = require("../models/companies");
const fs = require("fs");
const csv = require("csv-parser");

function saveDataToMongoDB() {
  const csvFilePath =
    "D:/projects/learning/project/greqqodev/src/companies.csv"; // Adjust the path accordingly

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      const company = new CompanyList({
        name: row.Company,
        // Add other fields as needed
      });
      company
        .save()
        .then(() => console.log("Company saved to MongoDB"))
        .catch((error) =>
          console.error("Error saving company to MongoDB:", error.message)
        );
    })
    .on("end", () => {
      console.log("CSV file successfully processed.");
    });
}

module.exports = saveDataToMongoDB;
