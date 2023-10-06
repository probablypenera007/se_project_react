import { useState, useEffect} from 'react';
import Header from '../Header/Header';
//import WeatherCard from '../WeatherCard/WeatherCard';
//import defaultClothingItems from '../../utils/DefaultClothing';
//import ItemCard from '../ItemCard/ItemCard';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import ItemModal from '../ItemModal/ItemModal';
import "./App.css"
import {getForecastWeather, parseWeatherData, parseLocationData} from '../../utils/weatherApi';



function App() {
  //const weatherTemp = "121541512 ºF";
  const [activeModal, setActiveModal] = useState('');
  const [selectedCard, setSelectedCard] = useState({});
  const [temp, setTemp] = useState(0);
  const [weatherLocation, setWeatherLocation] = useState('');

  const handleCreateModal = () => {
    setActiveModal('create')
  };

  const handleCloseModal= () => {
    setActiveModal('')
  };

  const handleSelectedCard = (card) => {
    setActiveModal('preview')
    setSelectedCard(card);
  }

  useEffect(() => {
    getForecastWeather().then((data) => {
     
     const temperature= parseWeatherData(data);
      setTemp(temperature);

      const location = parseLocationData(data);
      setWeatherLocation(location);
    })
  }, [])
  console.log(temp, "this is set temp")
  console.log(weatherLocation, "this is APP.js current location")

  return (
    <div className="page">
     <Header weatherLocation={weatherLocation} onCreateModal={handleCreateModal} /> 
     <Main  weatherTemp={temp} onSelectCard={handleSelectedCard}/> 
    <Footer />
    {activeModal === 'create'&&  (
    <ModalWithForm title="New Garment" onClose={handleCloseModal}>
      <label className='modal__label'>
        Name<input type="text" name="name" minLength="1" maxLength="30" required/>
      </label>
      <label className='modal__label'>
        Image<input type="url" name="link" minLength="1" maxLength="30" required/>
      </label>
      <label className='modal__label'>Select the Weather Type:</label>
      <div>
        <div>
          <input className='modal__input-radio' type="radio" id="hot" value="hot" />
         <label className='modal__label-radio'>Hot</label>
         </div>
         <div>
          <input  className='modal__input-radio' type="radio" id="warm" value="warm" />
         <label className='modal__label-radio'>Warm </label>
         </div>
         <div>
          <input  className='modal__input-radio' type="radio" id="cold" value="cold" />
         <label className='modal__label-radio'>Cold </label>
         </div>
      </div>
    </ModalWithForm>
    )}
     {activeModal === 'preview' && 
      <ItemModal selectedCard={selectedCard}  onClose={handleCloseModal}/>
     }
    </div>
  );
}


export default App; 
    