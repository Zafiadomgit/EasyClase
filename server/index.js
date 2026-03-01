import app from './server.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor EasyClase ejecutándose en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Estado: http://localhost:${PORT}/api/status`);
  console.log(`🔧 NODE_ENV: ${process.env.NODE_ENV}`);
});
