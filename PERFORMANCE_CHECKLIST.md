# QRganize Performance & Testing Checklist

## Lighthouse Audit Instructions

### How to Run Lighthouse Audits

1. **Open Chrome DevTools**
   - Navigate to each page listed below
   - Press F12 to open DevTools
   - Click the "Lighthouse" tab
   - Select all categories: Performance, Accessibility, Best Practices, PWA, SEO
   - Choose "Desktop" or "Mobile" mode
   - Click "Analyze page load"

2. **Pages to Audit**
   - `/login` - Login page (public)
   - `/signup` - Signup page (public)
   - `/` - Dashboard (after login)
   - `/items` - Items list
   - `/locations` - Locations list
   - `/scan` - QR scanner
   - `/search` - Search page

### Target Scores (v1.0.0)
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **PWA**: ≥ 90
- **SEO**: ≥ 80

---

## Performance Optimization Analysis

### Current Bundle Sizes (Analyzed from build output)
```
First Load JS: 103 kB (shared)
- chunks/4bd1b696: 54.2 kB
- chunks/61: 47.3 kB
- other shared chunks: 1.94 kB

Largest routes:
- /scan: 217 kB (includes QR scanning libraries)
- /item/[slug]: 118 kB
- /location/[slug]: 118 kB
```

**Status**: ✅ Excellent - All routes under 250 kB

### Recommended Optimizations

#### 1. Image Optimization
**Current Status**: Using `<img>` tags in QRCodeDisplay and QRCodeModal

**Action Required**:
- Replace `<img>` with Next.js `<Image />` component
- Files to update:
  - `src/components/QRCodeDisplay.tsx` (line 110)
  - `src/components/QRCodeModal.tsx` (line 131)

**Expected Impact**: +5-10 performance score

#### 2. Code Splitting (Already Implemented)
**Status**: ✅ Next.js 15 automatically code-splits routes
- Each page has separate bundles
- Shared code is chunked efficiently

#### 3. Service Worker Caching (Already Implemented)
**Status**: ✅ Serwist configured with offline support
- Critical assets cached
- Offline functionality working

#### 4. Loading States (Already Implemented)
**Status**: ✅ Skeleton screens on all major routes
- Improves perceived performance
- Reduces Cumulative Layout Shift

---

## Accessibility Checklist

### ✅ Implemented
- [x] Focus rings on all interactive elements (Button component)
- [x] ARIA labels on icon buttons
- [x] Semantic HTML (headings, nav, main)
- [x] Keyboard navigation support
- [x] Touch targets ≥ 44px (mobile CSS)
- [x] Color contrast (dark theme with slate colors)

### ⚠️ Needs Verification
- [ ] Screen reader testing
- [ ] Alt text on all images/QR codes
- [ ] Form error announcements
- [ ] Skip to content link

**Action Required**:
1. Test with VoiceOver (Mac) or NVDA (Windows)
2. Add descriptive alt text to QR code images
3. Add `aria-live` regions for dynamic content

---

## PWA Checklist

### ✅ Implemented
- [x] Web app manifest (`/manifest.webmanifest`)
- [x] Service worker with offline support
- [x] Install prompt (InstallPrompt component)
- [x] HTTPS (required for production)
- [x] Responsive meta viewport
- [x] Theme color
- [x] Icons (192x192, 512x512)

### Testing PWA Installation
1. Deploy to Vercel (HTTPS required)
2. Open in Chrome/Edge
3. Look for install prompt in address bar
4. Install to home screen
5. Test offline functionality
6. Verify standalone mode detection

---

## Mobile Testing Checklist

### iOS Testing (Safari)
- [ ] QR scanner file upload mode works
- [ ] Camera permissions handled correctly
- [ ] Touch targets are adequate
- [ ] Scrolling is smooth
- [ ] Forms work without keyboard issues
- [ ] PWA install works ("Add to Home Screen")
- [ ] Offline mode functions correctly

### Android Testing (Chrome)
- [ ] QR scanner camera mode works
- [ ] Environment camera (rear camera) selected
- [ ] Touch interactions responsive
- [ ] PWA install prompt appears
- [ ] Offline caching works
- [ ] Service worker registers correctly

