import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Lightbulb } from "lucide-react";

export default function AIWebUI() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">What can I help with?</h1>
        <div className="relative flex items-center bg-gray-900 rounded-lg p-2 w-96">
          <Input
            className="bg-transparent border-none flex-1 text-white px-2 outline-none"
            placeholder="Ask anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="mr-2">
            <Globe className="text-white" size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Lightbulb className="text-white" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
