import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";
import Autocomplete from "./components/Autocomplete";
import Filters from "./components/Filters";
import ListItem from "./components/ListItem";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MainContainer = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
`;
const MapContainer = styled.div`
  width: 100%;
  min-height: 75vh;
`;

const SectionMap = styled.div`
  display: flex;
`;
const FiltersContainer = styled.div`
  min-width: 20%;
  text-align: center;
  background-color: #f3f2f1;
`;

const ListSection = styled.div`
  width: 70%;
  margin: 0 auto;
`;

function App() {
  const [mapManager, setMapManager] = useState();
  const [mapConfig, setMapConfig] = useState({
    lng: 12.1539,
    lat: 42.1048,
    zoom: 5.46,
  });
  const [markers, setMarkers] = useState([]);
  const [positions, setPositions] = useState([]);

  const mapContainer = useRef(null);

  const onSelect = (elm) => {
    mapManager.flyTo({ center: elm.center, zoom: 12 });
    const marker = new mapboxgl.Marker()
      .setLngLat(elm.center)
      .setPopup(new mapboxgl.Popup().setText("La tua posizione"));

    marker.addTo(mapManager);
    addMarkers([marker]);
  };

  const addMarkers = useCallback(
    (toAddMarkers) => {
      setMarkers([...markers, ...toAddMarkers]);
    },
    [markers]
  );

  const sanitizePosition = (position) => {
    return fetch(position._links["wp:featuredmedia"][0].href)
      .then((data) => data.json())
      .then((dataParsed) => ({
        id: position.id,
        name: position.title.rendered,
        content: position.content.rendered,
        center: position.excerpt.rendered
          .replace("<p>", "")
          .replace("</p>", "")
          .replace("\n", "")
          .replace(" ", "")
          .split(",")
          .reverse(),
        image: dataParsed.media_details.sizes.medium_large.source_url,
        category: position.portfolio_entries,
      }));
  };

  const changeFilter = (filterValue) => {
    setPositions(
      positions.filter((position) => position.category === filterValue)
    );
  };

  useEffect(() => {
    if (!mapManager) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [mapConfig.lng, mapConfig.lat],
        zoom: mapConfig.zoom,
        attributionControl: false,
        renderWorldCopies: false,
      });
      map.on("move", () => {
        setMapConfig({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2),
        });
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));
      map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 80,
        })
      );
      setMapManager(map);
    } else {
      if (!positions.length) {
        fetch("http://nuovasimonelli-test.nautes.eu/wp-json/wp/v2/portfolio")
          .then((data) => data.json())
          .then((dataParsed) => {
            Promise.all(
              dataParsed.map((position) => sanitizePosition(position))
            ).then((data) => setPositions(data));
          });
      }
    }
  }, [
    addMarkers,
    mapConfig.lat,
    mapConfig.lng,
    mapConfig.zoom,
    mapManager,
    positions,
  ]);


  const getBounds = () => {
    let northeast = [];
    let southwest = [];

    markers.forEach(({ _lngLat }) => {
      if (northeast.length === 0) {
        northeast = [_lngLat.lng, _lngLat.lat];
        southwest = [_lngLat.lng, _lngLat.lat];
      } else {
        if (_lngLat.lat < southwest[1]) {
          southwest[1] = _lngLat.lat;
        }
        if (_lngLat.lat > northeast[1]) {
          northeast[1] = _lngLat.lat;
        }
        if (_lngLat.lng < southwest[0]) {
          southwest[0] = _lngLat.lng;
        }
        if (_lngLat.lng > northeast[0]) {
          northeast[0] = _lngLat.lng;
        }
      }
    });

    return [northeast, southwest];
  };

  const fitBoundsMap = async () => {
    const bounds = await getBounds();
    mapManager.fitBounds(bounds, { padding: 200 });
  };


  if (positions) {
    positions.forEach((elm) => {
      const marker = new mapboxgl.Marker()
        .setLngLat({ lng: elm.center[0], lat: elm.center[1] })
        .setPopup(new mapboxgl.Popup().setHTML(elm.content.rendered));
      marker.addTo(mapManager);
    });
  }

  return (
    <MainContainer>
      <Autocomplete onSelect={onSelect} />
      <SectionMap>
        <FiltersContainer>
          <Filters changeFilter={changeFilter} />
        </FiltersContainer>
        <MapContainer ref={mapContainer} />
      </SectionMap>
      <ListSection>
        {positions.map((elm) => (
          <ListItem key={elm.id} position={elm} />
        ))}
      </ListSection>
    </MainContainer>
  );
}

export default App;
