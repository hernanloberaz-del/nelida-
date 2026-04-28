// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { mensaje, rol } = req.body;
  const project_id = "extreme-ability-464314-a3";
  
  // Vercel leerá las credenciales desde las variables de entorno
  const credentials = JSON.parse(process.env.GOOGLE_JSON);

  try {
    // Aquí llamamos al motor Enterprise de Google Cloud
    const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${project_id}/locations/us-central1/publishers/google/models/gemini-1.5-flash:streamGenerateContent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, // Esto lo manejaremos en el panel de Vercel
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Eres Nélida. Tu especialidad es ${rol}. Responde de forma profesional al siguiente mensaje: ${mensaje}` }] }]
      })
    });

    const data = await response.json();
    const textoRespuesta = data[0].candidates[0].content.parts[0].text;

    res.status(200).json({ respuesta: textoRespuesta });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor de Nélida" });
  }
}