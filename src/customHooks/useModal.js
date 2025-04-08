import { useState } from "react";

export default function useModal() {
  const [modalState, setModalState] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const showModal = (title, message) => {
    setModalState({
      visible: true,
      title,
      message,
    });
  };

  const hideModal = () => {
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }));
  };
  return { modalState, showModal, hideModal };
}
