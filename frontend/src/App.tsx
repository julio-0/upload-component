import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import GlobalStyle from './styles/global';
import Upload from './components/Upload';
import FileList from './components/FileList';
import { Styled } from './styles/styles';

const App = () => (
  <Provider store={store}>
    <GlobalStyle />
    <Styled.Container>
      <Styled.Content>
        <Upload />
        <FileList />
      </Styled.Content>
    </Styled.Container>
  </Provider>
);

export default App;
