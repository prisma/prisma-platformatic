'use strict'

module.exports = async function ({ entities, db }) {
  await db.tx(async tx => {
    const post = await entities.post.save({
      input: {
        title: "Prisma 💚 Platformatic",
        content: "Learn how you can auto-generate your database migrations using Prisma for Platformatic",

      },
      tx
    })
    const user = await entities.user.save({
      input: {
        name: "Alex", email: "alex@prisma.io"
      },
      tx,
    })
    const res = await entities.post.save({
      fields: [ 'id', 'title', 'authorId' ],
      input: {
        id: post.id,
        authorId: user.id
      },
      tx
    })
    return res
  })
}