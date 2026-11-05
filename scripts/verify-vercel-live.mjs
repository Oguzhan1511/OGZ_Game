if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdout.write('Ready for live verification JSON on stdin (hidden).\n');
let input = '';
for await (const chunk of process.stdin) {
  input += chunk;
  if (input.includes('\n')) break;
}
if (process.stdin.isTTY) process.stdin.setRawMode(false);
const config = JSON.parse(input.trim());
const origin = config.origin;
const assert = (value, message) => {
  if (!value) throw Error(message);
};
const home = await fetch(origin);
assert(home.ok, 'Homepage failed');
assert((await home.text()).includes('Oda oluştur'), 'Homepage content missing');
const blocked = await fetch(origin + '/api/admin/listings');
assert(blocked.status === 401, 'Anonymous admin was not blocked');
const login = await fetch(origin + '/api/admin/login', {
  method: 'POST',
  headers: { origin, 'content-type': 'application/json' },
  body: JSON.stringify({ username: config.username, password: config.password }),
});
assert(login.ok, 'Login HTTP ' + login.status);
const cookie = login.headers.get('set-cookie')?.split(';')[0];
assert(cookie, 'Session cookie missing');
const admin = await fetch(origin + '/admin', { headers: { cookie } });
assert(
  admin.ok && (await admin.text()).includes('Hangi oyun modunu yönetelim?'),
  'Admin mode selector failed'
);
const inventory = await fetch(origin + '/api/admin/listings', { headers: { cookie } });
assert(inventory.ok, 'Inventory failed');
const { listings } = await inventory.json();
assert(listings.length > 0, 'Inventory empty');
const token = crypto.randomUUID();
let code;
const api = async (action, extra = {}) => {
  const response = await fetch(origin + '/api/room', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, token, code, ...extra }),
  });
  const body = await response.json();
  assert(response.ok, 'Room ' + action + ': ' + (body.error || response.status));
  return body;
};
try {
  const room = await api('create', {
    profile: { name: 'Yayın testi', avatar: 'a0' },
    mode: 'car-price',
    rounds: 10,
    guessSeconds: 120,
  });
  code = room.code;
  const started = await api('start');
  assert(
    started.state === 'playing' && !started.price && !started.customCars,
    'Game start or price privacy failed'
  );
  for (const path of [started.car[9], started.car[10].damageImage]) {
    const image = await fetch(origin + path);
    assert(
      image.ok && image.headers.get('content-type')?.startsWith('image/'),
      'Game image failed'
    );
  }
  const result = await api('guess', { guess: 1000000 });
  assert(result.state === 'reveal' && result.results.length === 1, 'Guess/reveal failed');
  const next = await api('next');
  assert(next.round === 1 && next.car[10].id !== started.car[10].id, 'Next unique round failed');
  console.log(
    JSON.stringify({
      verified: true,
      homepage: home.status,
      anonymousAdmin: blocked.status,
      adminLogin: login.status,
      listings: listings.length,
      active: listings.filter(item => !item.archived).length,
      roomFlow: true,
      photoAndDamage: true,
      uniqueRounds: true,
    })
  );
} finally {
  if (code) await api('close');
}
process.exit(0);
