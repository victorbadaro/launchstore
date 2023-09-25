# LAUNCHSTORE

[![LEIAME.md](https://img.shields.io/badge/-Leia%20em%20Portugu%C3%AAs-brightgreen?style=for-the-badge)](./LEIAME.md)

## Summary
- [🧾 About](#-about)
- [🚀 Main technologies](#-main-technologies)
- [💻 Usage](#-usage)

## 🧾 About
This is a web application where the user can find the most common e-commerce features like: buy products, sell products, announce items and so on.

## 🚀 Main technologies
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [PostgreSQL](https://www.postgresql.org/)

_(You can see all the dependencies in the [package.json](./package.json) file)_

## 💻 Usage
As you can see on [🚀 Main technologies](#-main-technologies) topic, this application depends on a [PostgreSQL](https://www.postgresql.org/) database, so you must have it installed.<br />
First things first:

1. Clone the project (you'll need a [personal access token](https://docs.github.com/pt/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls)):
   ```bash
   git clone https://github.com/victorbadaro/launchstore
   ```

2. Access its directory:
   ```bash
   cd launchstore
   ```

3. Install its dependencies:
   ```bash
   npm install
   # feel free to use another package manager, but you might want use npm once there's already a package-lock.json file in the root directory
   ```

4. Access your postgresql server

5. Run each one of the 4 steps that are in the [database.sql](./database.sql) file

6. Create an **account** and an **inbox** on [mailtrap.io](mailtrap.io). You'll need the SMTP credentials to continue (*username* and *password*)

7. Create a `.env` file in the root directory with the same content that is in the [.env.example](./.env.example) file and fill the variables with your own data:<br />
   For example:<br />
   ![image](https://github.com/victorbadaro/launchstore/assets/9096344/523fc419-6751-435d-b505-3fedf0cd7ffb)

8. Run the [seed](./seed.js) file:
   ```bash
   npm run seed
   ```

9. Start the server by running the `dev` script:
   ```bash
   npm run dev
   ```

🎉 _**Have fun! You are now an e-commerce owner!**_
---

<p align="center">This project was created and developed with ❤ by <a href="https://github.com/victorbadaro">Victor Badaró</a></p>
