import SunCalc from "suncalc";
import addDays from "date-fns/addDays";
import differenceInSeconds from "date-fns/differenceInSeconds";

const getSunCalc = (position: GeolocationPosition) => {
  const { latitude, longitude } = position.coords;
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const todaySunCalc = SunCalc.getTimes(today, latitude, longitude);
  const tomorrowSunCalc = SunCalc.getTimes(tomorrow, latitude, longitude);

  const seconds = differenceInSeconds(
    tomorrowSunCalc.sunrise,
    todaySunCalc.sunrise
  );
  const daySeconds = differenceInSeconds(
    todaySunCalc.sunset,
    todaySunCalc.sunrise
  );
  const currentSeconds = differenceInSeconds(today, todaySunCalc.sunrise);

  return {
    dayPercentage: Number(((daySeconds / seconds) * 100).toFixed(3)),
    currentPercentage: Number(((currentSeconds / seconds) * 100).toFixed(3)),
  };
};

export { getSunCalc };
