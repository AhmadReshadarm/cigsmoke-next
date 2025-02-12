export {}; // Important for module augmentation

declare global {
  interface Window {
    __initialWindowWidth: number;
  }
}
