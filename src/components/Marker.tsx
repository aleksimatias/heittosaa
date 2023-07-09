import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import moment from "moment-timezone";
import { Box, Text, VStack, HStack, Heading, Image, Flex, Divider, Tag, useBreakpointValue } from "@chakra-ui/react";
import { WiRaindrop } from "react-icons/wi";
import { MdNorth, MdNorthEast, MdNorthWest, MdSouth, MdSouthEast, MdSouthWest, MdWest, MdEast } from "react-icons/md";
import "../Leaflet.css";
import { LocationType, WeatherBoxProps, WeatherData } from "../types";
import markerIcon from "../assets/marker-icon.png";
import { Icon } from "leaflet";

const myIcon = new Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
});

const transformDate = (date: number) => {
  return moment.unix(date).tz("Europe/Helsinki");
};

const roundTemperature = (temperature: number): number => {
  return Math.round(temperature);
};

function getWindDirectionIcon(deg: number) {
  if ((deg >= 337.5 && deg <= 360) || (deg >= 0 && deg < 22.5)) {
    return <MdNorth color="black" />;
  } else if (deg >= 22.5 && deg < 67.5) {
    return <MdNorthEast color="black" />;
  } else if (deg >= 67.5 && deg < 112.5) {
    return <MdEast color="black" />;
  } else if (deg >= 112.5 && deg < 157.5) {
    return <MdSouthEast color="black" />;
  } else if (deg >= 157.5 && deg < 202.5) {
    return <MdSouth color="black" />;
  } else if (deg >= 202.5 && deg < 247.5) {
    return <MdSouthWest color="black" />;
  } else if (deg >= 247.5 && deg < 292.5) {
    return <MdWest color="black" />;
  } else if (deg >= 292.5 && deg < 337.5) {
    return <MdNorthWest color="black" />;
  }
}

