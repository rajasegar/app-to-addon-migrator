const QUnit = require('qunit');
const path = require('path');
const fse = require('fs-extra');

const CreateAppExport = require('../../src/utils/create-app-export');

const FIXTURE_PATH = path.join(__dirname, '..', 'fixtures/input');

QUnit.module('atam-cli', function (hooks) {
  let componentPath, componentContent;

  hooks.beforeEach(function () {
    process.chdir(FIXTURE_PATH);
    componentPath = 'app/components/sample3/component.js';
    componentContent = fse.readFileSync(componentPath);
  });

  hooks.afterEach(function () {
    fse.writeFileSync(componentPath, componentContent.toString());
  });

  QUnit.module('#updateImports validator', function () {
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

  QUnit.module('#updateImports exclude files', function (hooks) {
    let mixinPath, mixinContent;

    hooks.beforeEach(function () {
      mixinPath = 'app/mixins/sample.js';
      mixinContent = fse.readFileSync(mixinPath);
    });

    hooks.afterEach(function () {
      fse.writeFileSync(mixinPath, mixinContent.toString());
    });

    QUnit.test(
      'should not update the imports for the paths given in gitignore file',
      async function (assert) {
        let oldImportPath = '/constants/sample2';
        let newImportPath = '@company/dashboard/constants/sample2';
        let mixinContentAsString = mixinContent.toString();
        assert.ok(fse.pathExistsSync(mixinPath));

        assert.ok(mixinContentAsString.includes(oldImportPath));
        assert.notOk(mixinContentAsString.includes(newImportPath));

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

        let updatedmixinContent = fse.readFileSync(mixinPath);
        assert.notOk(updatedmixinContent.toString().includes(newImportPath));
      }
    );
  });
});
