import React, { useState } from "react";
import styled from "styled-components";
import { getLocalizedText } from "../utils";

const Ul = styled.ul`
  list-style-type: none;
`;
const Li = styled.li`
  line-height: 1.6rem;
`;

const WrapperFilters = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const Filters = ({ filters, changeFilter }) => {
  const [current, setCurrent] = useState(-1);

  const handlChange = (e) => {
    setCurrent(parseInt(e.target.value));
    if (parseInt(e.target.value) === -1) {
      changeFilter(null);
    } else {
      changeFilter(e.target.value);
    }
  };

  return (
    <WrapperFilters>
      <h3>{getLocalizedText("filters")}</h3>
      <Ul>
        <Li key={-1}>
          <label>
            {getLocalizedText("nofilters")}
            <input
              type="radio"
              value={-1}
              onChange={handlChange}
              checked={current === -1}
            />
          </label>
        </Li>
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
    </WrapperFilters>
  );
};

export default Filters;
