This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## npm packages to install
npm install axios
npm install bcryptjs
npm install js-cookie
npm install jsonwebtoken
npm install jwt-decode
npm install mongoose
npm install react
npm install react-dom
npm install react-hot-toast

## .env
This file should include 5 variables:
MONGO_URI = Mongodb server URI. Scroll down to MongoDB for more detailed instructions. 
TOKEN_SECRET = this is a string of your choosing.
DOMAIN = include your domain here. If you are using localhost, enter that here with the port. 
PARKS_API_AUTH = API key to use the national parks APIs. Scroll down to National Parks API for more detailed instructions. 
PARKS_URI = https://developer.nps.gov/api/v1/parks => National Park Service API Developer Resource website.

## National Parks API
To obtain an NPS API key sign up by filling out the form in this link: https://www.nps.gov/subjects/developer/get-started.htm. Once sign up is completed, an email will be sent to you that includes the key. Enter this key in your .env file. (Ex. PARKS_API_AUTH = [the key provided in your email])

## MongoDB
Follow these links to get started with MongoDB Atlas and Compass. 
Create an account - https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/
Deploy a free cluster - https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/
Database User Management - https://www.mongodb.com/docs/atlas/tutorial/create-mongodb-user-for-cluster/
Create connection and cluster - https://www.mongodb.com/docs/atlas/create-connect-deployments/

## Tailwind CSS
Note css was setup for screen size 1920 x 1080. Not setup for mobile devices at this time. 

## Screenshots of the site

Home page - not signed in


User profile

Login

Signup