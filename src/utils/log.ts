export function log(message?: any, ...optionalParams: any[]) {
  if (import.meta.env.VITE_DEBUG && import.meta.env.VITE_DEBUG === 'true') {
    console.log(message, ...optionalParams);
  }
}
