import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5174', 'http://192.168.1.36:5174', 'http://192.168.1.63:5174'],
  credentials: true
}));

// Proxy all requests to the actual API
app.use('/', createProxyMiddleware({
  target: 'https://skyvendamz-1.onrender.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // remove /api prefix when forwarding
  },
  onProxyRes: function(proxyRes, req, res) {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy running on http://localhost:${PORT}`);
  console.log(`Use http://localhost:${PORT}/api/your-endpoint to access the API`);
});
