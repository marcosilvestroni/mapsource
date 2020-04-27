import React, { useState } from "react";
import {
  MAPBOX_API_HOST,
  MAPBOX_GEOCODING,
  MAPBOX_SERVICE,
} from "../constants/mapbox";
import styled from "styled-components";
import AutocompleteReact from "react-autocomplete";
import useFetch from "use-http";

const AutocompleteContainer = styled.div`
  width: 100%;
  background-color: grey;
  padding: 2rem, 0;
  height: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AutocompleteWrapper = styled.div`
  position: relative;
`;
const AutocompleteInput = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid #ffffff;
  width: 800px;
  text-align: left;
  font: Bold 20px/32px Source Sans Pro;
  letter-spacing: 0;
  color: #ffffff;
  opacity: 1;
  margin: 0 auto;
`;
const AutocompleteWrapperList = styled.div`
  position: absolute;
  width: 100%;
  z-index: 1000;
`;
const AutocompleteItem = styled.div`
  background: #fff;
  cursor: pointer;
  line-height: 1.8rem;
  padding: 0.8rem;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const Autocomplete = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const { get, loading, error, response } = useFetch(
    `${MAPBOX_API_HOST}${MAPBOX_GEOCODING}${MAPBOX_SERVICE}`
  );

  const handleSearch = async (value) => {
    if (value) {
      setSearchValue(value);

      const data = await get(
        `/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      if (response.ok) {
        setOptions(
          (data.features || []).map(({ id, place_name, center }) => ({
            id,
            center,
            place_name,
          }))
        );
      }
    } else {
      setSearchValue("");
    }
  };

  const handleSelect = (elm) => {
    setSearchValue(elm.place_name);
    setOptions([]);
    onSelect(elm);
  };

  return (
    <AutocompleteContainer>
      <AutocompleteWrapper>
        <AutocompleteReact
          getItemValue={(option) => option.place_name}
          items={options}
          renderInput={(props) => <AutocompleteInput {...props} />}
          renderMenu={(items, value, style) => (
            <AutocompleteWrapperList children={items} />
          )}
          renderItem={(item, isHighlighted) => (
            <AutocompleteItem
              key={item.id}
              style={{
                backgroundColor: isHighlighted ? "#000" : "#fff",
                color: isHighlighted ? "#fff" : "#000",
              }}
            >
              {item.place_name}
            </AutocompleteItem>
          )}
          value={searchValue}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          onSelect={(_, item) => handleSelect(item)}
        />
      </AutocompleteWrapper>
    </AutocompleteContainer>
  );
};

export default Autocomplete;
