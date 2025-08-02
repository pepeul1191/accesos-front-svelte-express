import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.POSTMAN_API_KEY;
const WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;
const OUTPUT_DIR = './requests';
const FILE_NAME = 'Backend de Accesos.postman.json';

const restoreCollection = async () => {
  try {
    // Verificar variables de entorno
    if (!API_KEY) {
      throw new Error('POSTMAN_API_KEY no está definida en el archivo .env');
    }

    const inputPath = `${OUTPUT_DIR}/${FILE_NAME}`;
    console.log(`📦 Restaurando desde archivo: ${inputPath}`);
    
    // Verificar que el archivo exista
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Archivo no encontrado: ${inputPath}`);
    }
    
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log('📝 Datos a enviar:', JSON.stringify({ 
      info: data.info?.name || 'Nombre no encontrado',
      items: data.item?.length || 0 
    }, null, 2));
    
    // Headers comunes
    const headers = { 
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json'
    };
    
    // Parámetros
    const params = WORKSPACE_ID ? { workspace: WORKSPACE_ID } : {};
    
    // Determinar si es colección o entorno
    if (data.info && data.info.schema) {
      // Es una colección
      console.log('🚀 Enviando colección a Postman API...');
      
      const response = await axios.post('https://api.getpostman.com/collections', 
        { collection: data },
        { headers, params }
      );
      
      console.log('✅ Colección restaurada con ID:', response.data.collection.id);
    } else if (data.values !== undefined) {
      // Es un entorno
      console.log('🚀 Enviando entorno a Postman API...');
      
      const response = await axios.post('https://api.getpostman.com/environments', 
        { environment: data },
        { headers, params }
      );
      
      console.log('✅ Entorno restaurado con ID:', response.data.environment.id);
    } else {
      throw new Error('El archivo no es una colección ni entorno válido de Postman');
    }
  } catch (error) {
    console.error('❌ Error al restaurar:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Message:', error.message);
    }
    
    process.exit(1);
  }
};

// Ejecutar
(async () => {
  try {
    await restoreCollection();
    console.log('🎉 Proceso completado exitosamente!');
  } catch (error) {
    console.error('🔥 Error final:', error.message);
  }
})();