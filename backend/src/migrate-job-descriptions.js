/**
 * Migration: merge mockjobinfos + resumejobinfos → jobinfos
 *
 * Run once from the backend directory:
 *   node src/migrate-job-descriptions.js
 *
 * Safe to re-run — uses insertMany with ordered:false so duplicate _id
 * errors are caught and skipped individually.
 */

import mongoose from "mongoose";
import { ENV } from "./lib/env.js";

await mongoose.connect(ENV.MONGODB_URI);
console.log("Connected to MongoDB");

const db = mongoose.connection.db;

const mockDocs = await db.collection("mockjobinfos").find({}).toArray();
const resumeDocs = await db.collection("resumejobinfos").find({}).toArray();

console.log(`Found ${mockDocs.length} mockjobinfos, ${resumeDocs.length} resumejobinfos`);

// Combine both arrays; duplicates (same _id) will be skipped by the catch below
const allDocs = [...mockDocs, ...resumeDocs];

if (allDocs.length === 0) {
  console.log("Nothing to migrate.");
  await mongoose.disconnect();
  process.exit(0);
}

try {
  const result = await db.collection("jobinfos").insertMany(allDocs, { ordered: false });
  console.log(`Inserted ${result.insertedCount} documents into jobinfos`);
} catch (err) {
  // ordered:false means partial success is possible; BulkWriteError lists what was skipped
  if (err.code === 11000 || err.name === "MongoBulkWriteError") {
    const inserted = err.result?.nInserted ?? err.insertedCount ?? "unknown";
    console.log(`Inserted ${inserted} documents (duplicates skipped)`);
  } else {
    console.error("Migration error:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

await mongoose.disconnect();
console.log("Migration complete.");
