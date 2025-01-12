import { NextResponse } from 'next/server';

// GET metodu - Tüm kokuları getir
export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('API URL tanımlı değil');
      return NextResponse.json({ error: 'API yapılandırması eksik' }, { status: 500 });
    }

    const response = await fetch(`${apiUrl}/kokular`);
    if (!response.ok) {
      console.error('API yanıt hatası:', response.status, response.statusText);
      return NextResponse.json({ error: 'API yanıt hatası' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Kokular getirme hatası:', error);
    return NextResponse.json({ 
      error: 'Kokular getirilemedi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

// POST metodu - Yeni koku ekle
export async function POST(request: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'API yapılandırması eksik' }, { status: 500 });
    }

    const kokuData = await request.json();
    
    const response = await fetch(`${apiUrl}/kokular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kokuData),
    });

    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Koku ekleme hatası:', error);
    return NextResponse.json({ 
      error: 'Koku eklenemedi',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 