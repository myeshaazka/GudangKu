const fetch = global.fetch || require('node-fetch');
const user = process.argv[2] || 'admin@gudangku.com';
const password = process.argv[3] || 'admin123';

(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user, password }),
    });
    const text = await res.text();
    console.log('status', res.status);
    console.log('body', text);
  } catch (e) {
    console.error(e);
  }
})();
