import ItemCard from "../../ItemCard/ItemCard";
import "./ClothesSection.css";
// import * as currentUser from "../../../contexts/CurrentUserContext";

const ClothesSection = ({
  clothingItems,
  onSelectCard,
  onCreateModal,
  onLikeClick,
  currentUser,
}) => {

  // const userClothingItems = clothingItems.filter((item) => {
  //   return item.owner === currentUser.id;
  // })

  return (
    <section className="clothes__section">
      <div className="clothes__section-title">Your Item</div>
      <button
        className="clothes__section_add-button"
        type="button"
        onClick={onCreateModal}
      >
        + Add items
      </button>
      <ul className="clothes__section-gallery">
        {clothingItems.map((item) => {
          return (
            <ItemCard
              key={item._id}
              item={item}
              onSelectCard={onSelectCard}
              currentUser={currentUser}
              onLikeClick={onLikeClick}
            />
          );
        })}
      </ul>
    </section>
  );
};
export default ClothesSection;
