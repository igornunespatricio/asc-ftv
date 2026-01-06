// Global type declarations
declare global {
  interface Window {
    APP_CONFIG: {
      apiUrl: string;
    };
  }
}

// Function declarations for non-TypeScript modules
declare function authFetch(path: string, options?: RequestInit): Promise<Response>;
declare function canManageGames(): boolean;
declare function logout(): void;
declare function requireAuth(): void;
declare function publicFetch(path: string, options?: RequestInit): Promise<Response>;
