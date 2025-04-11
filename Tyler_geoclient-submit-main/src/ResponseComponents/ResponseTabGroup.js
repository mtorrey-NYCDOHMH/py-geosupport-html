import React, { useState } from 'react';
import styled from 'styled-components';
import RequestResponseTable from './RequestResponseTable';
import InputTable from './InputTable'
import ResponseMap from './ResponseMap';
import Introduction from './Introduction';

const Tab = styled.button`
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
  background: #e6e6e6;
  width: 25%;
  border: 1px solid #A9A9A9;
  padding: 0px;

  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid #002d62;
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
  height: 7%;
`;

const ResponseWrapper = styled.section`
  height: 100%;
`;

function ResponseTabGroup(props) {
  const [active, setActive] = useState(props.responseTypes[0]['name']);

  const responseUpdateHandler = (r) => {
    props.onResponseUpdate(r);
  }

  const insides = {
    'Introduction': <Introduction />,
    'Input Table': <InputTable inputRows={props.inputRows} inputHeaders={props.inputHeaders}/>,
    'Results Table': <RequestResponseTable response={props.response} inputRows={props.inputRows} inputHeaders={props.inputHeaders} onResponseUpdate={responseUpdateHandler} responseStage={props.responseStag} service={props.service}/>,
    'Map': <ResponseMap response={props.response} service={props.service}/>,
  };

  return (
    <ResponseWrapper>
      <ButtonGroup>
        {props.responseTypes.map(type => (
          <Tab
            key={type['name']}
            active={active === type['name']}
            onClick={() => setActive(type['name'])}
          >
            {type['displayName']}
          </Tab>
        ))}
      </ButtonGroup>
      {insides[active]}
    </ResponseWrapper>
  );
}

export default ResponseTabGroup;