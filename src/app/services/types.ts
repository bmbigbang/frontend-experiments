export type WeatherLayerConfig = {
  id: OpenWeatherLayerId;
  urlTemplate: string;
  opacity?: number;
  label: string;
};


export const openWeatherLayerId = ["precipitation_new", "clouds_new", "pressure_new", "wind_new", "temp_new"] as const;
export type OpenWeatherLayerId = typeof openWeatherLayerId[number];

export enum OpenWeatherLayerName {
  "precipitation_new" = "Precipitation",
  "clouds_new" = "Clouds",
  "pressure_new" = "Pressure",
  "wind_new" = "Wind",
  "temp_new" = "Temperature",
}