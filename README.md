# Betting Game

This is a real-time betting game built using **React.js**, **Node.js**, **Express**, **Socket.io**, and **Tailwind CSS**. The project uses **Vite** as the build tool for a fast and optimized development experience.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express
- **Real-time Communication:** Socket.io
- **Database:** MySQL (Using XAMPP for local development)
- **Build Tool:** Vite

---

## 🚀 Getting Started

### 1. Clone the Repository:

```bash
git clone <repository-url>
cd betting-game
```

### 2. Install Dependencies:

```bash
npm install
```

### 3. Development Server:

```bash
npm run dev
```

### 4. Production Build:

```bash
npm run build
```

---

## 🗄️ Database Setup with XAMPP

1. Start **Apache** and **MySQL** in XAMPP.
2. Open **phpMyAdmin** in your browser: `http://localhost/phpmyadmin`
3. Create a new database named `lotto_db`.
4. Import the database:
   - Go to the **Import** tab in **phpMyAdmin**.
   - Choose the SQL file located in the project's **database** folder.
   - Click **Go** to import.

---

## 🔧 Environment Variables

Create a **.env** file in the project root with the following:

```env
PORT=3306
API_KEY={public_key}
API_SECRET_KEY={private_key}

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=lotto_db
ROLE=server
```

- **PORT:** Port for the MySQL database.
- **API\_KEY** and **API\_SECRET\_KEY:** Used for authentication or API requests.
- **DB\_HOST:** Database host (localhost for XAMPP).
- **DB\_USER:** Database user (default is root).
- **DB\_PASS:** Password for the database user (leave empty if none).
- **DB\_NAME:** Name of the database (**lotto\_db**).
- **ROLE:** Role type for the server.

---

## 🗂️ Project Structure

```
/betting-game
│── /database
│── /public
│── /server
│   ├── /config
│   ├── /middleware
│   ├── /models
│   ├── /sockets
│   ├── /utils
│   └── server.js
│── /src
│   ├── /assets
│   ├── /components
│   ├── /css
│   ├── /pages
│   └── /services
│── .env
│── package.json
└── vite.config.js
```

---

## 📂 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Create a production build.

---

## 🤝 Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

---

## 📄 License

This project is licensed under the **MIT License**.

