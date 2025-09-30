import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";

const SidebarItems = ({ onCreateClick, onSearchClick }) => {
	return (
		<>
			<Home />
			<Search onSearchClick={onSearchClick} />
			<Notifications />
			<CreatePost onCreateClick={onCreateClick} />
			<ProfileLink />
		</>
	);
};

export default SidebarItems;
