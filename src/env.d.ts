/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import("astro").Session | null;
  }

  interface SessionData {
    user: {
      id: string;
      email: string;
      role: "admin" | "user";
    };
  }
}