# 🅿️ PARKIN

**PARKIN** is a simple parking-space marketplace MVP that connects people who have unused parking spaces with people looking for a place to park.

## 🚀 MVP Overview

The idea is simple:

> **If a parking space is unused, someone else can use it.**

Parking-space owners can add their available parking spots, while users can view available parking spots and find one based on their city.

## ✨ Current Features

### Parking Provider

* Add a parking space
* Update parking-space details
* Delete a parking space

### Parking User

* View available parking spaces
* Search parking spaces by city

## 🏗️ Tech Stack

### Frontend

* React
* Vite
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## 📂 Project Structure

```text
PARKIN/
├── frontend/
│
└── backend/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── server.js
```

## 🔌 API

### Create Parking

```http
POST /api/parks
```

Creates a new parking space.

Example:

```json
{
  "name": "My Parking",
  "address": "123 Avinashi Road",
  "city": "Coimbatore"
}
```

### Get Parking Spaces

```http
GET /api/parks
```

Returns available parking spaces.

### Update Parking

```http
PUT /api/parks/:id
```

Updates an existing parking space.

### Delete Parking

```http
DELETE /api/parks/:id
```

Deletes a parking space.

## 🎯 Purpose of This MVP

This project is being built as a learning project while exploring the **MERN stack**.

The initial goal is to build the core functionality of the PARKIN idea before adding more advanced features.

## 🔮 Future Features

Planned features may include:

* Parking-space booking
* Online payments
* Commission system for PARKIN
* Google Maps/location integration
* Parking availability status
* Owner and parker profiles
* Booking history
* Reviews and ratings

## ⚠️ Current Status

**MVP — Work in Progress 🚧**

The current version focuses on the basic parking-space CRUD functionality and frontend integration.

---

###

**PARKIN — Where parking spaces meet people.**
