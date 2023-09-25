# LAUNCHSTORE

[![README.md](https://img.shields.io/badge/-Read%20in%20English-brightgreen?style=for-the-badge)](./README.md)

## Índice
- [🧾 Sobre o projeto](#-sobre-o-projeto)
- [🚀 Principais tecnologias](#-principais-tecnologias)
- [💻 Como usar](#-como-usar)

## 🧾 Sobre o projeto
Essa é uma aplicação web onde o usuário pode encontrar as funcionalidades mais comuns de um e-commerce como: comprar produtos, vender, anunciar itens e assim por diante.

## 🚀 Principais tecnologias
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [PostgreSQL](https://www.postgresql.org/)

_(Você pode ver todas as dependências do projeto no arquivo [package.json](./package.json))_

## 💻 Como usar
Como você pode ver no tópico [🚀 Principais tecnologias](#-principais-tecnologias), esta aplicação depende de um banco de dados [PostgreSQL](https://www.postgresql.org/), então você deve tê-lo instalado.<br />

1. Faça o clone do projeto (você vai precisar de um [personal access token](https://docs.github.com/pt/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls)):
   ```bash
   git clone https://github.com/victorbadaro/launchstore
   ```

2. Acesse o diretório correspondente:
   ```bash
   cd launchstore
   ```

3. Instale as dependências:
   ```bash
   npm install
   # sinta-se livre para usar outro gerenciador de pacotes, mas talvez você queira usar o npm uma vez que já existe um arquivo package-lock.json na raíz do projeto
   ```

4. Acesse o teu servidor PostgreSQL

5. Execute cada um dos 4 passos que estão no arquivo [database.sql](./database.sql)

6. Crie uma **conta** e um **inbox** no [mailtrap.io](mailtrap.io). Você vai precisar das crendenciais SMTP para continuar (*username* e *password*)

7. Crie um arquivo `.env` na raíz do projeto com o mesmo conteúdo que está no arquivo [.env.example](./.env.example) e preencha as variáveis de ambiente com os seus dados:<br />
   Por exemplo:<br />
   ![image](https://github.com/victorbadaro/launchstore/assets/9096344/523fc419-6751-435d-b505-3fedf0cd7ffb)

8. Execute o arquivo [seed](./seed.js):
   ```bash
   npm run seed
   ```

9. Inicie o servidor executando o script `dev`:
   ```bash
   npm run dev
   ```

🎉 _**Divirta-se! Agora você é um proprietário de um e-commerce!**_
---

<p align="center">Este projeto foi criado e desenvolvido com ❤ por <a href="https://github.com/victorbadaro">Victor Badaró</a></p>
