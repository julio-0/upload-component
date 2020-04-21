import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
}

body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    background: #fef8e5;
    text-rendering: optimizeLegibility;
    -webki-font-smoothing: antialiased;
}

`;
