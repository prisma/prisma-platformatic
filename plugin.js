const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async (app) => {
  app.log.info('plugin loaded')
  // Extend GraphQL Schema with resolvers
  app.graphql.extendSchema(`
    extend type Mutation {
      incrementPostViewCount(id: ID): Post
    }
  `)
  app.graphql.defineResolvers({
    Mutation: {
      incrementPostViewCount: async (_, { id }) => {
        const post = await prisma.post.update({
          where: {
            id: Number(id)
          },
          data: {
            viewCount: {
              increment: 1
            }
          }
        })

        if (!post) throw new Error(`Post with id:${id} was not found`)
        return post
      },
    }
  })

  app.put('/post/:id/views', async (req, reply) => {
    const { id } = req.params
    const post = await prisma.post.update({
      where: {
        id: Number(id)
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    if (!post) reply.code(404).send({ error: `Post with id:${id} was not found` })
    return reply.send(post)
  })
}
