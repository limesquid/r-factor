const a = () => {
  files.map((file) => ({
    name: `prop-types/inside/${file}.js -> prop-types/outside/${file}.js`,
    input: readFile(`prop-types/inside/${file}.js`),
    output: readFile(`prop-types/outside/${file}.js`)
  }));
};
