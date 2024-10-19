import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const userNavigate = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/signin')
    }
  })
}

export default userNavigate;
