import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// FontAwesome
import {
  faSun,
  faCloudSun,
  faCloud,
  faCloudShowersHeavy,
  faCloudSunRain,
} from "@fortawesome/free-solid-svg-icons";

// Styles
import "../styles/styles.css";

function WeatherForecast(props) {
  const { County, weather } = props;

  // 天氣狀態icon
  function seticon(vin) {
    const v=vin[0];
    if (v === "01") {
      return <FontAwesomeIcon icon={faSun} />;
    } else if (v === "02" || v === "03") {
      return <FontAwesomeIcon icon={faCloudSun} />;
    } else if (v === "04" || v === "05" || v === "06" || v === "07") {
      return <FontAwesomeIcon icon={faCloud} />;
    } else if (
      v === "08" ||
      v === "09" ||
      v === "10" ||
      v === "11" ||
      v === "12" ||
      v === "13" ||
      v === "14" ||
      v === "15" ||
      v === "16" ||
      v === "17" ||
      v === "18"
    ) {
      return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
    } else if (v === "19") {
      return <FontAwesomeIcon icon={faCloudSunRain} />;
    } else if (v === "20" || v === "21" || v === "22") {
      return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
    } else {
      return <FontAwesomeIcon icon={faCloud} />;
    }
  }

  return (
    <>
      <div className="weatherForecast d-flex">
        {weather[0] &&
          weather[0].weatherElement[0].time
            ?.filter((el, i) => {
              return el.endTime.split(" ")[1].split(":")[0] === "06";
            })
            ?.map((el, i) => {
              const dateTime = new Date(el.startTime);
              const date = el.startTime;
              const daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              const dayOfWeek = daysOfWeek[dateTime.getUTCDay()]
                .toUpperCase()
                .substring(0, 3);
              return (
                <>
                  <div key={i} className="forecastOfDay flex-fill">
                    <h2>{dayOfWeek}</h2>
                    <div className="icon">
                      {seticon(
                        weather[0] &&
                          weather[0].weatherElement[1].time?.filter((el, i) => {
                            return (
                               el.endTime.split(" ")[1].split(":")[0] === "06"
                            );
                          })?.filter((el,i)=>{
                            return date === el.startTime
                          })?.map((el)=>{
                            return el.elementValue[1].value
                          })
                      )}
                    </div>
                    <p className="temp mb-0">{
                        weather[0] && weather[0].weatherElement[2].time?.filter((el,i)=>{
                            return date === el.startTime
                        })?.map((el,i)=>{
                            return el.elementValue[0].value
                        })
                    }°-{
                        weather[0] && weather[0].weatherElement[3].time?.filter((el,i)=>{
                            return (
                               el.endTime.split(" ")[1].split(":")[0] === "18"
                            );
                        })?.filter((el,i)=>{
                            return date.split(' ')[0] === el.startTime.split(' ')[0]
                        })?.map((el,i)=>{
                            return el.elementValue[0].value
                        })
                    }°</p>
                  </div>
                </>
              );
            })}
      </div>
    </>
  );
}

export default WeatherForecast;
