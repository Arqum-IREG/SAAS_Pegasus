import {useContext} from "react";
import {AuthContext} from "../../auth/authcontext";


export default function Profile() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src={user?.avatarUrl}/>
          </div>
        </div>
      </div>
      <div>
        <p className="font-extrabold">
          {user?.getDisplayName}
        </p>
        <p>
          {user?.email}
        </p>
      </div>
    </div>
  );
}
