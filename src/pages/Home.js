// import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from "d3"

function Home() {
  // map basic setting
  const ZOOM_THRESHOLD = [1, 7];
  const OVERLAY_MULTIPLIER = 10;
  const OVERLAY_OFFSET = OVERLAY_MULTIPLIER / 2 - 0.5;
  const ZOOM_IN_STEP = 2;
  const ZOOM_OUT_STEP = 1 / ZOOM_IN_STEP;
  const HOVER_COLOR = "rgba(10, 140, 45, 0.4)";
  const CLICK_COLOR = "rgba(10, 140, 45, 0.6)";

  const data = require("../mapdata/tw_new.json");

  const mapRef = useRef(null);
  const navigate = useNavigate()
  // const [selectCounty, setSelectCounty] = useState("");

  useEffect(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    d3.select("#map").remove();

    if (data) {
      const zoom = d3
        .zoom()
        .scaleExtent(ZOOM_THRESHOLD)
        .on("zoom", zoomHandler);

      function zoomHandler() {
        g.attr("transform", d3.zoomTransform(this));
        console.log(d3.zoomTransform(this));
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
        .center([121, 23.58])
        .scale(10000)
        .translate([WIDTH / 2, HEIGHT / 2]);
      // var projection = d3.geoMercator().center([123, 24]).scale(5500);

      // Create a path generator
      const path = d3.geoPath(projection);

      console.log(data.features)
      // Draw the map
      g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id",function(i){return i.properties.COUNTYCODE})
        .style("fill", "rgba(10, 140, 45, 0.2)")
        .style("stroke", "#FFFFF2")
        .style("stroke-width", 0.5)
        .style("cursor", "pointer")
        .on("mouseover", mouseOverHandler)
        .on("mouseout", mouseOutHandler)
        .on("click", clickHandler);
    }
  }, []);

  const mouseOverHandler = function (d, i) {
    if (d3.select(this).style("fill") != CLICK_COLOR) {
      d3.select(this).style("fill", HOVER_COLOR);
    }
  };

  const mouseOutHandler = function (d, i) {
    if (d3.select(this).style("fill") != CLICK_COLOR) {
      d3.select(this).style("fill", "rgba(10, 140, 45, 0.2)");
    }
  };

  const clickHandler = function (d, i, e) {
    d3.select(mapRef.current)
      .selectAll("path")
      .style("fill", "rgba(10, 140, 45, 0.2)");

    d3.select(this).style("fill", CLICK_COLOR);
    
    // const county = i.properties.COUNTYNAME
    const countyid = i.properties.COUNTYCODE
    console.log(countyid)

    navigate(`/${countyid}`)

  };

  const clickReset = function (e) {
    // console.log(e.target.style.fill)
    if (e.target.style.fill === "") {
      d3.select(mapRef.current)
        .selectAll("path")
        .style("fill", "rgba(10, 140, 45, 0.2)");
    }
  };

  return <div ref={mapRef} id="info" onClick={clickReset}></div>;

}

export default Home