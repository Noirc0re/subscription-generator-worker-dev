const HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SubLink Generator</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Tahoma,Arial;background:linear-gradient(135deg,#0a0e1a,#1a1a2e);min-height:100vh;color:#fff;padding:20px}
        .container{max-width:800px;margin:0 auto}
        h1{text-align:center;margin-bottom:30px;color:#00d4ff;text-shadow:0 0 20px rgba(0,212,255,0.5)}
        .card{background:rgba(15,22,41,0.9);border-radius:16px;padding:24px;margin-bottom:20px;border:1px solid rgba(0,212,255,0.2)}
        .card h2{color:#00d4ff;margin-bottom:16px;font-size:18px}
        textarea{width:100%;height:150px;background:#0a0e1a;border:1px solid rgba(0,212,255,0.3);border-radius:8px;color:#fff;padding:12px;font-size:14px;resize:vertical}
        textarea:focus{outline:none;border-color:#00d4ff}
        input[type="text"]{width:100%;background:#0a0e1a;border:1px solid rgba(0,212,255,0.3);border-radius:8px;color:#fff;padding:12px;font-size:14px}
        input:focus{outline:none;border-color:#00d4ff}
        .btn{padding:12px 24px;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:bold;transition:all 0.3s}
        .btn-primary{background:linear-gradient(135deg,#00d4ff,#0066ff);color:#fff}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 5px 20px rgba(0,212,255,0.4)}
        .btn-secondary{background:rgba(255,255,255,0.1);color:#fff}
        .btn-group{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
        .result{margin-top:20px;padding:16px;background:rgba(0,212,255,0.1);border-radius:8px;display:none}
        .result.show{display:block}
        .result-row{display:flex;gap:10px;align-items:center;margin-bottom:10px}
        .result-row input{flex:1;margin:0}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
        .stat{background:rgba(0,212,255,0.1);padding:16px;border-radius:8px;text-align:center}
        .stat-value{font-size:24px;font-weight:bold;color:#00d4ff}
        .stat-label{font-size:12px;color:#888;margin-top:4px}
        .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(100px);background:#00d4ff;color:#000;padding:12px 24px;border-radius:8px;font-weight:bold;transition:transform 0.3s;z-index:1000}
        .toast.show{transform:translateX(-50%) translateY(0)}
        @media(max-width:600px){.stats{grid-template-columns:repeat(2,1fr)}.result-row{flex-direction:column}.result-row input{width:100%}}
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SubLink Generator</h1>
        <div class="stats">
            <div class="stat"><div class="stat-value" id="vlessCount">0</div><div class="stat-label">VLESS</div></div>
            <div class="stat"><div class="stat-value" id="vmessCount">0</div><div class="stat-label">VMess</div></div>
            <div class="stat"><div class="stat-value" id="trojanCount">0</div><div class="stat-label">Trojan</div></div>
            <div class="stat"><div class="stat-value" id="ssCount">0</div><div class="stat-label">SS/SSR</div></div>
        </div>
        <div class="card">
            <h2>📝 کانفیگ‌ها را وارد کنید</h2>
            <textarea id="configInput" placeholder="هر کانفیگ در یک خط:
vless://...
vmess://...
trojan://..."></textarea>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="generate()">🚀 ساخت لینک</button>
                <button class="btn btn-secondary" onclick="clearAll()">🗑️ پاک کردن</button>
            </div>
        </div>
        <div class="result" id="result">
            <h3 style="margin-bottom:16px;color:#00d4ff">✅ لینک اشتراک:</h3>
            <div class="result-row">
                <input type="text" id="subLink" readonly>
                <button class="btn btn-primary" onclick="copyLink()">📋 کپی</button>
            </div>
            <p style="color:#888;font-size:12px;margin-top:8px">v2rayNG > ≡ > Subscription group setting > + > paste</p>
        </div>
    </div>
    <div class="toast" id="toast"></div>
    <script>
        var subLink = '';

        function getConfigs() {
            var input = document.getElementById('configInput').value.trim();
            var lines = input.split(/[\\r\\n]+/);
            var result = [];
            for (var i = 0; i < lines.length; i++) {
                var t = lines[i].trim();
                if (t.indexOf('vless://') === 0 || t.indexOf('vmess://') === 0 || 
                    t.indexOf('trojan://') === 0 || t.indexOf('ss://') === 0 || t.indexOf('ssr://') === 0) {
                    result.push(t);
                }
            }
            return result;
        }

        function generate() {
            var configs = getConfigs();
            if (configs.length === 0) { toast('کانفیگ معتبر وارد کنید', true); return; }
            
            var data = configs.join('\\n');
            var encoded = btoa(unescape(encodeURIComponent(data)));
            // Make URL-safe
            encoded = encoded.replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
            subLink = location.origin + '/s/' + encoded;
            
            document.getElementById('subLink').value = subLink;
            document.getElementById('result').classList.add('show');
            updateStats();
            toast('لینک ساخته شد! ✅');
        }

        function copyLink() {
            var el = document.getElementById('subLink');
            el.select();
            document.execCommand('copy');
            toast('کپی شد! 📋');
        }

        function clearAll() {
            document.getElementById('configInput').value = '';
            document.getElementById('result').classList.remove('show');
            subLink = '';
            updateStats();
        }

        function updateStats() {
            var list = getConfigs();
            var v=0, m=0, t=0, s=0;
            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                if (c.indexOf('vless://') === 0) v++;
                else if (c.indexOf('vmess://') === 0) m++;
                else if (c.indexOf('trojan://') === 0) t++;
                else s++;
            }
            document.getElementById('vlessCount').textContent = v;
            document.getElementById('vmessCount').textContent = m;
            document.getElementById('trojanCount').textContent = t;
            document.getElementById('ssCount').textContent = s;
        }

        function toast(msg, err) {
            var t = document.getElementById('toast');
            t.textContent = msg;
            t.style.background = err ? '#ff4757' : '#00d4ff';
            t.classList.add('show');
            setTimeout(function() { t.classList.remove('show'); }, 2500);
        }

        document.getElementById('configInput').addEventListener('input', updateStats);
    </script>
</body>
</html>`;

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const cors = { 
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: cors });
        }

        // Main page
        if (path === '/' || path === '') {
            return new Response(HTML, { 
                headers: { 'Content-Type': 'text/html;charset=UTF-8' } 
            });
        }

        // Subscription endpoint
        if (path.startsWith('/s/')) {
            try {
                let encoded = path.slice(3);
                // Restore from URL-safe base64
                encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
                while (encoded.length % 4) encoded += '=';
                
                const decoded = decodeURIComponent(escape(atob(encoded)));
                
                // Return base64 for v2rayNG
                const encoder = new TextEncoder();
                const bytes = encoder.encode(decoded);
                let binary = '';
                for (let i = 0; i < bytes.length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);
                
                return new Response(base64, {
                    headers: { 
                        'Content-Type': 'text/plain;charset=UTF-8',
                        'Profile-Update-Interval': '24',
                        ...cors 
                    }
                });
            } catch (e) {
                return new Response('Invalid', { status: 400, headers: cors });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};
