import React from "react";
import "./ItemCard.css";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const ItemCard = ({ item, onSelectCard, onLikeClick }) => {
  const currentUser = React.useContext(CurrentUserContext)
  const isLiked = currentUser && item.likes.includes(id => id === currentUser._id);
  const id = currentUser._id;

  console.log(id, "value of user ID in itemCard")
  console.log(item, "value of item for clothes dapat to!")

  const likeButtonClassName = `like__button ${isLiked ? 'like__button_active' : 'like__button_inactive'}`;
  
  const handleLike = (e) => {
    e.preventDefault();
    onLikeClick({isLiked});
  };

  return (
    <div className="card">
      <img
        src={item.imageUrl}
        className="card__item-image"
        onClick={() => onSelectCard(item)}
        alt={item.name}
      />
      <h2 className="card__item-name">{item.name}</h2>
      <div className="like__button-container">
      {currentUser && (
        <button className={ `like__button ${likeButtonClassName}`}
        onClick={handleLike}
        ></button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
