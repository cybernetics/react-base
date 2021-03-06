import path from 'path';
import { symbols, color } from '../console';
import { fileExists, readDir, writeFile } from '../FileSystem';

const containersPath = path.resolve(__dirname, '..', '..', 'containers');
const routerPath = path.resolve(__dirname, '..', '..', 'routes','index.js');

let routesImports = 'import React from \'react\';\nimport { Route, IndexRoute } from \'react-router\';\n\nimport App from \'containers/App/\';';

function RegenerateRoutes(){
  const routes = getRoutes();
  let routesExports = '';
  let newRoutes = '';

  routes.forEach(function(route, index){
    if(route.import){
      routesImports += (index === 0) ? route.import : '\n' + route.import;
      newRoutes += '    <Route path="/' + route.name.toLowerCase() + '" component={ ' + route.name +' } />\n';
    }
  });

  newRoutes = generateRoutes(newRoutes);
  routesExports = generateRoutesExport(routesExports);
  let content = routesImports + newRoutes + routesExports;

  try{
    writeFile(routerPath, content);
    console.log('[BASE] ' + color('success', symbols.ok) + ' Routes regenerated correctly!');
    return true;
  } catch(e){
    console.log('[BASE] ' + color('error', symbols.err)  + ' ' + e.msg);
    return false;
  }
}

function generateRoutes(newRoutes){
  return '\n\nconst routes = (\n  <Route path="/" component={ App } >\n    <IndexRoute component={ Main } />\n' + newRoutes + '  </Route>\n);\n';
}


function generateRoutesExport(){
  return '\nexport default routes;';
}

function getRoutes(){
  const files = readDir(containersPath);
  return files.map(function(container){
    let containerPath = path.resolve(containersPath, container);
    if(fileExists(containerPath) && container !== 'App'){
      return { name:container, import:'import ' + container + ' from \'containers/'+ container +'/\';' };
    } else {
      return { name: container, import: null };
    }
  });
}

module.exports = RegenerateRoutes;
