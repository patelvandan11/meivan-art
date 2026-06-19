"use server";

export async function subscribeNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email" };
  }

  // In production, save to database via Prisma
  // await prisma.newsletter.create({ data: { email } });

  return { success: true, message: "Subscribed successfully" };
}
