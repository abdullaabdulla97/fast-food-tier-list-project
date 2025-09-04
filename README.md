# 🍔 Fast Food Tier List

An interactive **tier list web application** built with **Node.js, Express, SQLite, and Handlebars (HBS)**. Users can log in, drag and drop fast-food restaurant logos into S–F tiers, and save their personalized ranking. Includes a simple **admin view** for user management and review.

---

## 🌐 Live Demo
- 👉 **Tier List(Main App):** [View Website Live](https://fast-food-tier-list-project.onrender.com/ranklist)
- 👉 **Users(Admin View):** [View Website Live](https://fast-food-tier-list-project.onrender.com/users)

---

## 🚀 Features
- 🔑 **User Authentication** – Sign up, log in, and manage your tier list.  
- 🏆 **Drag-and-Drop Ranking** – Arrange restaurants into S–F tiers with smooth drag and drop.  
- 🖼️ **Logo Assets** – Restaurant logos are **local images** served by the app (easy to add/update).  
- 💾 **Persistent Data** – Rankings are stored in **SQLite**.  
- ⚙️ **Admin View** – Review registered users and stored lists.  
- 📱 **Responsive Design** – Works on desktop, tablet, and mobile.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript 
- **Templating:** Handlebars (HBS)  
- **Database:** SQLite  
- **Deployment:** Render

---

## 📸 Screenshots

| Tier List Page | Login Page | Users Page (For Admin) |
|---|---|---|
| ![Tier List screenshot](public/screenshots/Tier-List.png) | ![Login screenshot](public/screenshots/Login.png) | ![Users (For Admin) screenshot](public/screenshots/Users-List.png) |

---

## ⚙️ Installation & Setup

To run this project locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/abdullaabdulla97/fast-food-tier-list-project.git
cd fast-food-tier-list-project

# 2. Install dependencies
npm install

# 3. Start SQLite in the project folder (create fastfood.db if it does not exist)
sqlite3 fastfood.db

# 4. Start the server
node server.js

# 5. Local URLs
 - Tier List: http://localhost:3000/ranklist
 - Users: http://localhost:3000/users

# 6. Test Accounts
- Admin
    - Username: Abdulla
    - Password: Abdulla
- Guest
    - Username: Jack
    - Password: secret
```
---

## 📬 Contact
- <img src="https://img.icons8.com/ios-glyphs/32/linkedin.png" height="20" width="20"/> LinkedIn: [LinkedIn](https://www.linkedin.com/in/abdulla-abdulla-350a0937b/)  
- 📧 Email: abdulla.abdulla.salem97@gmail.com  
- <img src="https://img.icons8.com/ios-glyphs/32/github.png" height="20" width="20"/> GitHub: [GitHub](https://github.com/abdullaabdulla97)

---
