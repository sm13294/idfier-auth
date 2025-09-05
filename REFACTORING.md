# Refactoring Documentation

## Overview

The codebase has been refactored from a single large `page.tsx` file into multiple smaller, focused components and custom hooks for better maintainability and reusability.

## New Structure

### Components (`/src/components/`)

#### 1. `MainCard.tsx`

- **Purpose**: Main landing page card with welcome message and login button
- **Props**: `onLogin: () => void`
- **Features**: Gradient design, hover animations, responsive layout

#### 2. `IdfierLoginModal.tsx`

- **Purpose**: Modal for Idfier authentication flow
- **Props**:
  - `isOpen: boolean`
  - `status: "idle" | "loading" | "pending" | "started" | "scanned" | "success" | "error"`
  - `currentQRData: string`
  - `apiError: string | null`
  - `onClose: () => void`
  - `onRetry: () => void`
- **Features**: Multiple states, QR code display, error handling

#### 3. `UserDataDisplay.tsx`

- **Purpose**: Display authenticated user data
- **Props**:
  - `userData: UserData`
  - `onLogout: () => void`
- **Features**: Card-based layout, user information display, logout functionality

#### 4. `ErrorToast.tsx`

- **Purpose**: Toast notification for errors
- **Props**:
  - `error: string | null`
  - `onClose: () => void`
- **Features**: Dismissible, responsive design

### Hooks (`/src/hooks/`)

#### 1. `useIdfierAuth.ts`

- **Purpose**: Custom hook managing all Idfier authentication logic
- **Returns**:
  - State: `userData`, `showIdfierLogin`, `idfierStatus`, `currentQRData`, `apiError`
  - Refs: `qrContainerRef`
  - Actions: `handleIdfierLogin`, `handleCloseModal`, `handleLogout`, `handleCloseError`
- **Features**: QR code generation, polling management, state management

### Main Page (`/src/app/page.tsx`)

- **Purpose**: Main application entry point
- **Features**:
  - Uses `useIdfierAuth` hook for state management
  - Renders appropriate components based on state
  - Clean, minimal structure

## Benefits of Refactoring

### 1. **Separation of Concerns**

- Each component has a single responsibility
- Logic is separated from UI components
- Custom hooks encapsulate business logic

### 2. **Reusability**

- Components can be easily reused in other parts of the application
- Custom hooks can be shared across components
- Props make components flexible and configurable

### 3. **Maintainability**

- Smaller files are easier to understand and modify
- Changes to one component don't affect others
- Clear interfaces through TypeScript props

### 4. **Testability**

- Individual components can be tested in isolation
- Custom hooks can be tested independently
- Mocking is easier with smaller, focused units

### 5. **Performance**

- Components only re-render when their props change
- Custom hooks can optimize re-renders
- Better code splitting opportunities

## File Structure

```
src/
├── app/
│   └── page.tsx (45 lines - was 736 lines)
├── components/
│   ├── MainCard.tsx (45 lines)
│   ├── IdfierLoginModal.tsx (200 lines)
│   ├── UserDataDisplay.tsx (150 lines)
│   └── ErrorToast.tsx (35 lines)
├── hooks/
│   ├── useIdfier.ts (existing)
│   └── useIdfierAuth.ts (120 lines)
└── lib/
    └── services/ (existing)
```

## Usage Example

```tsx
// Before (all in page.tsx)
export default function Home() {
  // 700+ lines of mixed logic and UI
}

// After (clean separation)
export default function Home() {
  const {
    userData,
    showIdfierLogin,
    idfierStatus,
    currentQRData,
    apiError,
    qrContainerRef,
    handleIdfierLogin,
    handleCloseModal,
    handleLogout,
    handleCloseError,
  } = useIdfierAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!userData ? (
          <>
            <MainCard onLogin={handleIdfierLogin} />
            <IdfierLoginModal
              isOpen={showIdfierLogin}
              status={idfierStatus}
              currentQRData={currentQRData}
              apiError={apiError}
              onClose={handleCloseModal}
              onRetry={handleIdfierLogin}
            />
          </>
        ) : (
          <UserDataDisplay userData={userData} onLogout={handleLogout} />
        )}
      </div>

      <ErrorToast error={apiError} onClose={handleCloseError} />
    </div>
  );
}
```

## Next Steps

1. Add unit tests for each component
2. Add Storybook stories for component documentation
3. Consider adding error boundaries
4. Add loading states for better UX
5. Implement accessibility improvements
