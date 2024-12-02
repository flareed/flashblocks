--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-0+deb12u1)
-- Dumped by pg_dump version 17.0

-- Started on 2024-11-30 19:31:08

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
-- TOC entry 3365 (class 1262 OID 16396)
-- Name: flashblocks; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE flashblocks WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


\connect flashblocks

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 217 (class 1255 OID 16437)
-- Name: update_display_name(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_display_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.display_name := NEW.brand || ' ' || NEW.name;
    RETURN NEW;
END;
$$;


--
-- TOC entry 218 (class 1255 OID 16439)
-- Name: update_existing_display_name(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_existing_display_name() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE public."PRODUCTS"
    SET display_name = brand || ' ' || name;
END;
$$;


--
-- TOC entry 215 (class 1259 OID 16411)
-- Name: CATEGORIES; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CATEGORIES" (
    category text NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 16418)
-- Name: PRODUCTS; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PRODUCTS" (
    id numeric NOT NULL,
    name text,
    category text,
    price numeric DEFAULT 0,
    imagepath text,
    link text,
    battery text,
    lumen text,
    description text,
    led_chip text,
    brand text,
    display_name text,
    discount smallint DEFAULT 0
);


--
-- TOC entry 214 (class 1259 OID 16397)
-- Name: USERS; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."USERS" (
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL
);


--
-- TOC entry 3213 (class 2606 OID 16417)
-- Name: CATEGORIES CATEGORIES_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CATEGORIES"
    ADD CONSTRAINT "CATEGORIES_pkey" PRIMARY KEY (category);


--
-- TOC entry 3215 (class 2606 OID 16424)
-- Name: PRODUCTS PRODUCTS_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PRODUCTS"
    ADD CONSTRAINT "PRODUCTS_pkey" PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 16403)
-- Name: USERS USERS_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."USERS"
    ADD CONSTRAINT "USERS_pkey" PRIMARY KEY (username);


--
-- TOC entry 3217 (class 2620 OID 16438)
-- Name: PRODUCTS display_name; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER display_name BEFORE INSERT OR UPDATE OF name, brand ON public."PRODUCTS" FOR EACH ROW EXECUTE FUNCTION public.update_display_name();


--
-- TOC entry 3216 (class 2606 OID 16425)
-- Name: PRODUCTS category_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PRODUCTS"
    ADD CONSTRAINT category_category FOREIGN KEY (category) REFERENCES public."CATEGORIES"(category) NOT VALID;


-- Completed on 2024-11-30 19:31:09

--
-- PostgreSQL database dump complete
--

