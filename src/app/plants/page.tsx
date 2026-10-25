import { redirect } from "next/navigation";

export default function PlantsPage() {
  redirect("/shop?category=botanical-art");
}
