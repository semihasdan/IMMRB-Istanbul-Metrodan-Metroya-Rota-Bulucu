const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Station = require('../models/Station');

dotenv.config();

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB bağlantısı başarılı');
    importData();
}).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
});

const importData = async () => {
    try {
        // JSON dosyasını oku
        const jsonData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../../data.json'), 'utf-8')
        );

        // Mevcut verileri temizle
        await Station.deleteMany();

        // İstasyon verilerini dönüştür
        const stations = jsonData.features.map(feature => ({
            name: feature.properties.ISTASYON,
            coordinates: {
                type: 'Point',
                coordinates: feature.geometry.coordinates
            },
            line: feature.properties.PROJE_ADI,
            status: feature.properties.PROJE_ASAMA,
            department: feature.properties.MUDURLUK
        }));

        // Verileri kaydet
        await Station.insertMany(stations);

        console.log('Veriler başarıyla içe aktarıldı');
        process.exit(0);
    } catch (error) {
        console.error('Veri içe aktarma hatası:', error);
        process.exit(1);
    }
}; 