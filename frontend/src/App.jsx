import React from 'react';
import MainRouter from './Router/Router';
import ErrorBoundary from './components/Error/errorboundaries';
import { Provider } from "react-redux";
import store,{persistor} from './Redux/Store/store';
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    

       <ErrorBoundary>
        <Provider store={store}>
        <PersistGate persistor={persistor}>
         <MainRouter />
         </PersistGate>
        </Provider>
       </ErrorBoundary>
  );
};

export default App;
