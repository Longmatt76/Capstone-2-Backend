
CREATE TABLE store_owner (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30)  NOT NULL,
    is_admin BOOLEAN NOT NULL,
    roles TEXT,  
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE store (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL, 
    store_name VARCHAR(100) UNIQUE NOT NULL,
    logo VARCHAR(2083),
    theme TEXT,
    site_font TEXT, 
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES store_owner(id) ON DELETE CASCADE
);

CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(80) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    is_admin BOOLEAN NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    street_address VARCHAR(255),
    city VARCHAR(100),
    state_residence VARCHAR(100),
    zip_code INT,
    FOREIGN KEY (user_id) REFERENCES user_info(id) ON DELETE CASCADE
);


CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    category_name TEXT NOT NULL,
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE,
    CONSTRAINT unique_category_per_store UNIQUE (store_id, category_name)
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    brand TEXT, 
    product_description TEXT,
    product_img VARCHAR(2083),
    price DECIMAL,
    qty_in_stock INT,
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);


CREATE TABLE store_order (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status TEXT NOT NULL DEFAULT 'pending',
    order_total DECIMAL,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (user_id) REFERENCES user_info(id)
);

CREATE TABLE order_line (
    id SERIAL PRIMARY KEY,
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT NOT NULL,
    qty INT,
    price DECIMAL,
    FOREIGN KEY (store_id) REFERENCES store(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (order_id) REFERENCES store_order(id)
);




