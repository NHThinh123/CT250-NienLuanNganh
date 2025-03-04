import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { BusinessContext } from "../contexts/business.context";

export const useAuthEntity = () => {
  const { auth } = useContext(AuthContext);
  const { business } = useContext(BusinessContext);

  if (auth?.user?.id) {
    return {
      isAuthenticated: true,
      entity: {
        type: "user",
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        avatar: auth.user.avatar,
        dateOfBirth: auth.user.dateOfBirth,
      },
    };
  } else if (business?.business?.id) {
    return {
      isAuthenticated: true,
      entity: {
        type: "business",
        id: business.business.id,
        name: business.business.business_name,
        email: business.business.email,
        avatar: business.business.avatar,
        contact_info: business.business.contact_info,
        location: business.business.location,
        open_hours: business.business.open_hours,
        close_hours: business.business.close_hours,
      },
    };
  } else {
    return {
      isAuthenticated: false,
      entity: { type: "" },
    };
  }
};
