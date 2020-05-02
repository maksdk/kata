CREATE TABLE countries (
	id bigint PRIMARY KEY,
	name varchar(255)
);

CREATE TABLE country_regions (
	id bigint PRIMARY KEY,
	country_id bigint REFERENCES countries(id),
	name varchar(255)
);

CREATE TABLE country_region_cities (
	id bigint PRIMARY KEY,
	country_region_id bigint REFERENCES country_regions(id),
	name varchar(255)
);

INSERT INTO countries VALUES (1, 'Россия');

INSERT INTO country_regions (id, country_id, name) VALUES 
	(1, 1, 'Татарстан'), 
	(2, 1, 'Самарская область');

INSERT INTO country_region_cities (id, country_region_id, name) VALUES 
	(1, 1, 'Бугульма'),
	(2, 2, 'Тольятти'),
	(3, 1, 'Казань');
