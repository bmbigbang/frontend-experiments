import React from "react";
import type { WeatherLayerConfig, OpenWeatherLayerId } from "@/app/types";

type WeatherLayerLegendProps = {
  layers: WeatherLayerConfig[];
  activeLayerIds: OpenWeatherLayerId[];
  onToggleLayer: (id: OpenWeatherLayerId) => void;
};

export function WeatherLayerLegend({
  layers,
  activeLayerIds,
  onToggleLayer,
}: WeatherLayerLegendProps) {
  if (!layers.length) return null;

  return (
      <section
          className="inline-flex flex-col gap-2 rounded-lg border border-slate-300 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm"
          aria-label="Active data layers"
      >
        <header className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Active data layers
        </span>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          {layers.map((layer) => {
            const isActive = activeLayerIds.includes(layer.id);

            return (
                <button
                    key={layer.id}
                    type="button"
                    onClick={() => onToggleLayer(layer.id)}
                    className={[
                      "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition",
                      isActive
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                    ].join(" ")}
                >
              <span
                  className={[
                    "h-2 w-2 rounded-full",
                    isActive ? "bg-blue-500" : "bg-slate-300",
                  ].join(" ")}
              />
                  <span>{layer.label}</span>
                </button>
            );
          })}
        </div>
      </section>
  );
}