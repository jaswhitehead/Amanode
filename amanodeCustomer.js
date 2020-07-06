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
                        console.log("Your order was placed!  " + "Your total is: " + total);
                        buyProduct();
                    }
                );
                } else {
                    console.log(chosenProduct.stock_quantity);
                    console.log(answer.numProducts);
                    console.log("There was not enough stock to place your order...");
                    buyProduct();
                }
            });
    });
}