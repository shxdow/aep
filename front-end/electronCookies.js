const cookies = {};

const get = (name) => cookies[name];

const set = (name, value) => { cookies[name] = value; };

const parseFromHeader = (header) => {
  const hs = Array.isArray(header) ? header : [header];
  hs.forEach((c) => {
    const [name, value] = c.split(';')[0].split('=');
    set(name, value);
  });
};

const stringify = () => {
  return Object.entries(cookies).map((x) => x.join('=')).join('; ');
};

module.exports = { get, set, parseFromHeader, stringify };
