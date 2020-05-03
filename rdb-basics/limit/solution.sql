SELECT * FROM users 
	WHERE birthday < '2002-10-3' 
	ORDER BY first_name
	LIMIT 3
	OFFSET 2;