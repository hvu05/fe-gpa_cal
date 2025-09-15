import './App.css';
import './style/main.scss'
import Allrouter from './components/Allroutes';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider>
      <Allrouter />
    </ConfigProvider>
  );
}

export default App;
