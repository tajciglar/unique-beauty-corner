import { Bodoni_Moda } from "next/font/google"; 

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="grid grid-rows-2 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-[30%] mr-[30%]">
          <h1 className={`${bodoniModa.variable} text-7xl font-bol m-3`} style={{ fontFamily: 'var(--font-bodoni-moda) !important' }}>Unique Beauty Corner</h1>
          <p className="italic">Dobrodošli v Unique Beauty Corner</p>
        </div>
        <div className="w-3/4 flex flex-col items-center gap-4">
          <button type="button" className="px-3 py-2 rounded-lg w-1/4">Naroči se</button>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center w-3/4 flex flex-col items-center p-10">
          <h2 className="text-3xl font-bold mb-8">Storitve</h2>
          <div className="w-3/4 flex justify-center gap-6">
          <h3>Izberi storitev</h3>
            <div className="border border-gray-200 p-4 w-1/4 shadow-lg">
              <img alt="Slika" />
              <p>Nohti</p>
              <button>Izberi</button>
            </div>
            <div className="border border-gray-200 p-4 w-1/4 shadow-lg">
              <img alt="Slika" />
              <p>Nohti</p>
              <button>Izberi</button>
            </div>
            <div className="border border-gray-200 p-4 w-1/4 shadow-lg">
              <img alt="Slika" />
              <p>Nohti</p>
              <button>Izberi</button>
            </div>
            <div className="border border-gray-200 p-4 w-1/4 shadow-lg">
              <img alt="Slika" />
              <p>Nohti</p>
              <button>Izberi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}