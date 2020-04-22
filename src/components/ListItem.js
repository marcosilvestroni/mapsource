import React from "react";
import styled from "styled-components";

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
    max-width:100%;
`
const ListItem = ({ position , types }) => {
  console.log(types)
  const typeName = ()=>{

    return types.length ? types.filter(elm=>elm.id==position.category)[0].name : ''
  }

  return (
    <WrapperItem>
      <WrapperImage>
        <Img src={position.image} alt={position.name} />
      </WrapperImage>
      <WrapperText>
        <HeaderType>{typeName()}</HeaderType>
        <div dangerouslySetInnerHTML={{ __html: position.content }} />
      </WrapperText>
    </WrapperItem>
  );
};

export default ListItem;
