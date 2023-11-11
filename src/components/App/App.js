import { useState, useEffect } from "react";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
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
import CurrentUserContext from "../../contexts/CurrentUserContext";
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom/cjs/react-router-dom";
import AddItemModal from "../AddItemModal/AddItemModal";
import Profile from "../Profile/Profile";
import * as api from "../../utils/Api";
import * as auth from "../../utils/Auth";
import LogInModal from "../LogInModal/LogInModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [temp, setTemp] = useState(0);
  const [weatherLocation, setWeatherLocation] = useState("");
  const [weatherForecast, setWeatherForecast] = useState("");
  const [isDay, setIsDay] = useState(true);
  const [currentTemperatureUnit, setCurrentTempUnit] = useState("F");
  const [isLoading, setIsLoading] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [inputError, setInputError] = useState("");

  const history = useHistory();

  // -------------------------
  // MODALS
  // -------------------------

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

  const handleCloseModal = () => {
    setActiveModal("");
  };

  function handleSubmit(request) {
    setIsLoading(true);
    request()
      .then((data) => {
        handleCloseModal();
        return data;
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  // -------------------------
  // CLOTHING ITEMS
  // -------------------------

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getItems()
        .then((res) => {
          // console.log("getItems data value: ", res)
          if (Array.isArray(res.data)) {
            setClothingItems(res.data);
          } else {
            console.error("Data received is not an array:", res.data);
          }
        })
        .catch(console.error);
    }
  }, [isLoggedIn]);

  const handleCreateModal = () => {
    setActiveModal("create");
  };

  const handleSelectedCard = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
    // console.log(card, "check value of card if ID is present");
  };

  const handleAddItemSubmit = (newItem) => {
    function requestAddItem() {
      return api.addItem(newItem).then((addedItem) => {
        if (addedItem) {
          setClothingItems((addedItem) => [...addedItem, clothingItems]);
        }
      });
    }
    handleSubmit(requestAddItem);
  };

  const handleDeleteCard = (card) => {
    function requestDeleteItem() {
      return api.deleteItem(card._id).then(() => {
        //      console.log(card._id, "card.id value check DELETE CARD");
        const updatedItems = clothingItems.filter(
          (item) => item._id !== card._id
        );
        setClothingItems(updatedItems);
      });
    }
    handleSubmit(requestDeleteItem);
  };

  const handleLikeClick = ({ id, isLiked }) => {
    const jwt = localStorage.getItem("jwt");
    // Check if this card is now liked
    !isLiked
      ? // if so, send a request to add the user's id to the card's likes array
        api
          // the first argument is the card's id
          .addCardLike(id, jwt)
          .then((updatedCard) => {
            setClothingItems((cards) => {
              return cards.map((c) => (c._id === id ? updatedCard.data : c));
            });
          })
          .catch((err) => console.log(err))
      : // if not, send a request to remove the user's id from the card's likes array
        api
          // the first argument is the card's id
          .removeCardLike(id, jwt)
          .then((updatedCard) => {
            //console.log('Unlike response updatedCard data:', updatedCard);
            setClothingItems((cards) => {
              //  console.log("unlike setclothingitem for cards after .then updatedCard", cards)
              return cards.map((c) => (c._id === id ? updatedCard.data : c));
            });
          })
          .catch((err) => console.log(err));
  };

  // -------------------------
  //         USERS
  // -------------------------

  const handleLogInModal = () => {
    setActiveModal("login-signin");
  };

  const handleLogInSubmit = (data) => {
    setIsLoading(true);
    return auth
      .logIn(data)
      .then((res) => {
        setIsLoggedIn(true);
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          auth.checkToken(res.token).then((user) => setCurrentUser(user));
          history.push("/profile");
        }
      })
      .catch((error) => {
        const errorMessage = error.message || "";
        if (errorMessage.includes("invalid email")) {
          setInputError("Invalid Email");
        } else if (errorMessage.includes("incorrect password")) {
          setInputError("Incorrect Password");
        } else {
          console.error(error);
          setInputError("Login Failed. Please Try Again");
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsLoggedIn(true);
      auth
        .checkToken(jwt)
        .then((user) => {
          setCurrentUser(user.data);
          console.log("currentUser set in App.js:", user.data);
          history.push("/profile");
        })
        .catch((err) => {
          console.error("Token verification failed:", err);
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
          setCurrentUser({});
        });
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser({});
    history.push("/");
  };

  const handleRegisterModal = () => {
    setActiveModal("register-signup");
  };

  const handleRegisterSubmit = (data) => {
    setIsLoading(true);
    return auth
      .register(data)
      .then((res) => {
        handleLogInSubmit(data);
        handleCloseModal();
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleEditProfileModal = () => {
    setActiveModal("edit-profile");
  };

  const handleEditProfileSubmit = (data) => {
    setIsLoading(true);
    const jwt = localStorage.getItem("jwt");
    return auth
      .editProfile(jwt, data)
      .then((update) => {
        setCurrentUser(update.data);
        handleCloseModal();
        history.push("/profile");
        //console.log("value of updated user in app.js: ", update.data)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  // -------------------------
  //     WEATHER - RELATED
  // -------------------------

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "C") setCurrentTempUnit("F");
    if (currentTemperatureUnit === "F") setCurrentTempUnit("C");
  };

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
  // console.log("Clothing items state in App:", clothingItems);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <Header
            weatherLocation={weatherLocation}
            onCreateModal={handleCreateModal}
            temp={temp}
            isLoggedIn={isLoggedIn}
            onLogInModal={handleLogInModal}
            onRegisterModal={handleRegisterModal}
            currentUser={currentUser}
          />
          <Switch>
            <Route exact path="/">
              <Main
                weatherTemp={temp}
                onSelectCard={handleSelectedCard}
                isDay={isDay}
                weatherForecast={weatherForecast}
                clothingItems={clothingItems}
                onLikeClick={handleLikeClick}
              />
            </Route>
            <Route path="/profile">
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile
                  clothingItems={clothingItems}
                  onSelectCard={handleSelectedCard}
                  onCreateModal={handleCreateModal}
                  onLogOut={handleLogOut}
                  isLoggedIn={isLoggedIn}
                  currentUser={currentUser}
                  onEditProfile={handleEditProfileModal}
                  onLikeClick={handleLikeClick}
                />
              </ProtectedRoute>
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
              buttonText={isLoading ? "Removing..." : "Delete Item"}
            />
          )}
          {activeModal === "login-signin" && (
            <LogInModal
              handleCloseModal={handleCloseModal}
              isOpen={activeModal === "login-signin"}
              buttonText={isLoading ? "🧭" : "Log In"}
              onSubmit={handleLogInSubmit}
              openRegisterModal={handleRegisterModal}
              inputError={inputError}
            />
          )}
          {activeModal === "register-signup" && (
            <RegisterModal
              handleCloseModal={handleCloseModal}
              isOpen={activeModal === "register-signup"}
              buttonText={isLoading ? "🧭" : "Next"}
              onSubmit={handleRegisterSubmit}
              openLogInModal={handleLogInModal}
            />
          )}
          {activeModal === "edit-profile" && (
            <EditProfileModal
              handleCloseModal={handleCloseModal}
              isOpen={activeModal === "edit-profile"}
              buttonText={isLoading ? "Saving.." : "Save Changes"}
              onSubmit={handleEditProfileSubmit}
            />
          )}
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
