import styled from 'styled-components';

const List = styled.ul`;
    margin-top: 20px;
`;

type StyledLi = {
  key?: string;
}
const ListItem = styled.li<StyledLi>`;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #444;
  
  & + li{
    margin-top: 15px;
  }
`;

const FileInfo = styled.div`;
  display: flex;
  align-items: center;
  div {
    display: flex;
    flex-direction: column;

    span {
      font-size: 12px;
      color: #999;
      margin-top: 5px;

      button {
        border: 0;
        background: transparent;
        color: #e57878;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
`;

type StyledPreview = {
  src?: string;
}

const Preview = styled.div<StyledPreview>`;
  width: 36px;
  height: 36px;
  border-radius: 5px;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin-right: 10px;
`;

export const Styled = {
  List,
  ListItem,
  FileInfo,
  Preview,
};
