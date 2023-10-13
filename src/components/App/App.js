import { useState, useEffect } from "react";
import Header from "../Header/Header";
//import WeatherCard from '../WeatherCard/WeatherCard';
//import defaultClothingItems from "../../utils/DefaultClothing";
//import ItemCard from '../ItemCard/ItemCard';
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
//import ModalWithForm from "../ModalWithForm/ModalWithForm";
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
import { Switch, Route } from "react-router-dom/cjs/react-router-dom";
import AddItemModal from "../AddItemModal/AddItemModal";
import Profile from "../Profile/Profile";
import * as api from "../../utils/Api";
//json-server --watch db.json --id _id --port 3001   REFERENCE FOR RUNNING DB

function App() {
  //const weatherTemp = "121541512 ºF";
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [temp, setTemp] = useState(0);
  const [weatherLocation, setWeatherLocation] = useState("");
  const [weatherForecast, setWeatherForecast] = useState("");
  const [isDay, setIsDay] = useState(true);
  const [currentTemperatureUnit, setCurrentTempUnit] = useState("F");
  const [isLoading, setIsLoading] = useState(false);
  const [clothingItems, setClothingItems] = useState([{}]);

  const handleCreateModal = () => {
    setActiveModal("create");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleSelectedCard = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
    console.log(card, "check value of card if ID is present");
  };

  function handleSubmit(request) {
    setIsLoading(true);
    request()
      .then(handleCloseModal)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  const handleAddItemSubmit = (newItem) => {
    //   setIsLoading(true);
    //  // const  buttonText={isLoading? 'Saving...' : 'Save'}
    //   api
    //     .addItem(newItem)
    //     .then((addedItem) => {
    //       if (addedItem) {
    //         //logic for taking the data from the form
    //         setClothingItems([addedItem, ...clothingItems]);
    //         setSelectedCard({});
    //         handleCloseModal();
    //       }
    //     })
    //     .catch((err) => {
    //       console.error("Error: ADDING ITEM DID NOT WORK!!!!", err);
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    function requestAddItem() {
      return api.addItem(newItem).then((addedItem) => {
        if (addedItem) {
          setClothingItems([addedItem, ...clothingItems]);
        }
      });
    }
    handleSubmit(requestAddItem);
  };

  //  function handleProfileFormSubmit(inputValues) {
  //   // here we create a function that returns a promise
  //   function makeRequest() {
  //     // `return` lets us use a promise chain `then, catch, finally`
  //     return api.editProfile(inputValues).then(setCurrentUser);
  //   }
  //   // here we call handleSubmit passing the request
  //   handleSubmit(makeRequest);
  // }

  const handleDeleteCard = (card) => {
    // api
    //   .deleteItem(card._id)
    //   .then(() => {
    //     console.log(card._id, "card.id value check DELETE CARD");
    //     const updatedItems = clothingItems.filter(
    //       (item) => item._id !== card._id
    //     );
    //     setClothingItems(updatedItems);
    //     setSelectedCard({});
    //     handleCloseModal();
    //   })
    //   .catch((err) => {
    //     console.error("Error: DELETE ITEM IS NOT WORKING!!!", err);
    //   });
    function requestDeleteItem() {
      return api.deleteItem(card._id).then(() => {
        console.log(card._id, "card.id value check DELETE CARD");
        const updatedItems = clothingItems.filter(
          (item) => item._id !== card._id
        );
        setClothingItems(updatedItems);
      });
    }
    handleSubmit(requestDeleteItem);
  };

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "C") setCurrentTempUnit("F");
    if (currentTemperatureUnit === "F") setCurrentTempUnit("C");
  };

  useEffect(() => {
    if (!activeModal) return; // stop the effect not to add the listener if there is no active modal
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]); // watch activeModal here

  useEffect(() => {
    api
      .getItems()
      .then((items) => {
        setClothingItems(items);
      })
      .catch(console.error);
    //console.log(clothingItems, "add item setclothing items testing in app.js");
  }, []);

  useEffect(() => {
    getForecastWeather()
      .then((data) => {
        const temperature = parseWeatherData(data);
        setTemp(temperature);
        const location = parseLocationData(data);
        setWeatherLocation(location);
        const weatherForecast = parseWeatherForecastData(data);
        setWeatherForecast(weatherForecast);
        const isDay = parseTimeOfDay(data);
        setIsDay(isDay);
      })
      .catch(console.error);
  }, []);
  //  console.log(temp, "this is set temp");
  //  console.log(weatherLocation, "this is APP.js current location");
  //  console.log(weatherForecast, "this is current weather forecast");
  // console.log(isDay, "this is App.js is it day time???");

  return (
    <div className="page">
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <Header
          weatherLocation={weatherLocation}
          onCreateModal={handleCreateModal}
          temp={temp}
        />
        <Switch>
          <Route exact path="/">
            <Main
              weatherTemp={temp}
              onSelectCard={handleSelectedCard}
              isDay={isDay}
              weatherForecast={weatherForecast}
              clothingItems={clothingItems}
            />
          </Route>
          <Route path="/profile">
            <Profile
              clothingItems={clothingItems}
              onSelectCard={handleSelectedCard}
              onCreateModal={handleCreateModal}
            />
          </Route>
        </Switch>
        <Footer />
        {activeModal === "create" && (
          <AddItemModal
            handleCloseModal={handleCloseModal}
            isOpen={activeModal === "create"}
            onAddItem={handleAddItemSubmit}
            buttonText={isLoading ? "Saving..." : "Add Garment"}
            handleSubmit={handleSubmit}
          />
        )}
        {activeModal === "preview" && (
          <ItemModal
            selectedCard={selectedCard}
            onClose={handleCloseModal}
            onDeleteCard={handleDeleteCard}
            buttonText={isLoading ? "Deleting..." : "Delete Item"}
          />
        )}
      </CurrentTemperatureUnitContext.Provider>
    </div>
  );
}

export default App;
