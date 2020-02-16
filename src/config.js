module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/reviewstream',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/reviewstream-test',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://reviewstream-app.dhutchings36.now.sh/',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
  }