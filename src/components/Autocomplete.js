import React, { useState } from "react";
import { MAPBOX_API_HOST, MAPBOX_GEOCODING ,MAPBOX_SERVICE} from "../constants/mapbox";
import styled from "styled-components";

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
  line-height:1.8rem;
  &:hover{
    background-color:black;
    color:white;
  }
`;

const Autocomplete = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState();

  const handleSearch = (value) => {
    if (value) {
      setSearchValue(value)
      fetch(
        `${MAPBOX_API_HOST}${MAPBOX_GEOCODING}${MAPBOX_SERVICE}/${value}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const options = (
            data.features || []
          ).map(({ id, place_name, center }) => ({ id, center, place_name }));
          setOptions(options);
        });
    }
  };

  const selectElement = (elm) => {
    setSearchValue(elm.place_name)
    setOptions([]);
    onSelect(elm);
  };

  const handleArrow = (e)=>{
    if(e.keyCode===40 && options.lenght){

    }
  }

  return (
    <AutocompleteContainer>
      <AutocompleteWrapper>
        <AutocompleteInput
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleArrow}
        />
        <AutocompleteWrapperList>
          {options &&
            options.map((elm) => (
              <AutocompleteItem key={elm.id} onClick={() => selectElement(elm)}>
                {elm.place_name}
              </AutocompleteItem>
            ))}
        </AutocompleteWrapperList>
      </AutocompleteWrapper>
    </AutocompleteContainer>
  );
};

export default Autocomplete;
