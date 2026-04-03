import { ApiError } from "../api/client";

export function ErrorBanner({
  error,
  onDismiss,
}: {
  error: unknown;
  onDismiss?: () => void;
}) {
  if (error == null) return null;

  let message = "Đã xảy ra lỗi.";
  let status: number | undefined;

  if (error instanceof ApiError) {
    status = error.status;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const statusLabel =
    status === 404
      ? "Không tìm thấy (404)"
      : status === 409
        ? "Xung đột dữ liệu (409)"
        : status != null
          ? `Lỗi ${status}`
          : null;

  return (
    <div className="alert alert-error" role="alert">
      <div className="stack">
        {statusLabel && <span className="badge">{statusLabel}</span>}
        <span>{message}</span>
        {onDismiss && (
          <button type="button" className="ghost" onClick={onDismiss}>
            Đóng
          </button>
        )}
      </div>
    </div>
  );
}
