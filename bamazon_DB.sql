CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Swingline Stapler","Art & Crafts", "10.99", "8"),
	("Western Digital Hard Drive", "Computers & Accessories", "79.99","10"),
    ("CAT 5 Ethernet Cable", "Computers & Accessories", "11.99","50"),
    ("Creme Fraiche", "Groceries", "7.99", "6"),
    ("LEGOS: Death Star", "Toys & Games", "52.49", "2"),
    ("HP Envy Laptop", "Computers & Accessories", "1119.99", "4"),
    ("JA Henkels Knife Set", "Home Goods", "215.00", 2),
    ("Natures Own Puppy Food 15lb bag", "Pet Supplies", "24.99", "45"),
    ("Brown Mulch (3yds)", "Garden", "4.99", "17"),
    ("Mrs. Pac Man", "PC & Video Games", "29.83", "1"),
    ("Mandolin", "Musical Instruments", "75.49", "7"),
    ("Reciprocating Saw", "Power & Hand Tools", "39.49", "12");    
SELECT * FROM products;