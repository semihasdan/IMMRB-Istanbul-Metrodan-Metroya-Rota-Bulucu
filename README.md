# İstanbul Metrodan Metroya Rota Bulucu

Bu proje, İstanbul'daki metro hatları arasında en uygun rotayı bulan bir web uygulamasıdır.

## Özellikler

- İstanbul metro ağı üzerinde iki istasyon arası rota bulma
- İnteraktif metro haritası
- Gerçek zamanlı rota gösterimi

## Kurulum

### Gereksinimler

- Node.js (>= 18.0.0)
- npm

### Yerel Geliştirme

1. Projeyi klonlayın:
```bash
git clone https://github.com/semihasdan/IMMRB-Istanbul-Metrodan-Metroya-Rota-Bulucu.git
cd IMMRB-Istanbul-Metrodan-Metroya-Rota-Bulucu
```

2. Bağımlılıkları yükleyin:
```bash
npm run install-all
```

3. Back-end'i başlatın:
```bash
cd back-end
npm start
```

4. Yeni bir terminal açın ve front-end'i başlatın:
```bash
cd front-end
npm run dev
```

## Deployment

Bu proje Render.com üzerinde host edilmektedir:

- Frontend: https://istanbul-metro-route-frontend.onrender.com
- Backend API: https://istanbul-metro-route-backend.onrender.com

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=https://istanbul-metro-route-backend.onrender.com/api/routes
```

![image](https://github.com/user-attachments/assets/5d6bdf14-9d05-4eb9-b93e-ffda8d260d30)

