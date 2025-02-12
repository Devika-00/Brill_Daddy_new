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
