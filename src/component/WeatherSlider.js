import React, { useContext, useEffect, useRef } from "react";
import * as d3 from "d3";
import Slider from "react-slick";
import { WeatherContext } from "../pages/County";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/styles.css";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudSunRain,
} from "@fortawesome/free-solid-svg-icons";

function WeatherSlider(props) {
  const { County, weatherNow, lat, lon } = props;
  const { slideNow, setSlideNow } = useContext(WeatherContext);

  // station click event
  const clickHandler = function (d, i, e) {
    console.log(i);
    console.log(this.id.split("")[this.id.length - 1]);
    sliderRef.current.slickGoTo(this.id.split("")[this.id.length - 1]);
  };

  // 初始d3測站位置繪製
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const projection = d3
    .geoMercator()
    .center([lon, lat])
    .scale(45000)
    .translate([WIDTH / 2 + 300, HEIGHT / 2 + 100]);

  if (weatherNow.length > 0) {
    d3.select("#landmark").remove();
    d3.selectAll("circle").remove();

    d3.select("#mapZoom")
      .append("svg")
      .attr("id", "landmark")
      .attr("class", "landmark")
      .attr("width", "35")
      .attr("height", "35")
      .attr("viewBox", "0 0 38 38")
      .attr(
        "x",
        projection([weatherNow[slideNow].lon, weatherNow[slideNow].lat])[0] -
          17.5
      )
      .attr(
        "y",
        projection([weatherNow[slideNow].lon, weatherNow[slideNow].lat])[1] - 25
      )
      .append("path")
      .attr(
        "d",
        "M33.25 15.834C33.25 26.9173 19 36.4173 19 36.4173C19 36.4173 4.75 26.9173 4.75 15.834C4.75 12.0546 6.25133 8.43011 8.92373 5.75771C11.5961 3.08532 15.2207 1.58398 19 1.58398C22.7793 1.58398 26.4039 3.08532 29.0763 5.75771C31.7487 8.43011 33.25 12.0546 33.25 15.834Z"
      )
      .style("fill", "#F3C969");

    d3.select("#mapZoom")
      .selectAll("circle")
      .data(weatherNow)
      .enter()
      .append("circle")
      .attr("id", function (d, i) {
        return i;
      })
      .attr("cx", function (d) {
        return projection([d.lon, d.lat])[0];
      })
      .attr("cy", function (d) {
        return projection([d.lon, d.lat])[1];
      })
      .attr("r", 5)
      .style("fill", "#FBEDC4")
      .style("cursor", "pointer")
      .on("click", clickHandler);

    d3.select("circle")
      .transition()
      .duration(750)
      .attr("transform", "translate(0,-10)");
  }

  useEffect(() => {
    if (weatherNow.length > 0) {
      const weatherNowPlot = weatherNow.filter((el, i) => {
        return el.stationId !== weatherNow[slideNow].stationId;
      });

      d3.select("#landmark").remove();
      d3.selectAll("circle").remove();

      d3.select("#mapZoom")
        .append("svg")
        .attr("id", "landmark")
        .attr("class", "landmark")
        .attr("width", "35")
        .attr("height", "35")
        .attr("viewBox", "0 0 38 38")
        .attr(
          "x",
          projection([weatherNow[slideNow].lon, weatherNow[slideNow].lat])[0] -
            17.5
        )
        .attr(
          "y",
          projection([weatherNow[slideNow].lon, weatherNow[slideNow].lat])[1] -
            25
        )
        .append("path")
        .attr(
          "d",
          "M33.25 15.834C33.25 26.9173 19 36.4173 19 36.4173C19 36.4173 4.75 26.9173 4.75 15.834C4.75 12.0546 6.25133 8.43011 8.92373 5.75771C11.5961 3.08532 15.2207 1.58398 19 1.58398C22.7793 1.58398 26.4039 3.08532 29.0763 5.75771C31.7487 8.43011 33.25 12.0546 33.25 15.834Z"
        )
        .style("fill", "#F3C969");

      d3.select("#mapZoom")
        .selectAll("circle")
        .data(weatherNow)
        .enter()
        .append("circle")
        .attr("id", function (d, i) {
          return "circle" + i;
        })
        .attr("cx", function (d) {
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function (d) {
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", 5)
        .style("fill", "#FBEDC4")
        .style("cursor", "pointer")
        .on("click", clickHandler);

      let id = `#circle${slideNow}`;
      console.log(id);
      d3.select(id)
        .transition()
        .duration(750)
        .attr("transform", "translate(0,-10)");
    }
  }, [slideNow]);

  // weather iecon setting
  function seticon(v) {
    if (v.includes("晴")) {
      return <FontAwesomeIcon icon={faSun} />;
    } else if (v.includes("陰")) {
      return <FontAwesomeIcon icon={faCloud} />;
    } else if (v.includes("雲")) {
      return <FontAwesomeIcon icon={faCloudSun} />;
    } else if (v.includes("雨")) {
      return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
    }
  }

  // react slider setting
  const sliderRef = useRef();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (i) => {
      console.log(i);
      setSlideNow(i);
    },
  };

  return (
    <>
      <div className="weatherSlider">
        <Slider ref={sliderRef} {...settings}>
          {weatherNow
            .filter((el, i) => {
              return el.parameter[0].parameterValue === County;
            })
            .map((el, i) => {
              return (
                <>
                  <div
                    key={i}
                    className="weatherBox d-flex flex-column justify-content-between"
                  >
                    <div className="d-flex up justify-content-between">
                      <div className="icon">
                        {seticon(el.weatherElement[1].elementValue)}
                      </div>
                      <div>
                        <h3 className="text-end">{County}</h3>
                        <p className="text-end">{el.locationName}</p>
                      </div>
                    </div>
                    <div className="d-flex down justify-content-between align-items-end">
                      <div>
                        <h2>{el.weatherElement[0].elementValue}°C</h2>
                      </div>
                      <div>
                        <p className="justify-content-end text-end">
                          {el.weatherElement[1].elementValue}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </Slider>
      </div>
    </>
  );
}

export default WeatherSlider;
