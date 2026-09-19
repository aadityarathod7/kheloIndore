import Swal, { type SweetAlertIcon } from "sweetalert2";

/** A compact, non-blocking notification for routine feedback. */
export const showToast = (
  title: string,
  icon: SweetAlertIcon = "success",
  timer = 3200
) =>
  Swal.fire({
    toast: true,
    position: "bottom-end",
    icon,
    title,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: "ki-minimal-toast",
      title: "ki-minimal-toast-title",
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
