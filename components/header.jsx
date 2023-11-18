import Menubar from "./menu";
import getServerUser from "@/actions/getServerUser";

const Header = async () => {
  const user = await getServerUser();

  return (
    <div>
      <Menubar user={user} />
    </div>
  );
};

export default Header;
