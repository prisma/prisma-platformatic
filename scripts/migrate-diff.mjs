import { execaCommand } from 'execa'
import path from "path";
import fs from "fs";
import { detect } from 'detect-package-manager'

const migrationsDir = path.join(process.cwd(), "migrations")

async function generateMigration() {
  console.log("📝 Generating a migration")
  const pkgManager = await detect()
  let command = 'npx'

  switch (pkgManager) {
    case 'npm':
      command = 'npx'
      break;
    case 'yarn':
      command = 'yarn'
      break;
    case 'pnpm':
      command = 'pnpx'
      break;
    default:
      command = 'npx'
  }

  const migrations = fs.readdirSync(migrationsDir)
  const latestMigration = migrations.length ? migrations[ migrations.length - 1 ] : null;

  /**
  * Read /migrations directory
  * find last migration file
  * if empty, create the first version
  * else create the next migration file for use in
  */

  const latestMigrationVersion = latestMigration ? Number(latestMigration.replace('.do.sql', '')) : 0;
  let nextMigrationVersion;

  if (!latestMigration) {
    nextMigrationVersion = latestMigrationVersion + 1
  }

  if (latestMigrationVersion < 10) {
    nextMigrationVersion = `00${latestMigrationVersion + 1}`
  } else if (latestMigrationVersion >= 10 && latestMigrationVersion <= 100) {
    nextMigrationVersion = `0${latestMigrationVersion + 1}`
  }

  try {
    const { stdout } = await execaCommand(`${command} prisma migrate diff --from-schema-datasource ./prisma/schema.prisma --to-schema-datamodel ./prisma/schema.prisma --script`)

    if (!stdout.includes('empty migration')) {
      fs.appendFile(`migrations/${nextMigrationVersion}.do.sql`, stdout, (err) => {
        if (err) throw err
      })
      console.log(`Generated migration: ${nextMigrationVersion}.do.sql`)
      console.log('✅ Done')
    } else {
      console.log('📭 No new migration was generated.')
    }
  } catch (error) {
    console.log(error.message)
  }
}

generateMigration()