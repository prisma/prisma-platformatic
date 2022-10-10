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
