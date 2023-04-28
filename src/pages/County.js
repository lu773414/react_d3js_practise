import { useParams } from "react-router-dom";
import axios from "axios";
import * as d3 from "d3";
import { createContext, useEffect, useState, useRef } from "react";
import WeatherSlider from "../component/WeatherSlider";
import WeatherForecast from "../component/WeatherForecast";
import "../styles/styles.css";

export const WeatherContext = createContext({});

function County() {
  // let { id } = useParams();
  const id = '65000';
  const [slideNow, setSlideNow] = useState(0);

  const ZOOM_THRESHOLD = [1, 1];

  // map data
  const data = require("../mapdata/tw_new.json");

  const site = data.features.filter(function (item) {
    return item.properties.COUNTYCODE === id; // 取得城市的id
  });

  const lon = site[0].properties.COUNTYCENTER[0];
  const lat = site[0].properties.COUNTYCENTER[1];
  const county = site[0].properties.COUNTYNAME;

  const mapRef = useRef(null);

  // weather data
  const [weather, setWeather] = useState([]);
  const [weatherNow, setWeatherNow] = useState([]);

  // get weather data
  const getWeatherData = async () => {
    try {
      const response = await axios.get(
        "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DC624EB8-BAF7-4C0D-94AE-FE5108A7450B&format=JSON&elementName=MinT,MaxT,PoP12h,Wx"
      );
      // console.log('weather data:', response.data.records.locations[0].location)
      return response.data.records.locations[0].location;
    } catch (err) {
      console.error(err);
    }
  };

  const getWeatherDataNow = async () => {
    try {
      const response = await axios.get(
        "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-DC624EB8-BAF7-4C0D-94AE-FE5108A7450B&elementName=TEMP,Weather&parameterName=CITY"
      );
      // console.log('obsevation data:', response.data.records.location)
      return response.data.records.location;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    d3.select("#map").remove();

    // read weather data
    const fetchData = async () => {
      try {
        const weatherData = await getWeatherData();
        const weatherDataNow = await getWeatherDataNow();
        const weatherFilterNow = weatherDataNow.filter((el, i) => {
          return el.parameter[0].parameterValue === county;
        });
        const weatherFilter = weatherData.filter((el, i) => {
          return el.locationName === county;
        });
        setWeather(weatherFilter);
        setWeatherNow(weatherFilterNow);
        // console.log('catch data')
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    // read map data & draw
    const zoom = d3.zoom().scaleExtent(ZOOM_THRESHOLD).on("zoom", zoomHandler);

    function zoomHandler() {
      g.attr("transform", d3.zoomTransform(this));
      // console.log(d3.zoomTransform(this));
    }

    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .attr("id", "map")
      .attr("width", "100%")
      .attr("height", "100%");

    const g = svg
      .call(zoom)
      .append("g")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("id", "mapZoom");

    g.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("transform", `translate(-${WIDTH},-${HEIGHT})`)
      .style("fill", "none")
      .style("pointer-events", "all");

    // Create a new projection
    const projection = d3
      .geoMercator()
      .center([lon, lat])
      .scale(45000)
      .translate([WIDTH / 2 + 300, HEIGHT / 2 + 100]);
    // var projection = d3.geoMercator().center([123, 24]).scale(5500);

    if (data) {
      // Create a path generator
      const path = d3.geoPath(projection);

      // Draw the map
      g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function (i) {
          return i.properties.COUNTYCODE;
        })
        .style("fill", function (i) {
          if (i.properties.COUNTYCODE === id) {
            return "rgba(10, 140, 45, 0.6)";
          } else {
            return "rgba(10, 140, 45, 0.2)";
          }
        })
        .style("stroke", "#FFFFF2")
        .style("stroke-width", 0.5);

    }
  }, []);

  return (
    <>
      <WeatherContext.Provider value={{ slideNow, setSlideNow }}>
        <div ref={mapRef} id="info"></div>
        <WeatherSlider
          County={county}
          weather={weather}
          weatherNow={weatherNow}
          lat={lat}
          lon={lon}
        />
        <WeatherForecast County={county} weather={weather}/>
      </WeatherContext.Provider>
    </>
  );
}

export default County;
