const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const QUnit = require('qunit');

const PROJECT_ROOT = path.join(__dirname, '..');
const EXECUTABLE_PATH = path.join(PROJECT_ROOT, 'bin', 'cli.js');
const FIXTURE_PATH = path.join(__dirname, 'fixtures/input');

// resolved from the root of the project
const inputDir = path.resolve('./tests/fixtures/input');
const execOpts = { cwd: inputDir, stderr: 'inherit' };

QUnit.module('atam-cli', function (hooks) {
  QUnit.module('route', function () {
    const dest = 'packages/engines/dashboards';
    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/routes/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/templates/sample.hbs'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'tests/unit/routes/sample-test.js'));

      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/controllers/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'tests/unit/controllers/sample-test.js'));
    });

    QUnit.test('should move a route', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['route', 'sample', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/routes/sample.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/templates/sample.hbs')));
      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/routes/sample-test.js'))
      );

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/controllers/sample.js')));
      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/controllers/sample-test.js'))
      );
    });

    QUnit.test('should move an route from a namespace', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['route', 'sample', dest, '-f', 'my-routes'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/routes/sample.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/templates/sample.hbs')));
      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/routes/sample-test.js'))
      );

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/controllers/sample.js')));
      assert.ok(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/controllers/sample-test.js'))
      );
    });

    QUnit.test('should not move an route with dry-run', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['route', 'sample', dest, '-d'], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/routes/sample.js')));
      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/templates/sample.hbs')));
      assert.notOk(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/routes/sample-test.js'))
      );

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/controllers/sample.js')));
      assert.notOk(
        fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'tests/unit/controllers/sample-test.js'))
      );
    });

    QUnit.test('should emit a warning if there is no test', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['route', 'sample2', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/routes/sample2.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/templates/sample2.hbs')));

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/controllers/sample2.js')));

      assert.ok(result.stdout.includes('WARNING'));
    });
  });
});
