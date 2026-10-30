import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../../static/profesor.js', import.meta.url), 'utf8');

// DOM mínimo para ejecutar el script real; no reproduce la lógica del formulario.
function element() {
  return { children: [], handlers: {}, hidden: false, disabled: false, value: '', checked: false,
    textContent: '', dataset: {}, classList: { add() {}, remove() {} },
    addEventListener(name, handler) { this.handlers[name] = handler; },
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = nodes; },
    setAttribute() {}, focus() {}, showModal() {}, close() {}, click() {},
  };
}
async function panel(response, racing = true) {
  const nodes = new Map();
  const get = id => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); };
  const navigation = []; const posts = [];
  const location = { hash: '#t=test-teacher', hostname: 'localhost', assign(url) { navigation.push(url); } };
  const context = vm.createContext({ document: { getElementById: get, createElement: element },
    location, window: { addEventListener() {} }, sessionStorage: { getItem() { return null; } },
    URLSearchParams, setTimeout() { return 1; }, clearTimeout() {}, setInterval() { return 2; }, clearInterval() {},
    fetch: async (path, options) => {
      if (options?.method !== 'POST') return { status: 200, ok: true, json: async () => [] };
      posts.push(path);
      if (response instanceof Error) throw response;
      return response;
    },
  });
  vm.runInContext(source, context, { filename: 'profesor.js' });
  await new Promise(resolve => setImmediate(resolve));
  get('race-mode').checked = racing;
  const button = element();
  await get('new-session').handlers.submit({ preventDefault() {}, submitter: button });
  return { message: get('status').children.map(node => node.textContent).join(''), navigation, posts, button, nodes, location };
}
function reply(status, body) { return { status, ok: status < 400, json: async () => body }; }

for (const [status, message] of [[409, 'No hay alumnos disponibles.'], [503, 'No se pudo cargar el catálogo.']]) {
  test(`El panel muestra rechazo ${status} como texto`, async () => {
    const result = await panel(reply(status, { error: message }));
    assert.equal(result.message, message);
    assert.equal(result.navigation.length, 0);
    assert.equal(result.posts.length, 1);
    assert.equal(result.button.disabled, false);
  });
}
for (const error of [undefined, null, 4, {}, '']) {
  test(`Mensaje alternativo para error ${JSON.stringify(error)}`, async () => {
    const result = await panel(reply(503, { error }));
    assert.equal(result.message, 'No se pudo preparar la carrera.');
    assert.equal(result.button.disabled, false);
  });
}
test('Texto con HTML se entrega a textContent', async () => {
  const result = await panel(reply(409, { error: '<img src=x onerror=alert(1)>' }));
  assert.equal(result.message, '<img src=x onerror=alert(1)>');
  assert.equal(result.nodes.get('status').children[0].children.length, 0);
});
test('401 conserva el mensaje de autenticación', async () => {
  const result = await panel(reply(401, { error: 'No usar este texto' }));
  assert.match(result.message, /Enlace del panel no válido/);
  assert.equal(result.button.disabled, false);
});
for (const response of [new Error('No revelar excepción'), { status: 503, ok: false, json: async () => { throw new Error('JSON ilegible'); } }]) {
  test('Fallo técnico conserva el mensaje de conexión', async () => {
    const result = await panel(response);
    assert.match(result.message, /No se pudo conectar con la app/);
    assert.equal(result.navigation.length, 0);
    assert.equal(result.button.disabled, false);
  });
}
test('Éxito abre la presentación una sola vez', async () => {
  const result = await panel(reply(201, { id: 'synthetic' }));
  assert.equal(result.navigation.length, 1);
  assert.match(result.navigation[0], /race-display.html\?r=synthetic/);
  assert.equal(result.button.disabled, false);
});
test('Rechazo de clase normal conserva el tratamiento anterior', async () => {
  const result = await panel(reply(409, { error: 'No mostrar catálogo' }), false);
  assert.match(result.message, /No se pudo conectar con la app/);
  assert.equal(result.posts[0], '/api/sessions');
});
test('Clase normal satisfactoria conserva la navegación del panel', async () => {
  const result = await panel(reply(201, { id: 'normal' }), false);
  assert.equal(result.navigation.length, 0);
  assert.match(result.location.hash, /s=normal/);
});
