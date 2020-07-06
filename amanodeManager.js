var mysql = require("mysql");
var inquirer = require("inquirer");

// Import the `keys.js` file
var keys = require("./keys.js");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",

    // Your password which is now pulling from .env
    password: "Gamecock@33",
    database: "bamazon_DB"
  });

  // connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    manageProducts();
});

// function which prompts the manager for what action they should take
  function manageProducts() {
    inquirer
      .prompt({
        name: "manageInventory",
        type: "list",
        message: "Manage your inventory",
        choices: ["View Items", "View Low Inventory", "Add to Inventory", "Add New Products", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.manageInventory === "View Items") {
          viewItems();
        }
        else if(answer.manageInventory === "View Low Inventory") {
          viewLowInv();
        }
        else if(answer.manageInventory === "Add to Inventory") {
          addInv();
        }
        else if(answer.manageInventory === "Add New Products") {
          addNew();
        } else{
          connection.end();
        }
      });
  }
  function viewItems() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        var productsArray = [];
        for (var i = 0; i < results.length; i++) {
            productsArray.push(results[i].item_id + " | " + results[i].product_name + " | " + "$ " + results[i].price + " | " + results[i].department_name + " | " + results[i].stock_quantity);
        }
        console.log( " item_id" + " | " + "product_name" + " | " + "price" + " | " + "department_name" + " | " + "stock_quantity" );
        console.log(productsArray);
        manageProducts();
    });
  }
  function viewLowInv() {
      connection.query("SELECT * FROM products", function(err, results) {
          if (err) throw err;
            var productsArray = [];
            for (var i = 0; i < results.length; i++) {
                if (results[i].stock_quantity < 5) {
                    productsArray.push(results[i].item_id + " | " + results[i].product_name + " | " + "$ " + results[i].price + " | " + results[i].department_name + " | " + results[i].stock_quantity);
            }
        }
            console.log( "item_id" + " | " + "product_name" + " | " + "price" + " | " + "department_name" + " | " + "stock_quantity" );
            console.log(productsArray);
            manageProducts();
      });
    }

    function addInv() {
    // query the database for all inventory
      connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // prompt the manager for which item's stock quantity they'd like to update
          inquirer
            .prompt([
                {
                  name: "choice",
                  type: "rawlist",
                  choices: function() {
                  var productsArray = [];
                  for (var i = 0; i < results.length; i++) {
                  productsArray.push(results[i].product_name);
                }
                  return productsArray;
                },
                  message: "What item's stock quantity would you like to update?"
                },
                {
                  name: "quantity",
                  type: "input",
                  message: "How much stock do you want to add?"
                }
                ])
            .then(function(answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                  if (results[i].product_name === answer.choice) {
                  chosenItem = results[i];
                  }
                }
              connection.query(
                "UPDATE products SET ? WHERE ?",
                    [
                        {
                          stock_quantity: chosenItem.stock_quantity + parseInt(answer.quantity)
                        },
                        {
                          item_id: chosenItem.item_id
                        }
                    ],
                      function(error) {
                        if (error) throw err;
                        console.log("Your items stock was updated successfully!");
                        manageProducts();
                      }
              );
            });
      });
    }

    function addNew() {
        // prompt for info about the item being put up for auction
        inquirer
          .prompt([
            {
              name: "item",
              type: "input",
              message: "What is the item you would like to submit?"
            },
            {
              name: "department_name",
              type: "input",
              message: "What department would you like to place your item in?"
            },
            {
              name: "price",
              type: "input",
              message: "What is the price of the item?",
              validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            },
            {
              name: "stock_quantity",
              type: "input",
              message: "What is the stock quantity of the item?",
              validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            }
          ])
          .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
              "INSERT INTO products SET ?",
              {
                product_name: answer.item,
                department_name: answer.department_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
              },
              function(err) {
                if (err) throw err;
                console.log("Your item was created successfully!");
                manageProducts();
              }
            );
          });
      }