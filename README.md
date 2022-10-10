# Platformatic Prisma integration

## Usage

Clone the repository

```
git clone git@github.com:ruheni/prisma-platformatic.git
```

Install dependencies
```
cd prisma-platformatic
npm i
```

Start up the container with docker compose
```
docker-compose up -d
```

Create a `.env` file at the root of your project directory:

```
touch .env
```

Paste in the following snippet in your `.env` file:
```bash
# .env
PORT=3042 
PLT_SERVER_HOSTNAME=127.0.0.1 
PLT_SERVER_LOGGER_LEVEL=info

# update it with your database connection string from the previous step DATABASE_URL="postgres://admin:strongpassword@localhost:5430/prisma-platformatic"
```

Start up Platformatic:
```
npm run dev
```

Update the Prisma schema with two models:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
```

Generate a migration:
```
npm run prisma:migrate:diff
```

Restart Platformatic:
```
npm run dev
```

Explore the GraphQL API on [http://localhost:3042/graphiql](http://localhost:3042/graphiql).