const parseForecastDate = (dateStr: string) => {
  const dateOnlyStr = dateStr.split(" ")[0];
  const [year, month, day] = dateOnlyStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const WeatherBox: React.FC<WeatherBoxProps> = ({ forecast }) => {
  const startTime = transformDate(forecast.dt);
  const endTime = moment(startTime).add(3, "hours");
  const timeRange = `${startTime.format("HH")} - ${endTime.format("HH")}`;
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

  return (
    <Flex
      direction="column"
      align="center"
      justify="space-evenly"
      h="100%"
      w="7em"
      minW="7em"
      maxW="7em"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      px="2"
      /* bgColor="gray.300" */
      boxShadow="md"
    >
      <Box mb="-7">
        <Image mb="-4" src={iconUrl} alt={forecast.weather[0].description} boxSize="50px" />
        {forecast.rain && forecast.rain["3h"] ? (
          <Flex mb="-6" direction="row" alignItems="center" justifyContent="center">
            <WiRaindrop color="gray" size="16px" />
            <Text ml="2" fontSize="2xs" color="blue.500">
              {forecast.rain["3h"]} mm
            </Text>
          </Flex>
        ) : (
          <Flex mb="-6" direction="row" alignItems="center" justifyContent="center">
            <WiRaindrop color="gray" size="16px" />
            <Text ml="2" fontSize="2xs" color="blue.500">
              0.00 mm
            </Text>
          </Flex>
        )}
        <Box textAlign="center">
          <Box mb="-6">
            <Text color="black" fontSize="xl">
              {roundTemperature(forecast.main.temp)}°C
            </Text>
          </Box>
          <Text fontSize="2xs" color="gray.500">
            {roundTemperature(forecast.main.feels_like)}°C
          </Text>
        </Box>
      </Box>

      <Flex mt="2" mb="-8" px="2" flexDir="row" justify="space-between" align="center" w="100%">
        <Box mb="-3px">{getWindDirectionIcon(forecast.wind.deg)}</Box>
        <Text fontWeight="bold" fontSize="md" color="black">
          {roundTemperature(forecast.wind.speed)}
        </Text>
        <Box mt="4px">
          <Text fontSize="xs" color="gray.500">
            ({roundTemperature(forecast.wind.gust)})
          </Text>
        </Box>
      </Flex>
      <Text fontSize="2xs" fontWeight="bold">
        m/s
      </Text>
      <Divider borderColor="white" />
      <Box mt="-4">
        <Text color="black" fontSize="sm" fontWeight="bold">
          {timeRange}
        </Text>
      </Box>
    </Flex>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MarkerWithWeather = ({ location }: { location: LocationType }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const currentDateString = moment().tz("Europe/Helsinki").format("YYYY-MM-DD");
  const currentDate = parseForecastDate(currentDateString);

  const allowedTimes = ["06:00", "09:00", "12:00", "15:00", "18:00"];

  const todaysForecasts = weatherData?.list.filter((forecast) => {
    const forecastDate = parseForecastDate(forecast.dt_txt);
    const forecastTime = forecast.dt_txt.split(" ")[1].substring(0, 5);
    return forecastDate.getTime() === currentDate.getTime() && allowedTimes.includes(forecastTime);
  });

  const tomorrowDateString = moment().add(1, "days").tz("Europe/Helsinki").format("YYYY-MM-DD");
  const tomorrowDate = parseForecastDate(tomorrowDateString);

  const tomorrowsForecasts = weatherData?.list.filter((forecast) => {
    const forecastDate = parseForecastDate(forecast.dt_txt);
    const forecastTime = forecast.dt_txt.split(" ")[1].substring(0, 5);
    return forecastDate.getTime() === tomorrowDate.getTime() && allowedTimes.includes(forecastTime);
  });

  const handleClick = async () => {
    setLoading(true);
    const data = await fetchWeatherData(location[1] as number, location[2] as number);
    setWeatherData(data);
    setLoading(false);
  };

  const fetchWeatherData = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) {
      throw new Error("forecast error");
    }

    const weatherData = await res.json();
    return weatherData;
  };

  const boxWidth = useBreakpointValue({ base: "320px", md: "500px" });
  const forecastWidth = useBreakpointValue({ base: "320px", md: "850px" });

  return (
    <Marker
      icon={myIcon}
      position={[location[1] as number, location[2] as number]}
      eventHandlers={{ click: handleClick }}
    >
      <Popup maxWidth={850}>
        <Box width={boxWidth}>
          {loading && <Text>Ladataan..</Text>}
          <Flex justify="space-between" align="center" m="0" p="0" flexDir="row" w="100%">
            <Text fontSize="sm">{location[0]}</Text>
            <Box>
              <Tag size="sm" colorScheme="blue" m={1}>
                {location[5]}
              </Tag>
              <Tag size="sm" colorScheme="green" m={1}>
                {location[4]} väylää
              </Tag>
            </Box>
          </Flex>

          <VStack align="start" spacing="4">
            {todaysForecasts && todaysForecasts.length > 0 && (
              <>
                <Heading textTransform="uppercase" size="md">
                  Tänään {moment(currentDate).format("D.M.")}
                </Heading>
                <HStack width={forecastWidth} spacing="2" overflowY="hidden" overflowX="auto" whiteSpace="nowrap">
                  {todaysForecasts?.map((forecast, index) => (
                    <WeatherBox key={index} forecast={forecast} />
                  ))}
                </HStack>
              </>
            )}

            <Heading textTransform="uppercase" size="md">
              Huomenna {moment(tomorrowDate).format("D.M.")}
            </Heading>
            <HStack width={forecastWidth} spacing="2" overflowY="hidden" overflowX="auto" whiteSpace="nowrap">
              {tomorrowsForecasts?.map((forecast, index) => (
                <WeatherBox key={index} forecast={forecast} />
              ))}
            </HStack>
          </VStack>
        </Box>
      </Popup>
    </Marker>
  );
};
