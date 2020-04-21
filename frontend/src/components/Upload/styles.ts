import styled, { css } from 'styled-components';

const dragActive = css`
  border-color: #78e5d5;
`;

const dragReject = css`
  border-color: #e57878;
`;


type StyledContainer = {
  isDragActive?: boolean;
  isDragReject?: boolean;
};
const DropContainer = styled.div<StyledContainer>`;
    border: 1px dashed #ddd;
    border-radius: 4px;
    cursor:pointer;
    transition: height 0.2s ease;    
    ${(props) => props.isDragActive && dragActive};
    ${(props) => props.isDragReject && dragReject};
    
    `;

type StyledMessage = {
  type?: messageColors;
};

enum messageColors {
  default= '#999',
  error= '#e57878',
  success= '#78e5d5',
}

const UploadMessage = styled.p<StyledMessage>`;
    display: flex;
    color: ${(props) => props.type};
    justify-content: center;
    align-items: center;
    padding: 15px 0;
`;

// const Button = styled.button`...`;

// const ButtonIcon = styled.span`
//   ${Button}:hover & {
//     ...
//   }
// `;

// const ButtonText = styled.span`...`;

export const Styled = {
  DropContainer,
  UploadMessage,
  messageColors,
};
