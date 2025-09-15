import './App.css';

import './style/main.scss'
import Allrouter from './components/Allroutes';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';   // AntD v5
function App() {
  return (
    <ConfigProvider>
      <Allrouter />
    </ConfigProvider>
  );
}

export default App;
