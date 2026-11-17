import { Webhook } from "svix";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";
import { upsertStreamUser, deleteStreamUser } from "../lib/stream.js";

export async function handleClerkWebhook(req, res) {
  const secret = ENV.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return res.status(500).json({ message: "Webhook secret not configured" });
  }

  const wh = new Webhook(secret);
  let event;
  try {
    event = wh.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const { type, data } = event;

  try {
    if (type === "user.created" || type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const name = `${first_name || ""} ${last_name || ""}`.trim();
      const email = email_addresses?.[0]?.email_address;

      const userDoc = await User.findOneAndUpdate(
        { clerkId: id },
        { clerkId: id, name, email, profileImage: image_url },
        { upsert: true, new: true }
      );

      await upsertStreamUser({
        id: userDoc.clerkId,
        name: userDoc.name,
        image: userDoc.profileImage,
      });

      console.log(`User ${type === "user.created" ? "created" : "updated"}:`, id);
    }

    if (type === "user.deleted") {
      const { id } = data;
      await User.deleteOne({ clerkId: id });
      await deleteStreamUser(id);
      console.log("User deleted:", id);
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
