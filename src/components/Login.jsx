import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Login() {
  const { user } = useContext(UserContext);
  return <div>login</div>;
}
