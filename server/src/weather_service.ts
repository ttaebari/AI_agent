import { CreateWeatherPayload, Weather } from "./weather_types";

export class WeatherService {
  private readonly weathers: Weather[] = [];

  /**
   * find weather
   */
  public async Weather(props: CreateWeatherPayload): Promise<Weather> {
    const response = await fetch(
      `https://goweather.herokuapp.com/weather/${props.location}`,
    );
    const data = await response.json();

    const weather: Weather = {
      location: props.location,
      weather: data.temperature,
    };

    this.weathers.push(weather);
    return weather;
  }

  public getAll(): Weather[] {
    return this.weathers;
  }
}
