## Playwright Testing Scenarios

### Authentication & Authorization Tests
1. **User Registration Flow**
   - Navigate to signup page
   - Fill in email and password fields
   - Submit form and verify successful registration
   - Verify redirect to dashboard after signup
   - Test validation errors (invalid email, weak password, mismatched passwords)

2. **User Login Flow**
   - Navigate to login page
   - Fill in valid credentials
   - Submit form and verify successful login
   - Verify redirect to dashboard
   - Test login with invalid credentials
   - Verify error message display

3. **User Logout Flow**
   - Log in as authenticated user
   - Click sign out button
   - Verify redirect to login page
   - Verify session is cleared (can't access protected routes)

4. **Protected Route Access**
   - Attempt to access /locations without authentication
   - Verify redirect to login page
   - Repeat for /items, /scan, and other protected routes

### Location Management Tests
5. **Create Root Location**
   - Navigate to create location page
   - Fill in location name and description
   - Submit without parent location
   - Verify location appears in locations list
   - Verify QR code is generated

6. **Create Child Location**
   - Create a parent location first
   - Navigate to create location page
   - Fill in name and select parent location from dropdown
   - Submit form
   - Verify breadcrumb navigation shows parent > child
   - Verify location appears under parent

7. **View Location Details**
   - Create a location
   - Navigate to location detail page
   - Verify location name, description displayed
   - Verify QR code modal can be opened
   - Verify breadcrumb navigation is correct
   - Verify child locations are listed
   - Verify items in location are listed

8. **Edit Location**
   - Create a location
   - Navigate to edit page
   - Update name and description
   - Submit changes
   - Verify updates are reflected on detail page

9. **Delete Location**
   - Create a location without children or items
   - Click delete button
   - Confirm deletion in dialog
   - Verify location is removed from list
   - Test that locations with children show warning/prevent deletion

10. **Location Hierarchy Navigation**
    - Create nested locations (3 levels deep)
    - Navigate through hierarchy using breadcrumbs
    - Verify correct parent/child relationships
    - Test "back to parent" navigation

### Item Management Tests
11. **Create Item Without Location**
    - Navigate to create item page
    - Fill in item name, description, quantity
    - Submit without assigning location
    - Verify item appears in items list as unassigned
    - Verify warning on dashboard for unassigned items

12. **Create Item With Location**
    - Create a location first
    - Navigate to create item page
    - Fill in item details and select location
    - Submit form
    - Verify item appears in location detail page
    - Verify QR code is generated

13. **View Item Details**
    - Create an item
    - Navigate to item detail page
    - Verify item name, description, quantity displayed
    - Verify location link (if assigned)
    - Verify QR code modal functionality

14. **Edit Item**
    - Create an item
    - Navigate to edit page
    - Update item details and location
    - Submit changes
    - Verify updates reflected on detail page

15. **Move Item Between Locations**
    - Create multiple locations
    - Create an item in location A
    - Edit item and reassign to location B
    - Verify item removed from location A
    - Verify item appears in location B

16. **Delete Item**
    - Create an item
    - Click delete button
    - Confirm deletion
    - Verify item removed from list and location

### QR Code Tests
17. **QR Code Generation for Location**
    - Create a location
    - Open QR code modal
    - Verify QR code image is displayed
    - Verify QR code encodes correct URL format
    - Test download QR code functionality
    - Test copy URL to clipboard

18. **QR Code Generation for Item**
    - Create an item
    - Open QR code modal
    - Verify QR code displays
    - Verify URL format is correct (slug-based)
    - Test download and copy functionality

19. **QR Code Scanning - Camera Mode**
    - Navigate to /scan page
    - Grant camera permissions (mock if needed)
    - Scan QR code for a location
    - Verify auto-navigation to location detail page
    - Repeat for item QR code

20. **QR Code Scanning - File Upload Mode (iOS)**
    - Detect or mock iOS device
    - Navigate to /scan page
    - Upload QR code image file
    - Verify successful scan and navigation

21. **External QR Code Handling**
    - Scan a non-QRganize QR code
    - Verify error message or rejection
    - Test external product barcode scanning
    - Verify URL conversion (domain/item-slug → domain/items/item-slug)

22. **Scan Button Quick Access**
    - Test scan button in TopBar from various pages
    - Verify navigation to /scan route
    - Test responsive behavior (icon-only on mobile, icon+text on desktop)

### Search Functionality Tests
23. **Search for Locations**
    - Create multiple locations with distinct names
    - Use search bar to find specific location
    - Verify search results show matching locations
    - Test partial match searching

24. **Search for Items**
    - Create multiple items
    - Search by item name
    - Verify results show matching items
    - Test search with item descriptions

25. **Search Filtering**
    - Populate database with locations and items
    - Test filter for locations only
    - Test filter for items only
    - Verify filtered results are accurate

26. **Search with No Results**
    - Enter search query with no matches
    - Verify "no results" message
    - Test empty search submission

### Dashboard & Navigation Tests
27. **Dashboard Statistics**
    - Log in and view dashboard
    - Verify total locations count is accurate
    - Verify total items count is accurate
    - Verify unassigned items warning appears when applicable

28. **Recent Activity Display**
    - Create 5+ locations and items
    - View dashboard
    - Verify last 5 locations shown with timestamps
    - Verify last 5 items shown with location info

29. **Dashboard Quick Actions**
    - Test "View All" buttons in statistics cards
    - Test "Create" buttons for locations and items
    - Verify navigation to correct pages

30. **Sidebar Navigation**
    - Test all navigation links (Home, Locations, Items, Scan)
    - Verify active page highlighting
    - Test Create dropdown menu functionality
    - Test logo/title click navigates to home

31. **Mobile Sidebar**
    - Test on mobile viewport
    - Toggle hamburger menu
    - Verify slide-in animation
    - Test navigation links in mobile sidebar
    - Verify user info in sidebar footer on mobile

### PWA & Mobile Tests
32. **PWA Installation Prompt**
    - Load app in browser (not standalone mode)
    - Wait 30 seconds
    - Verify install banner appears
    - Test dismiss functionality
    - Verify 7-day cooldown after dismissal

33. **PWA Installation**
    - Trigger install prompt
    - Install app to home screen
    - Launch from home screen
    - Verify standalone mode detection
    - Verify install banner doesn't show in standalone mode

34. **Offline Functionality**
    - Install PWA and navigate to several pages
    - Go offline (disable network)
    - Navigate to cached pages
    - Verify content loads from cache
    - Attempt to create/update data offline
    - Go back online and verify sync

35. **Service Worker Caching**
    - Load pages in app
    - Check service worker registration
    - Verify critical assets are cached
    - Test cache invalidation on updates

36. **Mobile Viewport & Touch Targets**
    - Test on mobile viewport
    - Verify all buttons/links meet 44px minimum touch target
    - Test tap highlights
    - Verify smooth scrolling
    - Test pull-to-refresh doesn't conflict

37. **Camera Integration (Mobile)**
    - Test QR scanner on mobile device
    - Verify camera permission request
    - Test environment camera selection (rear camera)
    - Verify capture="environment" attribute works
    - Test seamless scanning experience

### Responsive Design Tests
38. **Desktop Layout**
    - Test on 1920px viewport
    - Verify sidebar always visible
    - Verify user info in TopBar
    - Test all interactive elements

39. **Tablet Layout**
    - Test on tablet viewport (768px)
    - Verify responsive breakpoints
    - Test hamburger menu behavior

40. **Mobile Layout**
    - Test on mobile viewport (375px)
    - Verify hamburger menu
    - Verify scan button (icon-only)
    - Test all pages are mobile-friendly
    - Verify forms are usable on mobile

### UI/UX & Accessibility Tests
41. **Loading States**
    - Test loading indicators during data fetching
    - Verify skeleton screens display correctly
    - Test form submission loading states

42. **Form Validation**
    - Test all forms with empty required fields
    - Test maximum length validations
    - Verify error messages are clear and helpful
    - Test inline validation feedback

43. **Confirmation Dialogs**
    - Test delete confirmation for locations
    - Test delete confirmation for items
    - Verify cancel button works
    - Verify confirm button executes action

44. **Dark Mode Support**
    - Toggle dark mode
    - Verify all pages render correctly
    - Check color contrast ratios
    - Verify QR codes remain scannable

45. **Keyboard Navigation**
    - Navigate through app using only keyboard
    - Test tab order is logical
    - Verify all interactive elements are accessible
    - Test form submission with Enter key

46. **Screen Reader Compatibility**
    - Test with screen reader
    - Verify alt text on images/icons
    - Check ARIA labels
    - Verify semantic HTML structure

### Performance Tests
47. **Lighthouse Audit**
    - Run Lighthouse on key pages (/, /items, /locations, /scan)
    - Verify Performance score > 90
    - Verify Accessibility score > 90
    - Verify Best Practices score > 90
    - Verify PWA score > 90

48. **Page Load Performance**
    - Measure Largest Contentful Paint < 2.5s
    - Measure First Input Delay < 100ms
    - Measure Cumulative Layout Shift ≤ 0.1
    - Test on throttled network (3G)

49. **Large Dataset Performance**
    - Seed database with 100+ locations
    - Seed database with 500+ items
    - Test list page performance
    - Test search performance
    - Verify pagination/virtualization if implemented

### Edge Cases & Error Handling Tests
50. **Deep Location Hierarchy**
    - Create locations nested 10+ levels deep
    - Test breadcrumb navigation
    - Verify performance with deep nesting
    - Test hierarchy display limits

51. **Special Characters in Names**
    - Create location with special chars (!@#$%^&*)
    - Create item with emoji in name
    - Verify proper URL encoding in slugs
    - Test QR code generation with special chars

52. **Very Long Names/Descriptions**
    - Test with 500+ character descriptions
    - Verify text truncation/overflow handling
    - Test QR code generation with long URLs

53. **Concurrent Edits**
    - Open item in two browser tabs
    - Edit in both tabs simultaneously
    - Verify last save wins or conflict handling

54. **Network Error Handling**
    - Simulate network errors during API calls
    - Verify user-friendly error messages
    - Test retry mechanisms
    - Verify app doesn't crash

55. **Database Constraint Violations**
    - Test deleting location with child locations
    - Verify error handling
    - Test deleting location with items
    - Verify appropriate warnings/blocks

### Security Tests
56. **Row Level Security (RLS)**
    - Create items/locations as User A
    - Log in as User B
    - Verify User B cannot see User A's data
    - Test API endpoints respect RLS

57. **XSS Prevention**
    - Input script tags in location/item names
    - Verify content is properly escaped
    - Test with various XSS payloads

58. **SQL Injection Prevention**
    - Input SQL queries in search/form fields
    - Verify proper parameterization
    - Test with common SQL injection patterns

59. **CSRF Protection**
    - Verify form submissions include CSRF tokens
    - Test cross-origin request blocking

60. **Authentication Token Handling**
    - Verify tokens are stored securely
    - Test token expiration and refresh
    - Verify logout clears all tokens

### Integration Tests
61. **End-to-End User Journey**
    - Sign up new account
    - Create root location
    - Create child location
    - Create item in location
    - Generate QR codes
    - Scan QR code
    - Search for item
    - Move item to different location
    - Delete item
    - Delete location

62. **Multi-User Collaboration** (for Version 1.5.0)
    - User A creates location and shares with User B
    - User B accesses shared location
    - Test read-only vs edit permissions
    - Verify notifications
