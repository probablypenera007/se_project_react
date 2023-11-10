import React from "react";
import "./ItemCard.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const ItemCard = ({ 
   // key, 
  //id,
  item, 
  onSelectCard, 
  // currentUser, 
  onLikeClick ,
  itemId
}) => {
  const currentUser = React.useContext(CurrentUserContext);
  const isLiked =
    currentUser && item.likes ? item.likes.includes(currentUser._id) : false;
  //const id = currentUser._id;
//console.log("this is isLiked value from ItemCard: ",isLiked)
  // console.log(id, "value of user ID in itemCard")
  // console.log(item.likes, "value of item for clothes dapat to!")

  const likeButtonClassName = `like__button ${
    isLiked ? "like__button_active" : "like__button_inactive"
  }`;

  const handleLike = (e) => {
    e.preventDefault();
    onLikeClick({ id: item._id, isLiked });
  };

  return (
    <li 
     //key={key} 
    //key={id}
    className="card"
    key={itemId}
    >
      <img
        src={item.imageUrl}
        className="card__item-image"
        onClick={() => onSelectCard(item)}
        alt={item.name}
      />
      <h2 className="card__item-name">{item.name}</h2>
      <div className="like__button-container">
        {currentUser && (
          <button
            className={`like__button ${likeButtonClassName}`}
            onClick={handleLike}
          ></button>
        )}
      </div>
    </li>
  );
};

export default ItemCard;
