SELECT users.first_name AS first_name, topics.id AS id
	FROM users JOIN topics ON users.id = topics.user_id
	-- WHERE users.email ~ '@lannister.com'
	WHERE users.email LIKE '@lannister.com'
	ORDER BY topics.created_at;