// Vercel Serverless Function: /api/sync.js
// This function securely updates data.json in your GitHub repo

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // GitHub credentials from environment variables
  const GH_TOKEN = process.env.GITHUB_TOKEN;
  const GH_USER = process.env.GITHUB_USER || 'gajveenastores-dotcom';
  const GH_REPO = process.env.GITHUB_REPO || '75hard';
  const GH_FILE = 'data.json';

  if (!GH_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  const GH_API = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/${GH_FILE}`;

  try {
    // Step 1: Get current file SHA (if exists)
    let currentSha = null;
    try {
      const getRes = await fetch(GH_API, {
        headers: {
          'Authorization': `token ${GH_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        currentSha = fileData.sha;
      }
    } catch (e) {
      // File doesn't exist yet, that's okay
    }

    // Step 2: Create/Update file
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    
    const body = {
      message: `Update tracker data — ${new Date().toISOString().split('T')[0]}`,
      content: content,
      ...(currentSha ? { sha: currentSha } : {})
    };

    const putRes = await fetch(GH_API, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GH_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      throw new Error(errorData.message || `GitHub API error: ${putRes.status}`);
    }

    const result = await putRes.json();

    return res.status(200).json({
      success: true,
      message: 'Data synced to GitHub successfully!',
      commit: result.commit.sha
    });

  } catch (error) {
    console.error('GitHub sync error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to sync to GitHub'
    });
  }
}