### Responsive Breakpoints
- [ ] 375px (iPhone SE) - Mobile layout
- [ ] 768px (iPad) - Tablet layout
- [ ] 1024px (iPad Pro) - Desktop layout
- [ ] 1920px (Desktop) - Large desktop

---

## Performance Metrics to Monitor

### Core Web Vitals
| Metric | Target | How to Measure |
|--------|--------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse, Chrome DevTools |
| **FID** (First Input Delay) | < 100ms | Real user monitoring |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Lighthouse |

### Additional Metrics
- **TTI** (Time to Interactive): < 3.5s
- **Speed Index**: < 3.0s
- **Total Blocking Time**: < 300ms

---

## Known Issues to Address

### 1. Webpack Warning
```
[webpack.cache.PackFileCacheStrategy] Serializing big strings (128kiB)
impacts deserialization performance
```
**Impact**: Minor - only affects build time
**Fix**: Not critical for v1.0.0

### 2. Supabase Edge Runtime Warnings
**Impact**: None - Supabase handles this internally
**Fix**: Can be ignored

### 3. ESLint Warnings
- QRCodeDisplay.tsx - `<img>` usage (fix with Next.js Image)
- QRCodeModal.tsx - `<img>` usage (fix with Next.js Image)
- QRScanner.tsx - Missing dependencies in useEffect

**Action**: Address before v1.0.0 release

---

## Performance Testing Steps

### 1. Network Throttling Test
1. Open Chrome DevTools
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Test all major pages
5. Verify loading states appear correctly
6. Ensure offline mode works

### 2. Large Dataset Test
1. Seed database with:
   - 100+ locations
   - 500+ items
2. Test list page performance
3. Verify search performance
4. Check pagination/virtualization

### 3. Concurrent User Test
1. Open app in multiple browser tabs
2. Edit same item in different tabs
3. Verify data consistency
4. Test real-time updates (if applicable)

---

## Pre-Deployment Checklist

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (if needed)

### Build Verification
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint critical errors
- [ ] Bundle sizes are acceptable

### Security
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] API routes protected
- [ ] No sensitive data in client-side code
- [ ] CSRF protection enabled
- [ ] XSS prevention verified

---

## Optimization Recommendations Priority

### High Priority (Before v1.0.0)
1. ✅ Loading states - COMPLETED
2. ✅ Service worker - COMPLETED
3. ⚠️ Image optimization - Replace `<img>` with `<Image />`
4. ⚠️ Fix ESLint warnings

### Medium Priority (v1.0.0 or later)
1. Implement image lazy loading
2. Add critical CSS inlining
3. Optimize font loading
4. Consider adding a CDN for static assets

### Low Priority (Future releases)
1. Implement virtual scrolling for large lists
2. Add route prefetching
3. Consider WebP image format
4. Implement analytics tracking

---

## Testing Coverage

### Manual Testing Required
- [ ] All CRUD operations (Create, Read, Update, Delete)
- [ ] QR code generation and scanning
- [ ] Search functionality
- [ ] Authentication flows
- [ ] Authorization (RLS)
- [ ] Error handling
- [ ] Edge cases (see TESTING.md for full scenarios)

### Automated Testing (Future)
Consider adding:
- Playwright E2E tests
- Jest unit tests
- Cypress component tests

---

## Final Deployment Checklist

### Vercel Deployment
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `.next`
- [ ] Enable automatic deployments
- [ ] Configure custom domain (optional)
- [ ] Test production build

### Docker Deployment
- [ ] Create optimized Dockerfile
- [ ] Build Docker image
- [ ] Test container locally
- [ ] Push to container registry
- [ ] Deploy to hosting platform
- [ ] Configure environment variables
- [ ] Set up health checks

---

## Post-Deployment Monitoring

### Metrics to Track
1. **Performance**: Use Vercel Analytics or Google PageSpeed Insights
2. **Errors**: Monitor Sentry or similar error tracking
3. **Usage**: Track page views, popular features
4. **PWA**: Monitor install rate, offline usage

### Regular Audits
- Run Lighthouse monthly
- Check Core Web Vitals in Google Search Console
- Review error logs weekly
- Update dependencies quarterly

---

Last updated: 2025-11-21
Version: 1.0.0-pre
