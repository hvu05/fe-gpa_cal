import './App.css';

import './style/main.scss'
import Allrouter from './components/Allroutes';
function App() {
  return (
    <ConfigProvider>
      <Allrouter />
    </ConfigProvider>
  );
}

export default App;
