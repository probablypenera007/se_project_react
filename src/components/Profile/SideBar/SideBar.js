//import avatar from "../../../images/avatar.svg";
import "./SideBar.css";

const SideBar = ({
  onLogOut, 
  currentUser,
  onEditProfile,
  isLoggedIn
}) => {
  return (
    <section className="sidebar">
      <div className="sidebar__content">
        <img
          className="sidebar__avatar"
          src={ 
            currentUser.avatar 
            }
          alt="sidebar avatar icon"
        />
        <p className="sidebar__name">{ 
        currentUser.name
       }</p>
        <button className="sidebar__button-logout" type="button" onClick={onLogOut} >
          Log Out
        </button>
        <button className="sidebar__button-edit" type="button" onClick={onEditProfile} >
          Change Profile Data
        </button>
      </div>
    </section>
  );
};

export default SideBar;
