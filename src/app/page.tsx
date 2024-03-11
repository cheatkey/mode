import Image from "next/image";
import MyButton from "./components/MyButton";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MyButton />
    </main>
  );
}
