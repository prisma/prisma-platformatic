# Platformatic Prisma integration

Article series:
- [Part 1: Why Prisma and Platformatic are a great match ](https://dev.to/prisma/why-prisma-and-platformatic-are-a-great-match-2dkl)
- [Part 2: Friendly Data Modeling & Auto-generated, Editable Migrations for Platformatic with Prisma](https://dev.to/prisma/friendly-data-modeling-auto-generated-editable-migrations-for-platformatic-with-prisma-dib)
- [Part 3: Extend your Platformatic API with Prisma Client](https://dev.to/prisma/extend-your-platformatic-api-with-prisma-client-3p92)


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

Open up the [`schema.prisma`](./prisma/schema.prisma) file. The schema contains two models: `User` and `Post`. The `User` and `Post` model have a 1-n relationship.

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


Apply the migration:

```
npx platformatic db migrate
```

Under the hood, Platformatic will create a `versions` table in the database. The `versions` table is used by Platformatic(that uses [Postgrator]() under the hood) to track the applied migrations to your database. The next time you run `npx db-diff`, it will generate SQL that will prompt you to drop the table from your database. This is an undesirable behavior. Therefore, add the following snippet to your Prisma schema file to prevent this from happening:

```prisma
// used by [postgrator](https://github.com/rickbergfalk/postgrator) to keep track of applied migrations
model versions {
  version BigInt    @id
  name    String?
  md5     String?
  run_at  DateTime? @db.Timestamptz(6)

  @@ignore
}
```

Start-up Platformatic DB:
```
npm run dev
```

Explore the GraphQL API on [http://localhost:3042/graphiql](http://localhost:3042/graphiql).
Explore the REST API documentation at [http://localhost:3042/documentation](http://localhost:3042/documentation).
