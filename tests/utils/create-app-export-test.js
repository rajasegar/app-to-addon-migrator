const QUnit = require('qunit');
const path = require('path');
const fse = require('fs-extra');

const CreateAppExport = require('../../src/utils/create-app-export');

const FIXTURE_PATH = path.join(__dirname, '..', 'fixtures/input');

QUnit.module('atam-cli', function (hooks) {
  hooks.beforeEach(function () {
    process.chdir(FIXTURE_PATH);
  });

  QUnit.module('#updateImports validator', function (hooks) {
    let componentPath, componentContent;

    hooks.beforeEach(function () {
      componentPath = 'app/components/sample3/component.js';
      componentContent = fse.readFileSync(componentPath);
    });

    hooks.afterEach(function () {
      fse.writeFileSync(componentPath, componentContent.toString());
    });

    QUnit.test('should update the import paths with the new addon re-export path', async function (
      assert
    ) {
      let oldImportPath = '/constants/sample2';
      let newImportPath = '@company/dashboard/constants/sample2';
      let componentContentAsString = componentContent.toString();
      assert.ok(fse.pathExistsSync(componentPath));

      assert.ok(componentContentAsString.includes(oldImportPath));
      assert.notOk(componentContentAsString.includes(newImportPath));

      let options = {
        fileName: 'sample2',
        sourceFile: 'app/constants/sample2.js',
        fileOptions: {
          ext: 'js',
          type: 'constants',
        },
        packagePath: 'packages/engines/dashboards',
        destination: 'packages/engines/dashboards',
        fileType: 'Constant',
      };

      await CreateAppExport(options);

      let updatedComponentContent = fse.readFileSync(componentPath);
      assert.ok(updatedComponentContent.toString().includes(newImportPath));
    });
  });
});
