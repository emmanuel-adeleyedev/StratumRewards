import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'   // ← this makes the store available everywhere
import { store } from './app/store'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>   {/* wrap your whole app */}
      <App />
    </Provider>
  </React.StrictMode>
)