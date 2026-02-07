import DrawingCanvas from '@/components/DrawingCanvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">SketchGuess Multiplayer</h1>
      <DrawingCanvas />
    </main>
  );
}
