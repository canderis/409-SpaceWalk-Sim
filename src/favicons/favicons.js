const faviconsContext = require.context(
    '!!file-loader?name=[name].[ext]!.',
    true,
    /\.(svg|png|ico|xml|web)$/
  );
  faviconsContext.keys().forEach(faviconsContext);