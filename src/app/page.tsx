import ArcgisLeafletMap from "./components/ArcgisLeafletMap";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-bold mb-4">ArcGIS Leaflet + OpenWeather Example</h1>
        <ArcgisLeafletMap
            height="600px"
            width="800px"
            basemapId="ArcGIS:Topographic"
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
