//  ocrLocal.js — OCR via OCR.space API (base64, Expo Go)

const OCR_API_KEY = 'K87770023188957';
const OCR_API_URL = 'https://api.ocr.space/parse/image';

export async function processarOcrLocal(uri) {
  try {
    // OCR.space aceita base64 via FormData no campo 'base64Image'
    // mas o valor deve ser apenas a string base64 sem o prefixo data:...
    const response = await fetch(uri);
    const blob     = await response.blob();
    const base64   = await blobToBase64(blob);

    // Remove o prefixo "data:image/jpeg;base64," — OCR.space quer só os dados
    const base64Data = base64.split(',')[1];
    const mimeType   = base64.split(';')[0].split(':')[1] || 'image/jpeg';

    const formData = new FormData();
    formData.append('apikey',            OCR_API_KEY);
    formData.append('base64Image',       `data:${mimeType};base64,${base64Data}`);
    formData.append('language',          'por');
    formData.append('isOverlayRequired', 'false');
    formData.append('scale',             'true');
    formData.append('OCREngine',         '2');

    const ocrResponse = await fetch(OCR_API_URL, {
      method: 'POST',
      body:   formData,
    });

    const data = await ocrResponse.json();
    console.log('OCR.space raw:', JSON.stringify(data).substring(0, 400));

    if (data.IsErroredOnProcessing || !data.ParsedResults?.length) {
      console.warn('OCR.space erro:', data.ErrorMessage);
      return vazio();
    }

    const texto = data.ParsedResults[0].ParsedText || '';
    console.log('OCR texto:', texto.substring(0, 300));

    return {
      textoCompleto:   texto,
      horasDetectadas: detectarHoras(texto),
      dataDetectada:   detectarData(texto),
      sucesso:         texto.length > 0,
    };
  } catch (err) {
    console.warn('OCR falhou:', err.message);
    return vazio();
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror   = reject;
    reader.readAsDataURL(blob);
  });
}

function vazio() {
  return { textoCompleto: '', horasDetectadas: null, dataDetectada: null, sucesso: false };
}

function detectarHoras(texto) {
  if (!texto) return null;
  const padroes = [
    /carga\s*hor[aá]ria[^\d]*(\d+)/i,
    /dura[çc][aã]o[^\d]*(\d+)\s*h/i,
    /total[^\d]*(\d+)\s*(?:horas?|h\b)/i,
    /carga[^\d]*(\d+)\s*h/i,
    /(\d+)\s*(?:horas?|h\b)/i,
  ];
  for (const p of padroes) {
    const m = texto.match(p);
    if (m) {
      const h = parseInt(m[1], 10);
      if (h > 0 && h <= 1000) return h;
    }
  }
  return null;
}

function detectarData(texto) {
  if (!texto) return null;
  const padroes = [
    /(\d{2}\/\d{2}\/\d{4})/,
    /(\d{2}-\d{2}-\d{4})/,
    /(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/i,
  ];
  for (const p of padroes) {
    const m = texto.match(p);
    if (m) return m[1];
  }
  return null;
}