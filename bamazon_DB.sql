CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Heavy duty scissors","Art, Crafts, & Sewing","10.99","10"),
	("Wireless Bluetooth Airpods", "Computers & Accessories", "39.99","30"),
    ("USB C Cable 5Pack", "Computers & Accessories", "11.99","50"),
    ("Raw Honey", "Groceries", "24.99", "3"),
    ("Construction Building Kit", "Toys & Games", "22.46", "5"),
    ("Standing Desk", "Computers & Accessories", "119.99", "10"),
    ("Shark Cordless Vacuum", "Home & Kitchen", "214.00", 1),
    ("Beefy Rawhides", "Pet Supplies", "14.99", "70"),
    ("Solar garden lights set of 4", "Garden", "22.99", "4"),
    ("Paw Patrol PS 4", "PC & Video Games", "21.83", "2"),
    ("Ukulele", "Musical Instruments", "35.49", "10"),
    ("Wire Stripper", "Power & Hand Tools", "8.49", "20");
    
SELECT * FROM products;