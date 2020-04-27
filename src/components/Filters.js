import React, { useState } from "react";
import styled from "styled-components";

const Ul = styled.ul`
  list-style-type: none;
`;
const Li = styled.li`
  line-height: 1.6rem;
`;

const WrapperFilters = styled.div`
  display: flex;
  justify-content: center;
  flex-direction:column;
`;
const Filters = ({ filters, changeFilter }) => {
  const [current, setCurrent] = useState(null);

  const handlChange = (e) => {
    setCurrent(parseInt(e.target.value));
    changeFilter(e.target.value);
  };

  return (
    <WrapperFilters>
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
    </WrapperFilters>
  );
};

export default Filters;
