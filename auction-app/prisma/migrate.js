const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    connectionString: "postgresql://postgres.hqxyrqndrixrtyjxerkk:Waterboy1!!!x12w@aws-0-us-west-2.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
})

async function main() {
    const client = await pool.connect()
    console.log('✅ Connected to database!')

    try {
        // Create enums
        await client.query(`DO $$ BEGIN
      CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
      EXCEPTION WHEN duplicate_object THEN null;
    END $$;`)

        await client.query(`DO $$ BEGIN
      CREATE TYPE "AuctionStatus" AS ENUM ('ACTIVE', 'CLOSED');
      EXCEPTION WHEN duplicate_object THEN null;
    END $$;`)

        // Create User table
        await client.query(`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "name" TEXT,
      "email" TEXT UNIQUE,
      "emailVerified" TIMESTAMP,
      "image" TEXT,
      "password" TEXT,
      "role" "Role" NOT NULL DEFAULT 'USER',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );`)
        console.log('✅ User table ready')

        // Create Account table
        await client.query(`CREATE TABLE IF NOT EXISTS "Account" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "providerAccountId" TEXT NOT NULL,
      "refresh_token" TEXT,
      "access_token" TEXT,
      "expires_at" INTEGER,
      "token_type" TEXT,
      "scope" TEXT,
      "id_token" TEXT,
      "session_state" TEXT,
      CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId"),
      CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    );`)
        console.log('✅ Account table ready')

        // Create Session table
        await client.query(`CREATE TABLE IF NOT EXISTS "Session" (
      "id" TEXT NOT NULL,
      "sessionToken" TEXT NOT NULL UNIQUE,
      "userId" TEXT NOT NULL,
      "expires" TIMESTAMP NOT NULL,
      CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    );`)
        console.log('✅ Session table ready')

        // Create VerificationToken table
        await client.query(`CREATE TABLE IF NOT EXISTS "VerificationToken" (
      "identifier" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "expires" TIMESTAMP NOT NULL,
      CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
    );`)
        console.log('✅ VerificationToken table ready')

        // Create Auction table
        await client.query(`CREATE TABLE IF NOT EXISTS "Auction" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "images" TEXT[] NOT NULL DEFAULT '{}',
      "currentBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "buyoutPrice" DOUBLE PRECISION,
      "endDate" TIMESTAMP NOT NULL,
      "status" "AuctionStatus" NOT NULL DEFAULT 'ACTIVE',
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
    );`)
        console.log('✅ Auction table ready')

        // Create Bid table
        await client.query(`CREATE TABLE IF NOT EXISTS "Bid" (
      "id" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "userId" TEXT NOT NULL,
      "auctionId" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Bid_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE
    );`)
        console.log('✅ Bid table ready')

        // Create Event table
        await client.query(`CREATE TABLE IF NOT EXISTS "Event" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "date" TIMESTAMP NOT NULL,
      "image" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
    );`)
        console.log('✅ Event table ready')

        // Create Blog table
        await client.query(`CREATE TABLE IF NOT EXISTS "Blog" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "authorId" TEXT NOT NULL,
      "image" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
    );`)
        console.log('✅ Blog table ready')

        // Upsert admin user
        const { createId } = require('@paralleldrive/cuid2')
        const id = createId ? createId() : 'admin-user-' + Date.now()
        const hashedPassword = await bcrypt.hash('Waterboy1!!!', 10)

        await client.query(`
      INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
      VALUES ($1, 'hburnside99@gmail.com', 'Admin', $2, 'ADMIN', NOW(), NOW())
      ON CONFLICT ("email") DO UPDATE
      SET "password" = $2, "role" = 'ADMIN', "updatedAt" = NOW()
      RETURNING "email", "role"
    `, [id, hashedPassword])

        console.log('✅ Admin user hburnside99@gmail.com created/updated with role ADMIN')

    } finally {
        client.release()
        await pool.end()
    }
}

main().catch(e => {
    console.error('❌ Error:', e.message)
    process.exit(1)
})
