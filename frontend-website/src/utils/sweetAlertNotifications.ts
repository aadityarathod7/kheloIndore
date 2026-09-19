import Swal from "sweetalert2";

type AlertOptions = Record<string, unknown>;
type AlertApi = { fire: (...args: unknown[]) => ReturnType<typeof Swal.fire> };

const isInteractiveAlert = (options: AlertOptions) => Boolean(
  options.input || options.html || options.showCancelButton || options.showDenyButton ||
  options.preConfirm || options.didOpen || options.willOpen || options.confirmButtonText ||
  options.showLoaderOnConfirm
);

const toOptions = (args: unknown[]): AlertOptions => {
  const [first, second, third] = args;
  if (first && typeof first === "object" && !Array.isArray(first)) return first as AlertOptions;
  return { title: first, text: typeof second === "string" ? second : undefined, icon: typeof third === "string" ? third : undefined };
};

/** Makes routine SweetAlert messages into one minimal, non-blocking toast. */
export const configureSweetAlertNotifications = () => {
  const alertApi = Swal as unknown as AlertApi & { __kiToastConfigured?: boolean };
  if (alertApi.__kiToastConfigured) return;

  const originalFire = alertApi.fire.bind(Swal);
  alertApi.fire = (...args: unknown[]) => {
    const options = toOptions(args);
    if (isInteractiveAlert(options)) return originalFire(...args);
    return originalFire({
      ...options, toast: true, position: "bottom-end", showConfirmButton: false,
      showCloseButton: true, timer: typeof options.timer === "number" ? options.timer : 3600,
      timerProgressBar: true,
      customClass: { ...(typeof options.customClass === "object" && options.customClass ? options.customClass : {}), popup: "ki-minimal-toast", title: "ki-minimal-toast-title" },
      didOpen: (toast: HTMLElement) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };
  alertApi.__kiToastConfigured = true;
};
