import './App.css'
import { Header } from './components/Header'
import { Main } from './components/Main'

function App() {

  return (
    <div className='w-full py-12 px-6 xs:px-10 md:px-24 bg-gray-100 dark:bg-gray-900 transition-all space-y-12 duration-300 ease-in-out'>
      <Header/>
      <Main/>
    </div>
  )
}

export default App
