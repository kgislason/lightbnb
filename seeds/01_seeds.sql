INSERT INTO users (name, email, password)
VALUES ('John Smith', 'john.smith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('2019-Judy Blume', 'judy_a_blume@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('John Stamos', 'stamos4ever@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Michael Buble', 'buble23@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbanil_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,number_of_bedrooms, country, street, city, province, post_code)
VALUES ('1', 'awesomeness', 'description', 'https://picsum.photos/200/300', 'https://picsum.photos/600/1200', '93061', '1', '3', '2', 'Canada', '123 Lovely Way', 'Victoria', 'British Columbia', 'V9B 5Y1'),
('1', 'By the beach', 'description', 'https://picsum.photos/200/300', 'https://picsum.photos/600/1200', '123048', '1', '3', '2', 'Canada', '55678 Walter Walk', 'Nanaimo', 'British Columbia', 'Y9A 5B1'),
('2', 'Tiny dump', 'description', 'https://picsum.photos/200/300', 'https://picsum.photos/600/1200', '9084', '0', '1', '0', 'Canada', '123 Dumpy Ave', 'Surrey', 'British Columbia', 'V9T 4Y1');


INSERT INTO reservations (start_date, end_date, property_id, guest_id )
VALUES ('2023-01-01', '2023-01-03', '2', '3'),
('2023-02-02', '2023-02-03', '1', '3'),
('2023-03-20', '2023-03-25', '3', '3');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES ('3', '2', '1', '5', 'message'),
('3', '2', '1', '3', 'blew my mind'),
('3', '3', '3', '1', 'terrible. never say here!');
