const path = require( 'path' );
const fs = require( 'fs' );

const appDirectory = fs.realpathSync( process.cwd() );
const resolveApp = relativePath => path.resolve( appDirectory, relativePath );

module.exports = {
  dotenv: resolveApp( '.env' ),
  appDist: resolveApp( 'js/dist' ),
  appPublic: resolveApp( 'public' ),
  appHtml: resolveApp( 'public/index.html' ),
  appIndexJs: resolveApp( 'js/src/index.js' ),
  appPackageJson: resolveApp( 'package.json' ),
  appSrc: resolveApp( 'js/src' )
};
