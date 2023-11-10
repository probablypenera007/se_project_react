import SideBar from "./SideBar/SideBar";
import ClothesSection from "./ClothesSection/ClothesSection";

import "./Profile.css";

function Profile({ 
  clothingItems, 
  onSelectCard, 
  onCreateModal, 
  onLogOut, 
  isLoggedIn, 
  currentUser,
  onEditProfile,
  onLikeClick, 
}) {
  return (
    <section className="profile">
      <SideBar 
      onLogOut={onLogOut} 
      currentUser={currentUser}
      isLoggedIn={isLoggedIn}
      onEditProfile={onEditProfile}
      />
      <div>
        <ClothesSection
          clothingItems={clothingItems}
          onSelectCard={onSelectCard}
          onCreateModal={onCreateModal}
          isLoggedIn={isLoggedIn}
          onLikeClick={onLikeClick}
        />
      </div>
    </section>
  );
}

export default Profile;
