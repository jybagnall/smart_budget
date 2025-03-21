CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--create
CREATE TABLE dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    user_id INT NOT NULL,
    UNIQUE(year, month, user_id), 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- create
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    target_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_id INT NOT NULL, 
    FOREIGN KEY (date_id) REFERENCES dates(id) ON DELETE CASCADE
);

-- create this, 
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL, 
    date_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (date_id) REFERENCES dates(id) ON DELETE CASCADE,
    UNIQUE (user_id, category_name, date_id) 
);

-- create this
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    planned_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category_id INT NOT NULL,
    date_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (date_id) REFERENCES dates(id) ON DELETE CASCADE 
);



-- Filters data for a specific user, month, and year.
-- Summarizes expenses per category.
-- Calculates each category’s percentage of the total budget.
SELECT 
    c.category_name,
    SUM(i.planned_amount) AS category_total,
    b.target_amount AS total_budget,
    (SUM(i.planned_amount) / b.target_amount) * 100 AS percentage
FROM budgets b
LEFT JOIN items i ON b.date_id = i.date_id
LEFT JOIN categories c ON i.category_id = c.id AND c.date_id = b.date_id
LEFT JOIN dates d ON b.date_id = d.id
WHERE b.date_id = (
    SELECT id FROM dates WHERE user_id = ? AND year = ? AND month = ?
) 
GROUP BY c.category_name, b.target_amount;




-- --------------------- reference
-- what I inserted
ALTER TABLE categories
ADD COLUMN date_id INT NOT NULL;

ALTER TABLE categories
ADD CONSTRAINT fk_categories_date_id -- foreign key constraint name
FOREIGN KEY (date_id) REFERENCES dates(id)
ON DELETE CASCADE;

-- added a new column, date_id
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    planned_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- not plan to create this 
-- amount: sum of currently planned budget per category.
CREATE TABLE planned_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    date_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_id, date_id), 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (date_id) REFERENCES dates(id) ON DELETE CASCADE
);
