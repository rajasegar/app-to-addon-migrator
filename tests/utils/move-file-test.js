const QUnit = require('qunit');
const path = require('path');
const fs = require('fs-extra');

const MoveFile = require('../../src/utils/move-file');

const FIXTURE_PATH = path.join(__dirname, '..', 'fixtures/input');
const HOST_TEST_PATH = 'tests';

QUnit.module('atam-cli', function (hooks) {
  hooks.beforeEach(function () {
    process.chdir(FIXTURE_PATH);
  });

  QUnit.module('#skipTests validator', function () {
    QUnit.test(
      'should move the tests inside the addon itself if skipTests is false',
      async function (assert) {
        let sourceFile = 'tests/integration/components/sample3/component-test.js';
        let destPath = 'packages/engines/dashboards/tests/integration/components/sample3-test.js';
        let options = {
          fileName: 'sample3',
          sourceFile,
          destPath,
          fileType: 'Component Test',
          deleteSource: false,
          skipTests: false,
          dryRun: false,
        };
        await MoveFile(options);
        assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, destPath)));
        await fs.remove(path.join(FIXTURE_PATH, destPath));
      }
    );

    QUnit.test(
      'should move the non test entity inside the addon itself even if skipTests is true',
      async function (assert) {
        let sourceFile = 'app/components/sample3/component.js';
        let destPath = 'packages/engines/dashboards/addon/components/sample3.js';
        let options = {
          fileName: 'sample3',
          sourceFile,
          destPath,
          fileType: 'Component',
          deleteSource: false,
          skipTests: true,
          dryRun: false,
        };
        await MoveFile(options);
        assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, destPath)));
        await fs.remove(path.join(FIXTURE_PATH, destPath));
      }
    );

    QUnit.test(
      'should move the tests inside the host app under the addon structure if skipTests is true',
      async function (assert) {
        let sourceFile = 'tests/integration/components/sample3/component-test.js';
        let destPath = 'packages/engines/dashboards/tests/integration/components/sample3-test.js';
        let options = {
          fileName: 'sample3',
          sourceFile,
          destPath,
          fileType: 'Component Test',
          deleteSource: false,
          skipTests: true,
          dryRun: false,
        };
        await MoveFile(options);
        assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, HOST_TEST_PATH, destPath)));
        assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, destPath)));
        await fs.remove(path.join(FIXTURE_PATH, HOST_TEST_PATH, destPath));
      }
    );
  });
});
