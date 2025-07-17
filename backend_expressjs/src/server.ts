import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
