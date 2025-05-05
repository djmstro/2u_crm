import { MongoClient, ServerApiVersion } from 'mongodb';

// Переменные среды для MongoDB, которые нужно установить в Render
const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || '2u_studio_kb';

// Проверка наличия URI для подключения
if (!uri) {
  throw new Error('Пожалуйста, добавьте переменную среды MONGODB_URI');
}

// Опции для подключения к MongoDB
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Инициализация клиентского подключения
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// В режиме разработки используем глобальную переменную, 
// чтобы сохранить соединение между горячими перезагрузками
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // В производственном режиме создаем новое соединение
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Функция для получения экземпляра базы данных
export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

// Экспортируем Promise для подключения к MongoDB
export default clientPromise; 