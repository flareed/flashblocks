--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-0+deb12u1)
-- Dumped by pg_dump version 17.0

-- Started on 2024-11-30 19:32:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3361 (class 0 OID 16411)
-- Dependencies: 215
-- Data for Name: CATEGORIES; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."CATEGORIES" (category) VALUES ('Diving Flashlight');
INSERT INTO public."CATEGORIES" (category) VALUES ('Tactical Flashlight');
INSERT INTO public."CATEGORIES" (category) VALUES ('EDC Flashlight');


--
-- TOC entry 3362 (class 0 OID 16418)
-- Dependencies: 216
-- Data for Name: PRODUCTS; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (8, 'IF24 Pro', 'EDC Flashlight', 32.59, '/files/images/sofirn_if24_pro.webp', '/product/sofirn_if24_pro', '18650', '1800', 'COB LEDs on the side', 'SFT40', 'Sofirn', 'Sofirn IF24 Pro', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (1, 'SC18', 'EDC Flashlight', 16.99, '/files/images/edc_sc18.webp', '/product/sofirn_sc18', '18650', '1800', 'Very long description text, don''t ask why it is this long. I have no idea either ¯\_(ツ)_/¯', 'SST40', 'Sofirn', 'Sofirn SC18', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (2, 'C8G', 'Tactical Flashlight', 24.99, '/files/images/tactical_c8g.webp', '/product/sofirn_c8g', '18650/21700', '2000', 'This is a description of product 2.', 'SST40', 'Sofirn', 'Sofirn C8G', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (3, 'C8L', 'Tactical Flashlight', 29.99, '/files/images/tactical_c8l.webp', '/product/sofirn_c8l', '18650/21700', '3100', 'Very long description text, don''t ask why it is this long. I have no idea either ¯\_(ツ)_/¯', 'XHP50.3', 'Sofirn', 'Sofirn C8L', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (4, 'SD05', 'Diving Flashlight', 36.99, '/files/images/diving_sd05.webp', '/product/sofirn_sd05', '18650/21700', '3000', 'Very long description text, don''t ask why it is this long. I have no idea either ¯\_(ツ)_/¯', 'XHP50.2', 'Sofirn', 'Sofirn SD05', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (5, 'SC28', 'Tactical Flashlight', 31.99, '/files/images/sofirn_sc28.webp', '/product/sofirn_sc28', '21700', '2800', 'Tactical flashlight something', 'XHP50.3', 'Sofirn', 'Sofirn SC28', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (6, 'SD03', 'Diving Flashlight', 33.99, '/files/images/sofirn_sd03.webp', '/product/sofirn_sd03', '18650', '1800', 'Diving', 'SFT40', 'Sofirn', 'Sofirn SD03', 0);
INSERT INTO public."PRODUCTS" (id, name, category, price, imagepath, link, battery, lumen, description, led_chip, brand, display_name, discount) VALUES (7, 'SC31 Pro', 'EDC Flashlight', 20.59, '/files/images/sofirn_sc31_pro.webp', '/product/sofirn_sc31_pro', '18650', '2000', 'With Anduril 2.0', 'SST40', 'Sofirn', 'Sofirn SC31 Pro', 0);


--
-- TOC entry 3360 (class 0 OID 16397)
-- Dependencies: 214
-- Data for Name: USERS; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."USERS" (username, password, email) VALUES ('test', '$2b$10$lU7Farrh68UYLOnUgkrWkOVZnhkMkW43nQyjgaOFihzz.QJcceVZu', 'test@test.com');
INSERT INTO public."USERS" (username, password, email) VALUES ('admin', '$2b$10$abhizoL2ngxujFsqLEwFUeKAIGpPPHDwFSa2QszYSkGryoawNyZOO', 'admin@flashblocks.top');
INSERT INTO public."USERS" (username, password, email) VALUES ('root', '$2b$10$luHB81dJoIFv.yTI6NTMv.jh120Oo8Vrehx9VxAzRd7BTOWrCxGuW', 'root@example.com');
INSERT INTO public."USERS" (username, password, email) VALUES ('abc', '$2b$10$VQPP8qZlCRaKpXCjRNin7e18FkTdWG0eirTzLa/Mr718jeUsulpFW', 'abc@abc.com');
INSERT INTO public."USERS" (username, password, email) VALUES ('sv', '$2b$10$LDCdES2v5CmPAT3PifbATePn.Zo08BBk4ktvHIItTPNb7OcuyMDBS', '21234567@student.hcmus.edu.vn');


-- Completed on 2024-11-30 19:32:10

--
-- PostgreSQL database dump complete
--

