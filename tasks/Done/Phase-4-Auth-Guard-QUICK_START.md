# Quick Installation - Phase 4

## Copy These Files to Your Project

### 1. AuthGuard Component
**From**: `AuthGuard.tsx`  
**To**: `src/components/auth/AuthGuard.tsx`

### 2. Account Layout
**From**: `account-layout.tsx`  
**To**: `src/routes/account/layout.tsx`

### 3. Profile Page
**From**: `account-index.tsx`  
**To**: `src/routes/account/index.tsx`

---

## File Structure After Installation

```
src/
├── components/
│   └── auth/
│       └── AuthGuard.tsx          ← Copy here
│
└── routes/
    └── account/
        ├── layout.tsx              ← Copy here
        └── index.tsx               ← Copy here
```

---

## Test After Installation

1. Start your dev server: `pnpm dev`
2. Visit `/account` while logged out
3. You should be redirected to `/auth/login`
4. Log in
5. You should see your profile page at `/account`

---

## Troubleshooting

If you get errors:

1. **"Module not found: ~/contexts/auth"**
   - Make sure you completed Phase 2 (Auth Context)
   - Verify `src/contexts/auth/index.ts` exists

2. **"useAuth must be used within AuthProvider"**
   - Wrap your app with `<AuthProvider>` in `src/routes/layout.tsx`

3. **"Cannot find AuthGuard"**
   - Check the import path: `~/components/auth/AuthGuard`
   - Make sure file is in correct location

---

## What You Get

✅ Protected /account route  
✅ User profile page with editing  
✅ Password change functionality  
✅ Account statistics display  
✅ Automatic redirect to login  
✅ Return to page after login  
✅ Loading states while checking auth  

---

## Next Steps

After installation and testing:
- Move to Phase 5: Password Reset
- Or Phase 6: Header Integration

See `IMPLEMENTATION_GUIDE.md` for detailed docs.
