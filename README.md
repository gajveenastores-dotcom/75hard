# 75 Hard Challenge Tracker

Automated tracking system for your 75 Hard journey with public viewing and secure admin updates.

## Features

- ✅ **Public-facing tracker** - Visitors see your progress in real-time
- ✅ **Secure admin panel** - Password-protected updates
- ✅ **Auto-sync to GitHub** - Serverless function handles all commits
- ✅ **Beautiful UI** - Clean, responsive design
- ✅ **No manual git commands** - Just fill the form and click save

## Setup Instructions

### 1. Create a New GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `75hard-tracker`
4. Select scope: **`repo`** (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 2. Deploy to Vercel

1. Push this code to your GitHub repo:
   ```bash
   cd /path/to/your/repo
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to https://vercel.com and sign in with GitHub

3. Click "Add New Project" → Import your `75hard` repo

4. Before deploying, add **Environment Variables**:
   - `GITHUB_TOKEN` = your token from step 1
   - `GITHUB_USER` = `gajveenastores-dotcom`
   - `GITHUB_REPO` = `75hard`

5. Click "Deploy"

### 3. Your Site URLs

After deployment:
- **Public tracker**: `https://your-project.vercel.app/`
- **Admin panel**: `https://your-project.vercel.app/admin.html`

### 4. Change Admin Password

Edit `admin.html` line 195:
```javascript
const ADMIN_PASSWORD = 'Kandarp@75hard'; // CHANGE THIS!
```

Change it to your own secure password, then push to GitHub:
```bash
git add admin.html
git commit -m "Update admin password"
git push
```

Vercel will auto-deploy the change.

## How to Use

### Daily Updates

1. Open `https://your-project.vercel.app/admin.html`
2. Enter your password
3. Fill in your daily data
4. Click "Save & Sync to GitHub"
5. Done! ✅ Data is now live on the public site

### View Your Progress

- Anyone can visit `https://your-project.vercel.app/`
- They'll see your real-time progress
- They cannot edit anything

## Files

```
75hard/
├── index.html          # Public tracker (read-only)
├── admin.html          # Admin panel (password-protected)
├── data.json           # Your tracking data
├── api/
│   └── sync.js         # Serverless function for GitHub sync
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## Troubleshooting

### "GitHub token not configured"
- Make sure you added `GITHUB_TOKEN` in Vercel environment variables
- Redeploy after adding env vars

### "Permission denied" on sync
- Check your token has `repo` scope
- Regenerate token if needed

### Admin password not working
- Clear browser cache
- Make sure you edited `admin.html` and pushed to GitHub
- Check Vercel deployed the latest version

## Security Notes

- ✅ Token is stored in Vercel env vars (not in code)
- ✅ Admin panel is password-protected
- ✅ Public site is read-only
- ⚠️ Change the default password immediately!

## Support

If you run into issues, check:
1. Vercel deployment logs
2. Browser console (F12)
3. Make sure your GitHub token is valid

---

Built with ❤️ for your 75 Hard journey!
