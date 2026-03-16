import fs from "fs";
import path from "path";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const dataFilePath = path.join(process.cwd(), "content.json");
  let data;
  try {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to read content file:", error);
    data = {};
  }

  return (
    <main className="w-full">
      <LandingPage initialData={data} />
    </main>
  );
}
