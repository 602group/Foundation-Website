const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const pool = new Pool({
    connectionString: "postgresql://postgres.hqxyrqndrixrtyjxerkk:Waterboy1!!!x12w@aws-0-us-west-2.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
})

async function main() {
    const client = await pool.connect()
    console.log('Connected to database!')

    const id = crypto.randomUUID()
    const hash = await bcrypt.hash('Waterboy1!!!', 10)

    const res = await client.query(
        `INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
     VALUES ($1, 'hburnside99@gmail.com', 'Admin', $2, 'ADMIN', NOW(), NOW())
     ON CONFLICT ("email") DO UPDATE SET "password" = $2, "role" = 'ADMIN', "updatedAt" = NOW()
     RETURNING "email", "role"`,
        [id, hash]
    )

    console.log('Admin user ready:', res.rows[0])
    client.release()
    await pool.end()
}

main().catch(e => { console.error('Error:', e.message); process.exit(1) })
