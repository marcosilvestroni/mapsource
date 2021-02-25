import React from "react";
import styled from "styled-components";
import useFetch from "use-http";

const WrapperItem = styled.div`
  display: flex;
`;
const WrapperImage = styled.div`
  min-width: 40%;
`;
const WrapperText = styled.div`
  padding: 2rem;
`;
const HeaderType = styled.h3`
  font-size: 3rem;
`;
const Img = styled.img`
  max-width: 100%;
`;
const ListItem = React.memo(({ position, types }) => {
  const { loading, error, data = {} } = useFetch(position.linkApiImage, {}, []);

  const typeName = () => {
    return types.length
      ? types.filter(elm => elm.id === parseInt(position.category))[0].name
      : "";
  };
  return (
    <WrapperItem>
      <WrapperImage>
        {loading && "loading image"}
        {error && "error retrieving image"}
        {data.media_details ? (
          <Img src={data.source_url} alt={position.name} />
        ) : null}
      </WrapperImage>
      <WrapperText>
        <HeaderType>{typeName()}</HeaderType>
        <div dangerouslySetInnerHTML={{ __html: position.content }} />
      </WrapperText>
    </WrapperItem>
  );
});

export default ListItem;
