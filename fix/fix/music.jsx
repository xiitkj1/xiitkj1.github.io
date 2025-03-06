import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, Library } from "lucide-react";

export default function MusicRecommendation() {
  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-pink-500 text-black rounded-full flex items-center justify-center font-bold">3</div>
        <Button className="bg-green-500 text-black px-4 py-2 rounded-lg">Semua</Button>
        <Button className="bg-gray-700 px-4 py-2 rounded-lg">Musik</Button>
        <Button className="bg-gray-700 px-4 py-2 rounded-lg">Podcast</Button>
      </div>
      <h1 className="text-xl font-bold">Untuk membantu kamu mulai mendengarkan</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card className="bg-gray-800 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="h-40 bg-gray-600 rounded-t-lg"></div>
            <div className="p-2">
              <p className="font-bold">Mix Virgoun</p>
              <p className="text-sm text-gray-400">Batas Senja, Fiersa Besari, dan Nidji</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="h-40 bg-gray-600 rounded-t-lg"></div>
            <div className="p-2">
              <p className="font-bold">Mix Batas Senja</p>
              <p className="text-sm text-gray-400">Virgoun, Nidji, dan Fiersa Besari</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-lg font-bold mt-6">Coba yang lain</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card className="bg-gray-800 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="h-40 bg-gray-600 rounded-t-lg"></div>
            <div className="p-2">
              <p className="font-bold">Top Indonesian Tracks 2023</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="h-40 bg-gray-600 rounded-t-lg"></div>
            <div className="p-2">
              <p className="font-bold">Spill</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex justify-around items-center border-t border-gray-700">
        <Home className="text-white w-6 h-6" />
        <Search className="text-white w-6 h-6" />
        <Library className="text-white w-6 h-6" />
      </div>
    </div>
  );
}
