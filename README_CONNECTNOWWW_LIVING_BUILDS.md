# ConnectNowww Living Locality Builds

This frontend pack includes the signed-off Login + Home direction and the first version of the Living Locality Design System.

## What changed

### Login / Register
- Rebuilt as a living neighbourhood product demo, not a plain login page.
- Animated locality scene with glowing windows, connection lines, moving locality details, floating discovery cards.
- ChatGPT-style animated local need search.
- Rotating discovery stories for people, opportunities and communities.
- Generic placeholders only, such as `user@example.com`.
- No Amit-specific text in the login experience.
- Scroll-safe desktop and mobile layouts.

### Home
- Living Locality hero instead of a normal rectangular welcome card.
- Morphing headline: helping / learning / celebrating / creating / hiring / waiting.
- Animated mini-locality scene.
- Local Radar scan state.
- Ask ConnectNowww AI as a glowing orb/search experience.
- Discovery chip cloud to explain the breadth of the app.
- Better empty state and marketing copy.
- Existing backend/API logic is preserved.

### Navigation + Security
- Protected routes added with `/api/auth/me` verification.
- `/home` and private pages redirect to `/login` when no valid token exists.
- Topbar search removed.
- Active city pill opens `/settings`.
- Bell opens `/notifications`.
- Account name/avatar opens a dropdown card with profile, my posts, saved, settings and logout.
- Sidebar/mobile nav uses clean lucide icons, not emoji icons.
- Visible brand text is updated to ConnectNowww/connectnowww.

### Notifications
- Added `/notifications` page with loading, empty and notification states.

## How to run

```powershell
cd connectnow-ui
npm install
npm run dev
```

Open:

```txt
http://localhost:5173/login
```

Make sure backend is running at:

```txt
http://127.0.0.1:8001/api
```

Route protection calls:

```txt
GET /api/auth/me
```

If the backend is not running or the token is invalid, protected pages will redirect to `/login`.

## Validation

`npm run build` completed successfully in the generated pack.

`npm run lint` has no errors. It still reports a few warnings from older page effects in CreatePost, Messages, MyNetwork and PostReplies. These are not blocking dev/build.

## Next recommended build

After you review Login and Home visually:

1. Discover People page: constellation-style discovery, compact requests/connections/safety.
2. Create Post: guided local signal builder with live notice-board preview.
3. Inbox: quiet street metaphor for empty state and safer local conversations.
4. Settings: make active city/privacy controls clearer.
