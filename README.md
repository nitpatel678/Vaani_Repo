# 🌐 Vaani – Crowdsourced Civic Issue Reporting System

Vaani is a **crowdsourced civic issue reporting platform** designed to bridge the gap between citizens and local authorities.

* Citizens can **report issues** (like potholes, broken streetlights, or garbage collection).
* Admins and Department Heads can **track, assign, and resolve issues** via a web portal.
* Media uploads are securely managed via **Supabase buckets**.
* Built for **scalability, transparency, and accessibility** with mobile + web support.

---

## ⚡ Tech Stack

**Frontend:**

* React Native (Mobile App for citizens)
* React.js (Web Portal for admins & departments)

**Backend:**

* Node.js + Express.js
* MongoDB (Atlas) – database
* Supabase – for media upload (buckets + signed URLs)

**Other Tools:**

* JWT (Authentication & Role-based Authorization)
* Bcrypt.js (Password Hashing)
* Docker (for future scalability)

---

## 🔑 Environment Variables

Create a `.env` file in the root of your backend project and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BASE_URL=http://localhost:3000   # frontend URL (update for production)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=your_supabase_bucket_name
```

---

## 🚀 Quick Start

### **1. Clone the Repository**

```bash
git clone https://github.com/nitpatel678/Vaani_Repo.git
cd Vaani_Repo
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

* Configure `.env` file with the required environment variables.

Start the backend server:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### **3. Frontend Setup (Web Portal)**

```bash
cd frontend
npm install
npm start
```

Runs at: `http://localhost:3000`

---

### **4. Mobile App (React Native – Citizen App)**

```bash
cd app
npm install
npm start
```

* Use **Expo Go** or emulator to run the app.

---

## 📂 Project Structure

```
Vaani_Repo/
│── backend/          # Node.js + Express backend
│── frontend/         # React.js web portal
│── app/              # React Native mobile app
│── README.md         # Project documentation
```

---

## 📌 Features

* 👤 **User Roles**: Citizen, Head, Department
* 📝 **Issue Reporting**: Citizens report civic issues via mobile app
* 📸 **Media Uploads**: Image/Video uploads via Supabase
* 📊 **Admin Dashboard**: Manage issues, assign to departments
* 🔒 **Secure Auth**: JWT-based login & role-based access
* ⚡ **Scalable**: MongoDB Atlas + Docker-ready backend

---

## 🛡️ Security Highlights

* Passwords hashed with **bcrypt**
* JWT-based authentication with role checks
* CORS restricted to frontend domains
* Supabase uploads secured via **signed URLs**
