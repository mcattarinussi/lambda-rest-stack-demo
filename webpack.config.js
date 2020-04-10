const fs = require('fs');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const LAMBDA_HANDLERS_FOLDER = path.join(__dirname, 'src/app/handlers');
const OUTPUT_FOLDER = path.join(__dirname, 'dist');

const createLambdaEntryMap = indexName =>
    fs
        .readdirSync(LAMBDA_HANDLERS_FOLDER)
        .filter(path => !path.endsWith('.ts'))
        .reduce(
            (acc, name) => ({
                ...acc,
                [name]: ['source-map-support/register', path.join(LAMBDA_HANDLERS_FOLDER, name, indexName)],
            }),
            {}
        );

const commonConfig = {
    devtool: 'source-map',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    node: {
        __dirname: false,
    },
};

const createAppConfig = mode => ({
    ...commonConfig,
    entry: createLambdaEntryMap(mode === 'development' ? 'index.local.ts' : 'index.ts'),
    output: {
        path: path.join(OUTPUT_FOLDER, 'app/handlers'),
        libraryTarget: 'commonjs2',
        filename: '[name]/index.js',
    },
    // unfortunately we can not use nodeExternals in dev mode since sam local start-api will run
    // the handler in a container that does not have access to the node_modules on the host
    externals: mode === 'development' ? [] : ['aws-sdk'],
});

const infrastructureConfig = {
    ...commonConfig,
    entry: {
        index: path.join(__dirname, 'src/infrastructure/index.ts'),
    },
    output: {
        path: path.join(OUTPUT_FOLDER, 'infrastructure'),
        libraryTarget: 'commonjs2',
        filename: 'index.js',
    },
    optimization: {
        minimize: false,
        concatenateModules: false,
    },
    externals: [nodeExternals()],
};

module.exports = (_, argv) => [createAppConfig(argv.mode), infrastructureConfig];
