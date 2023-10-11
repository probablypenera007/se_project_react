import "./ClothesSection.css";

const ClothesSection = ({ clothingItems, onSelectCard, onCreateModal }) => {
  return (
    <section className="clothes__section">
      clothes section
      <div className="clothes__section-title">Your Item</div>
      <button className="clothes__section_add-button" type="button" onClick={onCreateModal}>+ add items</button>
      <ul className="clothes__section-gallery">
        <li>CLOTHES ITEMS HERE!!!</li>
      </ul>
    </section>
  );
};
export default ClothesSection;
