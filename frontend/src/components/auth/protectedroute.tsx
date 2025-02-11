import {ReactNode, useContext, useEffect} from 'react';
import {AuthContext} from "../../auth/authcontext.tsx";
import {useNavigate} from "react-router-dom";


const ProtectedRoute = ({ children }: {children: ReactNode}) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // not loading and not authenticated. we need to re-auth.
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isAuthenticated) {
    return children;
  }
  else if (isLoading) {
    return (
      <div>Loading...</div>
    );
  } else {
    // just return null or a fragment, navigation will be handled by useEffect
    return null;
  }
};

export default ProtectedRoute;
