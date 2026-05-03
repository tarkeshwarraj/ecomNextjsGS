// src/inngest/client.ts
import "server-only";
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to a database

export const  syncUserCreation = inngest.createFunction(
    { 
        id: 'sync-user-form-clerk'
    },
    {
        event: 'clerk/user.created',
    },
    async ({ event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        console.log("User created event received in Inngest function:");
        const userData = { _id:id, name: first_name + " " + last_name, email: email_addresses[0].email_address, imageUrl: image_url }
        await connectDB();
        await User.create(userData);
        console.log("User data saved to database.");
    }

)


//Inngest function to update user data in database  ( time 56 min)

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated',
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = { _id:id, name: first_name + " " + last_name, email: email_addresses[0].email_address, imageUrl: image_url }
        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
)

//Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    },
    {
        event: 'clerk/user.deleted',
    },
    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)