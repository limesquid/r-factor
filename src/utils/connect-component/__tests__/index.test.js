import ConnectBuilder from '../index';

describe('ConnectBuilder', () => {
  it('build', () => {
    const code = 'asdad';
    const builder = new Builder(code);
    expect(builder.build()).toBe(code);
  });
});
