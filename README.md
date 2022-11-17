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

Start up the container with docker compose:
```
docker-compose up -d
```

Create a `.env` file at the root of your project directory:

```
cp .env.example .env
```

Open up the [`schema.prisma`](./prisma/schema.prisma) file. The schema contains three models, `User`, `Post`, and `versions`. The `User` and `Post` model have a 1-n relationship. The `versions` model is used by Platformatic(that uses [Postgrator]() under the hood to track the applied migrations to your database)

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

Generate a migration using [`@ruheni/db-diff`](https://github.com/ruheni/db-diff):
```
npx db-diff
```

The command will generate an `up` and a `down` migration, i.e. `001.do.sql` and `001.undo.sql`, which are Postgrator-compatible.

> `@ruheni/db-diff` is a helper library built on top of the Prisma CLI for auto-generating, versioning, fully-customizable database migrations that are Postgrator-compatible. By default, it generates both `up` and `down` migrations. Check out the [README](https://github.com/ruheni/db-diff/blob/main/README.md) to learn more about it.

Start-up Platformatic:
```
npm run dev
```

Explore the GraphQL API on [http://localhost:3042/graphiql](http://localhost:3042/graphiql).
Explore the REST API documentation at [http://localhost:3042/documentation](http://localhost:3042/documentation).
