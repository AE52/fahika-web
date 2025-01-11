import express, { Request, Response } from 'express';
import { Koku } from '../models/Koku';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Arama terimi gerekli' });
    }

    const searchRegex = new RegExp(q, 'i');

    const kokular = await Koku.find({
      $or: [
        { isim: searchRegex },
        { aciklama: searchRegex },
        { koku_notlari: searchRegex }
      ]
    }).select('id isim slug ana_fotograf fiyat kategori hacim');

    res.json({ kokular });
  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({ error: 'Arama yapılırken bir hata oluştu' });
  }
});

export default router; 