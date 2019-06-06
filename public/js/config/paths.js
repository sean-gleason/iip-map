const path = require( 'path' );
const fs = require( 'fs' );

const appDirectory = fs.realpathSync( process.cwd() );
const resolveApp = relativePath => path.resolve( appDirectory, relativePath );

module.exports = {
  dotenv: resolveApp( '.env' ),
  appDist: resolveApp( 'dist' ),
  appPublic: resolveApp( 'public' ),
  appHtml: resolveApp( 'public/index.html' ),
  appIndexJs: resolveApp( 'src/draw-map.js' ),
  appPackageJson: resolveApp( 'package.json' ),
  appSrc: resolveApp( 'src' )
};
