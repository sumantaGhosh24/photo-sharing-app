import getServerUser from "@/actions/getServerUser";
import Menubar from "./menu";

const Header = async () => {
  const user = await getServerUser();

  return (
    <div>
      <Menubar user={user} />
    </div>
  );
};

export default Header;
