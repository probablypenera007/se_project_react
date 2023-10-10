import { useState, useEffect } from "react";
import Header from "../Header/Header";
//import WeatherCard from '../WeatherCard/WeatherCard';
//import defaultClothingItems from '../../utils/DefaultClothing';
//import ItemCard from '../ItemCard/ItemCard';
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import ItemModal from "../ItemModal/ItemModal";
import "./App.css";
import {
  getForecastWeather,
  parseWeatherData,
  parseLocationData,
  parseWeatherForecastData,
  parseTimeOfDay,
} from "../../utils/weatherApi";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";

function App() {
  //const weatherTemp = "121541512 ºF";
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [temp, setTemp] = useState(0);
  const [weatherLocation, setWeatherLocation] = useState("");
  const [weatherForecast, setWeatherForecast] = useState("");
  const [isDay, setIsDay] = useState(true);
 const [currentTempUnit, setCurrentTempUnit] = useState('F');

  const handleCreateModal = () => {
    setActiveModal("create");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleSelectedCard = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

const handleToggleSwitchChange = () => {
  if (currentTempUnit === "C") setCurrentTempUnit("F");
  if (currentTempUnit === "F") setCurrentTempUnit("C");
}
console.log(currentTempUnit, "app.js current temp unit")
  useEffect(() => {
    getForecastWeather()
      .then((data) => {
        const temperature = parseWeatherData(data);
        console.log(temperature,"current temperatre in app.js previosuly current weather, debug parsedTemp") 
        setTemp(temperature);

        const location = parseLocationData(data);
        setWeatherLocation(location);

        const weatherForecast = parseWeatherForecastData(data);
        setWeatherForecast(weatherForecast,"what is the weatherForecast");

        const isDay = parseTimeOfDay(data);
        setIsDay(isDay);
      })
      .catch(console.error);
    //   .cactch((err) => {
    //     console.error("Error:", err);
    //   })
  }, []);
  console.log(temp, "this is set temp");
  console.log(weatherLocation, "this is APP.js current location");
  console.log(weatherForecast, "this is current weather forecast");
  console.log(isDay, "this is App.js is it day time???");

  return ( 
    <div className="page">
      <CurrentTemperatureUnitContext.Provider value={{currentTempUnit, handleToggleSwitchChange}}>
      <Header
        weatherLocation={weatherLocation}
        onCreateModal={handleCreateModal}
        temp={temp}
      />
      <Main weatherTemp={temp} onSelectCard={handleSelectedCard} isDay={isDay} weatherForecast={weatherForecast}/>
      <Footer />
      {activeModal === "create" && (
        <ModalWithForm title="New Garment" onClose={handleCloseModal}>
          <label className="modal__label">
            Name
            <input
              className="modal__input-text"
              placeholder="Name"
              type="text"
              name="name"
              minLength="1"
              maxLength="30"
              required
            />
          </label>
          <label className="modal__label">
            Image
            <input
              className="modal__input-text"
              placeholder="Image URL"
              type="url"
              name="link"
              minLength="1"
              maxLength="30"
              required
            />
          </label>
          <label className="modal__label">Select the Weather Type:</label>
          <div>
            <div>
              <input
                className="modal__input-radio"
                type="radio"
                id="hot"
                value="hot"
                name="selected-weather-type"
              />
              <label className="modal__label-radio" htmlFor="hot">
                Hot
              </label>
            </div>
            <div>
              <input
                className="modal__input-radio"
                type="radio"
                id="warm"
                value="warm"
                name="selected-weather-type"
              />
              <label className="modal__label-radio" htmlFor="warm">
                Warm{" "}
              </label>
            </div>
            <div>
              <input
                className="modal__input-radio"
                type="radio"
                id="cold"
                value="cold"
                name="selected-weather-type"
              />
              <label className="modal__label-radio" htmlFor="cold">
                Cold{" "}
              </label>
            </div>
          </div>
        </ModalWithForm>
      )}
      {activeModal === "preview" && (
        <ItemModal selectedCard={selectedCard} onClose={handleCloseModal} />
      )}
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
