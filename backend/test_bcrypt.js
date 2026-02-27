const bcrypt = require('bcryptjs');

const test = async () => {
    const hashFromDb = '$2b$10$Lgj/mUXvGb9bdSLlxSbqvObVZiSjouMnVfMljRararBnZzh57d62G';
    const passwordInput = 'admin123';

    const isMatch = await bcrypt.compare(passwordInput, hashFromDb);
    console.log('Match result:', isMatch);
    process.exit(0);
};

test();
