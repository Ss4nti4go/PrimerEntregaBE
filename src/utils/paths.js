import path from 'path';

const ROOT_PATH = path.resolve();
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const DATA_PATH = path.resolve(SRC_PATH, 'data');

const paths = {
    root: ROOT_PATH,
    src: SRC_PATH,
    data: DATA_PATH
};

export default paths;