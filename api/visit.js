// Vercel Serverless Function: /api/visit.js
// Increments visitor count and stores in data.json

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
    // Step 1: Get current data
    let currentData = {};
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
        const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
        currentData = JSON.parse(decoded);
      }
    } catch (e) {
      // File doesn't exist yet
    }

    // Step 2: Increment visitor count
    const currentCount = currentData._visitorCount || 0;
    const newCount = currentCount + 1;
    currentData._visitorCount = newCount;

    // Step 3: Update file
    const content = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');
    
    const body = {
      message: `Update visitor count: ${newCount}`,
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

    return res.status(200).json({
      success: true,
      count: newCount
    });

  } catch (error) {
    console.error('Visitor count error:', error);
    // Return last known count even if update fails
    return res.status(200).json({
      success: false,
      count: 0
    });
  }
}
