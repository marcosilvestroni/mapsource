import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Ul = styled.ul`
  list-style-type: none;
`;
const Li = styled.li`
  line-height: 1.3rem;
`;
const Filters = ({ changeFilter }) => {
  const [filters, setFilters] = useState([]);
  const [current, setCurrent] = useState(null) 
  useEffect(() => {
    if (!filters.length) {
      fetch(
        "http://nuovasimonelli-test.nautes.eu/wp-json/wp/v2/portfolio_entries"
      )
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
  });

  const handlChange = (e) => {
    setCurrent(e.target.value)
    changeFilter(e.target.value)
  }
  
  return (
    <div>
      <h3>Filtri</h3>
      <Ul>
        {filters.map((elm) => (
          <Li key={elm.id}>
            <label>
              {elm.name}{" "}
              <input
                type="radio"
                value={elm.id}
                onClick={handlChange}
                checked={current==elm.id}
              />
            </label>
          </Li>
        ))}
      </Ul>
    </div>
  );
};

export default Filters;
