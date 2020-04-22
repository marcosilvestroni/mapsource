import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PORTFOLIO_ENTRIES } from "../constants/wordpress";

const Ul = styled.ul`
  list-style-type: none;
`;
const Li = styled.li`
  line-height: 1.3rem;
`;
const Filters = ({ filters, changeFilter }) => {
  
  const [current, setCurrent] = useState(null);

  const handlChange = (e) => {
    setCurrent(parseInt(e.target.value));
    changeFilter(e.target.value);
  };

  return (
    <div>
      <h3>Filtri</h3>
      <Ul>
        {filters.map((elm) => (
          <Li key={elm.id}>
            <label>
              {elm.name}
              <input
                type="radio"
                value={elm.id}
                onChange={handlChange}
                checked={current === elm.id}
              />
            </label>
          </Li>
        ))}
      </Ul>
    </div>
  );
};

export default Filters;
