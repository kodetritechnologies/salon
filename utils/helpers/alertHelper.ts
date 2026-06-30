import Swal from "sweetalert2";

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#4DB7FF",
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#e3342f",
  });
};

export const confirmAction = async (title: string, text?: string, confirmText: string = "Yes") => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#8e908f",
    confirmButtonText: confirmText,
  });
  return result.isConfirmed;
};
