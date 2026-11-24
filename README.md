# Food & Coffee Cafe — Backend & Database (Node.js + Express + SQLite)

Is folder mein aapke HTML, CSS, aur JavaScript cafe frontend ke liye ek ready-to-run **Backend API** aur **SQLite Database** (`cafe.db`) setup diya gaya hai.

## Files Included
- `server.js` — Express REST API server (`http://localhost:5000`)
- `db.js` — SQLite database connection, tables (`menu_items`, `orders`, `reservations`, `messages`), aur initial menu seeding
- `package.json` — Dependencies (`express`, `cors`, `sqlite3`)
- `frontend-integration-example.js` — Apne frontend JS se API call karne ka example code

## Kaise Chalayein (Setup Steps)
1. Terminal / Command Prompt is folder mein open karein.
2. Dependencies install karein:
   ```bash
   npm install
   ```
3. Server start karein:
   ```bash
   npm start
   ```
   Pehli baar run karne par `cafe.db` file apne aap ban jayegi aur sample coffee/food menu items insert ho jayenge.

## API Endpoints
- `GET /api/menu?category=Coffee` — Menu items fetch karein (`All`, `Coffee`, `Food`, `Dessert`)
- `POST /api/menu` — Naya menu item add karein
- `POST /api/orders` — Customer order save karein
- `GET /api/orders` — Saare orders dekhein
- `POST /api/reservations` — Table booking save karein
- `GET /api/reservations` — Saari table bookings dekhein
- `POST /api/messages` — Contact / feedback form message save karein
