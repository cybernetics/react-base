import fs from 'fs';
import path from 'path';
import expect from 'expect';
import { fileExists, writeFile } from '../../FileSystem';
import { RegenerateImportLine, RegenerateExportLine, getContainerReducers, RegenerateReducerIndex } from '../RegenerateReducerIndex';

describe('shared / Generators / RegenerateReducerIndex', () => {

  describe('RegenerateImportLine', () => {

    it('Sould return the import line of a reducer', () => {

      const procesedImport = RegenerateImportLine('Main');
      const expectedImport = 'import Main from \'containers/Main/reducers\';';

      expect(procesedImport).toEqual(expectedImport);

    });
  });

  describe('RegenerateExportLine', () => {

    it('Sould return the export line for models', () => {

      const procesedExport = RegenerateExportLine('Main');
      const expectedExport = '\n\nexport default combineReducers({\nMain\n});';

      expect(procesedExport).toEqual(expectedExport);

    });
  });


  describe('getContainerModels', () => {

    it('Sould return an object with avaiable reducers for import', () => {

      const containersPath = path.resolve(__dirname, '..', '..', '..', 'containers');
      const result = getContainerReducers(containersPath);

      const containers = fs.readdirSync(containersPath);
      const expectedResult = containers.map(function(container){

        let reducerPath = path.resolve(containersPath, container, 'reducers','index.js');
        try{
          fs.accessSync(reducerPath);
          return { name:container, import: RegenerateImportLine(container)};
        }catch(e){
          return { name: container, import: null };
        }
      });

      expect(result).toEqual(expectedResult);

    });
  });

  describe('RegenerateReducerIndex', () => {

    it('Sould write the reducer index file', () => {
      const containersPath = path.resolve(__dirname, '..', '..', '..', 'containers');
      const fakeReducerPath = path.resolve(__dirname, 'fake.js');
      const result = RegenerateReducerIndex(containersPath, fakeReducerPath);

      expect(result).toEqual(true);
      expect(fileExists(fakeReducerPath)).toEqual(true);
      fs.unlink(fakeReducerPath);

    });
  });
});
