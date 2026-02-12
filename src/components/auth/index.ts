/**
 * Auth Components Barrel Export
 * 
 * This file provides a centralized export for all authentication-related UI components.
 * 
 * For Junior Developers:
 * - A "barrel" file is an index.ts that re-exports everything from a folder
 * - This makes imports cleaner: `import { LoginForm } from '~/components/auth'`
 * - Instead of: `import { LoginForm } from '~/components/auth/LoginForm'`
 * - It's a common pattern in TypeScript/JavaScript projects
 * 
 * Usage Example:
 * ```tsx
 * // Instead of:
 * import { LoginForm } from '~/components/auth/LoginForm';
 * import { RegisterForm } from '~/components/auth/RegisterForm';
 * 
 * // You can do:
 * import { LoginForm, RegisterForm } from '~/components/auth';
 * ```
 */

// Form Components
export { LoginForm } from './LoginForm';
export { RegisterForm } from './RegisterForm';
export { SocialLoginButtons } from './SocialLoginButtons';

// Future Phase 4 components (to be created):
// export { AuthGuard } from './AuthGuard';
// export { UserMenu } from './UserMenu';
