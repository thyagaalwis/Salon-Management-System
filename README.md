# ✨ Salon Management System

A full-stack web application for managing salon operations including appointments, services, customers, and staff. This project includes a **Node.js Express backend** and a **React + Vite frontend**, styled with **Tailwind CSS**.

---

## 📁 Folder Structure


├── Backend
│   ├── Models/
│   ├── Routes/
│   ├── uploads/
│   ├── config.js
│   ├── emailService.js
│   └── index.js
│
├── frontend
│   ├── public/
│   ├── src/
│   ├── .vite/
│   ├── tailwind.config.js
│   └── vite.config.js


---

## 🚀 Features

- 💇‍♀️ Appointment Booking & Management
- 👤 Staff & Customer Management
- 📦 Service Packages
- 📧 Email Notification System (via \`emailService.js\`)
- 📊 Admin Dashboard
- 🖼️ File Uploads (handled in backend)

---

## 🛠️ Tech Stack

### Frontend
- React.js (with Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer (email service)

---

## ⚙️ How to Run Locally

### 1. Clone the Repository


git clone https://github.com/thyagaalwis/Salon-Management-System.git
cd Salon-Management-System


### 2. Run Backend


cd Backend
npm install
node index.js


### 3. Run Frontend


cd frontend
npm install
npm run dev


---

## 📫 API Endpoints (Sample)

| Method | Endpoint        | Description              |
|--------|------------------|--------------------------|
| GET    | /appointments   | Get all appointments     |
| POST   | /appointments   | Create a new appointment |
| POST   | /send-email     | Trigger email service    |

---

## 📄 License

This project is open-source and free to use under the MIT License.
EOF

git add README.md
git commit -m "Add complete README.md"
git push
