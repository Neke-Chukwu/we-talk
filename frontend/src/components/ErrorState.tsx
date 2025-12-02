interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  actionLabel = 'Try again',
  onRetry,
}: ErrorStateProps) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default ErrorState;


