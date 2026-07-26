import React from "react";
import ReactDOM from "react-dom/client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { BrowserRouter } from 'react-router-dom';
import Feature from './feature-module/feature';
import 'aos/dist/aos.css';
import { Provider } from 'react-redux';
import store from './core/data/redux/store';
import '../src/style/scss/main.scss'
import '../src/style/css/feather.css'
import './index.scss';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { base_path } from "./environment";



const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store} >
        <BrowserRouter basename={base_path}>
          <Feature />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
