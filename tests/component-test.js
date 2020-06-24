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
  QUnit.module('component', function () {
    const dest = 'packages/engines/dashboards';
    hooks.afterEach(async function () {
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/components/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'app/components/sample.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample-test.js'));

      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/components/sample2.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'app/components/sample2.js'));
      await fs.remove(
        path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample2-test.js')
      );

      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/components/sample3.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'app/components/sample3.js'));
      await fs.remove(path.join(FIXTURE_PATH, dest, 'addon/templates/components/sample3.hbs'));
      await fs.remove(
        path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample3-test.js')
      );
    });

    QUnit.test('should move a component', async function (assert) {
      const result = await execa(EXECUTABLE_PATH, ['component', 'sample3', dest], execOpts);

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/components/sample3.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/components/sample3.js')));
      assert.ok(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample3-test.js')
        )
      );
    });

    QUnit.test('should move a component without pods', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['component', 'sample', dest, '--pods', 'false'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/components/sample.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/components/sample.js')));
      assert.ok(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample-test.js')
        )
      );
    });

    QUnit.test('should move a component from a namespace', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['component', 'sample', dest, '-f', 'my-components', '--pods', 'false'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/components/sample.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/components/sample.js')));
      assert.ok(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample-test.js')
        )
      );
    });

    QUnit.test('should not move a component with dry-run', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['component', 'sample', dest, '-d', '--pods', 'false'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/components/sample.js')));
      assert.notOk(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/components/sample.js')));
      assert.notOk(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample-test.js')
        )
      );
    });

    QUnit.test('should emit a warning if there is no test', async function (assert) {
      const result = await execa(
        EXECUTABLE_PATH,
        ['component', 'sample2', dest, '--pods', 'false'],
        execOpts
      );

      assert.equal(result.exitCode, 0, 'exited with zero');

      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'addon/components/sample2.js')));
      assert.ok(fs.pathExistsSync(path.join(FIXTURE_PATH, dest, 'app/components/sample2.js')));
      assert.notOk(
        fs.pathExistsSync(
          path.join(FIXTURE_PATH, dest, 'tests/integration/components/sample2-test.js')
        )
      );
      assert.ok(result.stdout.includes('WARNING'));
    });
  });
});
