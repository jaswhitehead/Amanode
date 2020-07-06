var mysql = require("mysql");
var inquirer = require("inquirer");

// Import the `keys.js` file to add DB password from .env file (Doesnt work right now)
// var keys = require("./keys.js");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",

    // Your password and database name
    password: "Gamecock@33",
    database: "bamazon_DB"
  });
  
// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    buyProduct();
});

function buyProduct() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        inquirer
          .prompt([
              {
                name: "choice",
                type: "rawlist",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                      choiceArray.push(results[i].product_name);
                    }
                      return choiceArray;
                },
                message: ("What item would you like to purchase?")
              },
              {
                    name: "numProducts",
                    type: "input",
                    message: ("How many units would you like to purchase?")
              }
            ])
            .then(function(answer) {
                var chosenProduct;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenProduct = results[i];
                    }
                }
                //determine if there is enough stock
                if (chosenProduct.stock_quantity > parseInt(answer.numProducts)) {
                    connection.query(
                        //Upadtes data set in mysql
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: chosenProduct.stock_quantity - answer.numProducts
                            },
                            {
                                item_id: chosenProduct.item_id
                            }
                        ],
                    function(error) {
                        if (error) throw err;
                        var total = chosenProduct.price * answer.numProducts;
                        console.log("===================================================================");
                        console.log("Your order was placed!  " + "Your total is: " + total);
                        console.log("===================================================================");
                        orderMore();
                    }
                );
                } else {
                    console.log("===================================================================");
                    console.log("SORRY, we only have: " + chosenProduct.stock_quantity);
                    console.log("You asked for: " + answer.numProducts);
                    console.log("There was not enough stock to place your order...");
                    console.log("===================================================================");
                    orderMore();
                }
            });
    });
}

// Added an additional function to decide whether to order more or not instead of goin straight back to buying prompt
function orderMore() {
    inquirer
      .prompt({
        name: "orderMoreProducts",
        type: "list",
        message: "Would you like to order more products?",
        choices: ["Order More Products", "No Thank You, I'm Finished"]
      })
      .then(function(answer) {
        // based on their answer, call the buying function or exit application
        if (answer.orderMoreProducts === "Order More Products") {
          buyProduct();
        }
        else if(answer.orderMoreProducts === "No Thank You, I'm Finished") {
            connection.end();
        }
      });
}
