import React from 'react';
import MainRouter from './Router/Router';
import ErrorBoundary from './components/Error/errorboundaries';
import { Provider } from "react-redux";
import store,{persistor} from './Redux/Store/store';
import { PersistGate } from "redux-persist/integration/react";
import { socket } from './socket';
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from './context/SocketContext';

const App = () => {

  return (
    

       <ErrorBoundary>
        <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SocketProvider>
         <MainRouter />
         <Toaster 
         position="top-right"
         reverseOrder={false}
         gutter={8}
         containerClassName=""
         containerStyle={{}}
         toastOptions={{
           // Default options for all toasts
           className: '',
           duration: 5000,
           style: {
             background: '#333',
             color: '#fff',
           },
           // Custom success toast styling
           success: {
             duration: 5000,
             theme: {
               primary: '#4aed88',
             },
           },
         }}/>
          </SocketProvider>
         </PersistGate>
        </Provider>
       </ErrorBoundary>
  );
};

export default App;
