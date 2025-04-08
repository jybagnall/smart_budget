import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

import { toast } from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    icon: (
      <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />
    ),
    duration: 3000,
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    icon: (
      <ExclamationCircleIcon
        aria-hidden="true"
        className="size-6 text-rose-500"
      />
    ),
    duration: 3000,
    style: {
      borderRadius: "10px",
      background: "#550000",
      color: "#fff",
    },
  });
};
