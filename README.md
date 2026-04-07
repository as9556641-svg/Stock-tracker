# Stock Portfolio Tracker

A full-stack stock portfolio tracker with:

- Express + MongoDB backend
- React + Vite frontend
- Tailwind CSS styling
- JWT authentication
- Axios-based API integration
- Portfolio dashboard with add/delete stock actions and profit/loss summary

## Project Structure

```text
Playground/
|-- client/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   `-- pages/
|   |-- .env.example
|   |-- package.json
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   `-- routes/
|-- .env.example
|-- .env.sample
|-- package.json
|-- README.md
`-- server.js
```

## Backend Setup

### Sample backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auth_backend
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### Run the backend

```bash
npm install
copy .env.sample .env
npm run dev
```

Backend URL: [http://localhost:5000](http://localhost:5000)

## Frontend Setup

### Sample frontend `.env`

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

Frontend URL: [http://localhost:5173](http://localhost:5173)

## Main Features

### Authentication

- Signup page
- Login page
- JWT token stored in `localStorage`
- Protected dashboard route
- Logout from navbar

### Dashboard

- Responsive cards layout
- List of stocks with company name, quantity, current price, and total value
- Add stock form
- Delete stock button
- Total portfolio value
- Total invested value
- Profit/loss summary
- Loading spinner and error messages

## Backend API

### Auth APIs

`POST /api/auth/signup`

```json
{
  "name": "Ajeet Kumar",
  "email": "ajeet@example.com",
  "password": "password123"
}
```

`POST /api/auth/login`

```json
{
  "email": "ajeet@example.com",
  "password": "password123"
}
```

### Stock APIs

`GET /api/stocks`

`POST /api/stocks`

```json
{
  "name": "Apple Inc.",
  "symbol": "AAPL",
  "quantity": 10,
  "price": 190.5,
  "averageCost": 160
}
```

`DELETE /api/stocks/:id`

All stock routes require:

```text
Authorization: Bearer <jwt_token>
```
