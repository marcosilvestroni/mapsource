import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";
import Autocomplete from "./components/Autocomplete";
import Filters from "./components/Filters";
import ListItem from "./components/ListItem";
import { sortDataForUsersPosition } from "./utils";
import { PORTFOLIO, PORTFOLIO_ENTRIES } from "./constants/wordpress";

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
  display: flex;
`;

const ListSection = styled.div`
  width: 70%;
  margin: 0 auto;
`;

function App() {
  const [mapManager, setMapManager] = useState();
  const [userMarker, setUserMarker] = useState(null);
  const [shopsMarkers, setShopsMarkers] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filterValue, setFilterValue] = useState(null);

  const mapContainer = useRef(null);

  const sanitizePosition = (position) => {
    return {
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
      /*image: dataParsed.media_details.sizes.medium_large.source_url,*/
      category: position.portfolio_entries,
    };
  };

  const fitBoundsMap = useCallback(async () => {
    const getBounds = () => {
      let northeast = [];
      let southwest = [];
      const shops = filterValue
        ? shopsMarkers.filter((m) => {
            if (filterValue) {
              const condition = m.positionData.category.includes(
                parseInt(filterValue)
              );
              if (!condition) {
                m.remove();
              }
              return condition;
            }
          })
        : shopsMarkers;
      const data = userMarker ? [shops[0], userMarker] : [...shops];
      if (data.length > 0) {
        data.forEach(({ _lngLat }) => {
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
      }

      return [northeast, southwest];
    };

    const bounds = await getBounds();
    mapManager.fitBounds(bounds, { padding: 200 });
  }, [filterValue, mapManager, shopsMarkers, userMarker]);

  const onSelect = (elm) => {
    if (userMarker) {
      userMarker.remove();
    }
    mapManager.flyTo({ center: elm.center, zoom: 12 });
    const markerUser = new mapboxgl.Marker({
      color: "#e30613",
    })
      .setLngLat(elm.center)
      .setPopup(new mapboxgl.Popup().setText("La tua posizione"))
      .addTo(mapManager);
    setUserMarker(markerUser);
    setShopsMarkers(sortDataForUsersPosition(shopsMarkers, markerUser));
  };

  useEffect(() => {
    if (!filters.length > 0) {
      fetch(PORTFOLIO_ENTRIES)
        .then((data) => data.json())
        .then((dataParsed) =>
          setFilters(
            dataParsed.map(({ id, name }) => ({
              id,
              name,
            }))
          )
        );
    }
    if (!mapManager) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        maxZoom: 5,
        attributionControl: false,
        renderWorldCopies: false,
      });
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));
      map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 80,
        })
      );
      setMapManager(map);
    } else {
      if (!shopsMarkers.length > 0) {
        fetch(PORTFOLIO)
          .then((data) => data.json())
          .then((dataParsed) => {
            const data = dataParsed.map((position) =>
              sanitizePosition(position)
            );
            const arrMarkers = [];
            data.forEach((elm) => {
              const marker = new mapboxgl.Marker()
                .setLngLat({ lng: elm.center[0], lat: elm.center[1] })
                .setPopup(new mapboxgl.Popup().setHTML(elm.content));
              arrMarkers.push(Object.assign(marker, { positionData: elm }));
            });
            setShopsMarkers(arrMarkers);
          });
      } else {
        fitBoundsMap();
      }
    }
  }, [filterValue, filters.length, fitBoundsMap, mapManager, shopsMarkers]);

  return (
    <MainContainer>
      <Autocomplete onSelect={onSelect} />
      <SectionMap>
        <FiltersContainer>
          <Filters changeFilter={setFilterValue} filters={filters} />
          <div>
            <ul>
              {shopsMarkers.map((elm) => (
                <li>
                  {elm.name}{" "}
                  <button onClick={() => elm.addTo(mapManager)}>
                    Aggiungi
                  </button>
                  <button onClick={() => elm.remove()}>Rimuovi</button>
                </li>
              ))}
            </ul>
          </div>
        </FiltersContainer>
        <MapContainer ref={mapContainer} />
      </SectionMap>
      <ListSection>
        {shopsMarkers.map((elm) => {
          if (!filterValue || elm.positionData.category == filterValue) {
            return (
              <ListItem
                key={elm.positionData.id}
                position={elm.positionData}
                types={filters}
              />
            );
          }
        })}
      </ListSection>
    </MainContainer>
  );
}

export default App;
