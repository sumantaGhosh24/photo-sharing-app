import Error from "./error";
import UserList from "./users-list";
import {getUsers} from "@/actions/userActions";

const SearchUser = async ({page, search}) => {
  const res = await getUsers({page, search});

  return (
    <>
      {res?.resMessage ? (
        <Error resMessage={res.resMessage} />
      ) : (
        <UserList
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getUsers}
          query={{page, search}}
        />
      )}
    </>
  );
};

export default SearchUser;
